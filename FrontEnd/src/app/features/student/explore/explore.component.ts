import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ReferenceItem } from '../../../core/models/api.models';
import { Scholarship } from '../../../core/models/scholarship.models';
import {
  countryCoordinates,
  normalizeCountryName,
  webMercatorPosition
} from '../../../core/utils/country-geography';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StudentService } from '../../../core/services/student.service';
import { ScholarshipCardComponent } from '../../../shared/components/scholarship-card/scholarship-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';
import { AtlasDetailPanelComponent } from './components/atlas-detail-panel/atlas-detail-panel.component';
import { CountryNode, CountryNodeComponent } from './components/country-node/country-node.component';
import { ExploreFilterComponent } from './components/explore-filter/explore-filter.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    AtlasDetailPanelComponent,
    CountryNodeComponent,
    ExploreFilterComponent,
    ScholarshipCardComponent,
    UiStateComponent
  ],
  templateUrl: './explore.component.html'
})
export class ExploreComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly scholarshipApi = inject(ScholarshipService);
  private readonly catalogApi = inject(CatalogService);
  private readonly studentApi = inject(StudentService);

  readonly auth = inject(AuthService);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly scholarships = signal<Scholarship[]>([]);
  readonly countries = signal<ReferenceItem[]>([]);
  readonly universities = signal<ReferenceItem[]>([]);
  readonly categories = signal<ReferenceItem[]>([]);
  readonly favorites = signal<string[]>([]);
  readonly profileExists = signal(false);
  readonly selectedScholarship = signal<Scholarship | null>(null);

  readonly filters = this.fb.nonNullable.group({
    search: [this.route.snapshot.queryParamMap.get('search') ?? ''],
    country: [this.route.snapshot.queryParamMap.get('country') ?? ''],
    university: [''],
    category: [''],
    fundingType: [''],
    degree: [''],
    deadline: ['']
  });

  private readonly filterValues = toSignal(this.filters.valueChanges, {
    initialValue: this.filters.getRawValue()
  });

  readonly filteredScholarships = computed(() => {
    const filters = this.filterValues();
    const search = filters.search?.trim().toLocaleLowerCase() ?? '';
    const deadline = filters.deadline ? new Date(`${filters.deadline}T23:59:59`) : null;
    const selectedCountry = filters.country
      ? this.countries().find((item) => item._id === filters.country)
        ?? this.destinations().find((item) => item._id === filters.country)
      : null;

    return this.scholarships().filter((item) => {
      const matchesSearch = !search || [item.title, item.description, item.provider]
        .some((value) => value.toLocaleLowerCase().includes(search));
      const matchesCountry = !filters.country || (selectedCountry
        ? this.countryIdentity(this.countryReference(item)) === this.countryIdentity(selectedCountry)
        : this.referenceId(item.country) === filters.country);
      const matchesUniversity = !filters.university || this.referenceId(item.university) === filters.university;
      const matchesCategory = !filters.category || this.referenceId(item.category) === filters.category;
      const matchesFunding = !filters.fundingType || item.fundingType === filters.fundingType;
      const matchesDegree = !filters.degree || item.eligibility?.eligibleDegrees?.includes(filters.degree);
      const matchesDeadline = !deadline || new Date(item.deadline) <= deadline;
      return matchesSearch && matchesCountry && matchesUniversity && matchesCategory
        && matchesFunding && matchesDegree && matchesDeadline;
    });
  });

  readonly countryNodes = computed<CountryNode[]>(() => {
    const grouped = new Map<string, { country: ReferenceItem; count: number }>();

    this.filteredScholarships().forEach((item) => {
      const country = this.countryReference(item);
      if (!country) return;

      const normalized = normalizeCountryName(country.name);
      if (!normalized) return;
      const displayCountry: ReferenceItem = {
        ...country,
        name: normalized.name,
        code: country.code ?? normalized.code
      };
      const groupKey = displayCountry.code ?? normalized.name;
      const current = grouped.get(groupKey);
      grouped.set(groupKey, current
        ? { ...current, count: current.count + 1 }
        : { country: displayCountry, count: 1 });
    });

    return [...grouped.values()].flatMap(({ country, count }) => {
      const coordinates = countryCoordinates(country);
      return coordinates ? [{ country, count, ...webMercatorPosition(coordinates) }] : [];
    });
  });

  readonly destinations = computed(() => this.referenceOptions(this.scholarships(), (item) => this.countryReference(item), true));
  readonly availableUniversities = computed(() => this.referenceOptions(this.scholarships(), (item) => this.referenceFrom(item.university, this.universities())));
  readonly availableCategories = computed(() => this.referenceOptions(this.scholarships(), (item) => this.referenceFrom(item.category, this.categories())));
  readonly fundingTypes = computed(() => this.uniqueStrings(this.scholarships().map((item) => item.fundingType)));
  readonly degreeLevels = computed(() => this.uniqueStrings(this.scholarships().flatMap((item) => item.eligibility?.eligibleDegrees ?? [])));

  constructor() {
    forkJoin({
      scholarships: this.scholarshipApi.listAll(),
      catalogs: this.catalogApi.loadAll()
    }).subscribe({
      next: ({ scholarships, catalogs }) => {
        this.scholarships.set(scholarships);
        this.countries.set(catalogs.countries.data);
        this.universities.set(catalogs.universities.data);
        this.categories.set(catalogs.categories.data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error, 'Start the backend and refresh the Atlas.'));
        this.loading.set(false);
      }
    });

    if (this.auth.role() === 'student') {
      this.studentApi.getProfile().subscribe({
        next: ({ data }) => {
          this.profileExists.set(true);
          this.favorites.set((data.profile.favorites ?? []).map(String));
        },
        error: () => undefined
      });
    }
  }

  load(): void {
    this.loading.set(true);
    this.error.set('');

    this.scholarshipApi.listAll().subscribe({
      next: (scholarships) => {
        this.scholarships.set(scholarships);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  reset(): void {
    this.filters.reset();
    this.load();
  }

  selectCountry(id: string): void {
    const current = this.filters.controls.country.value;
    this.filters.controls.country.setValue(current === id ? '' : id);
  }

  toggleFavorite(item: Scholarship): void {
    const current = this.favorites();
    const next = current.includes(item._id)
      ? current.filter((id) => id !== item._id)
      : [...current, item._id];
    const request = this.profileExists()
      ? this.studentApi.updateProfile({ favorites: next })
      : this.studentApi.createProfile({ favorites: next });

    request.subscribe({
      next: () => {
        this.profileExists.set(true);
        this.favorites.set(next);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error, 'Could not update saved scholarships.'));
      }
    });
  }

  private countryReference(item: Scholarship): ReferenceItem | null {
    return this.referenceFrom(item.country, this.countries());
  }

  private referenceFrom(value: string | ReferenceItem, catalog: ReferenceItem[]): ReferenceItem | null {
    return typeof value === 'string'
      ? catalog.find((item) => item._id === value) ?? null
      : value;
  }

  private referenceId(value: string | ReferenceItem): string {
    return typeof value === 'string' ? value : value._id;
  }

  private referenceOptions(
    scholarships: Scholarship[],
    getReference: (item: Scholarship) => ReferenceItem | null,
    normalizeCountries = false
  ): ReferenceItem[] {
    const options = new Map<string, ReferenceItem>();
    scholarships.forEach((item) => {
      const reference = getReference(item);
      if (!reference) return;
      const normalized = normalizeCountries ? normalizeCountryName(reference.name) : null;
      const option = normalized
        ? { ...reference, name: normalized.name, code: reference.code ?? normalized.code }
        : reference;
      options.set(normalizeCountries ? this.countryIdentity(option) : option._id, option);
    });
    return [...options.values()].sort((left, right) => left.name.localeCompare(right.name));
  }

  private uniqueStrings(values: string[]): string[] {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right));
  }

  private countryIdentity(country: ReferenceItem | null): string {
    if (!country) return '';
    const normalized = normalizeCountryName(country.name);
    return country.code?.toUpperCase() ?? normalized?.code ?? normalized?.name.toLocaleLowerCase() ?? country._id;
  }
}
