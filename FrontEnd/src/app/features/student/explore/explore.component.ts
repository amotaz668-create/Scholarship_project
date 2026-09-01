import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { ReferenceItem } from '../../../core/models/api.models';
import { Scholarship } from '../../../core/models/scholarship.models';
import { I18nService } from '../../../core/i18n/i18n.service';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { CountryService } from '../../../core/services/country.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StudentService } from '../../../core/services/student.service';
import { ScholarshipCardComponent } from '../../../shared/components/scholarship-card/scholarship-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';
import { AtlasDetailPanelComponent } from './components/atlas-detail-panel/atlas-detail-panel.component';
import { DestinationOption, ExploreFilterComponent } from './components/explore-filter/explore-filter.component';
import { MapCountryData, WorldMapComponent } from './components/world-map/world-map.component';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    AtlasDetailPanelComponent,
    ExploreFilterComponent,
    ScholarshipCardComponent,
    UiStateComponent,
    WorldMapComponent
  ],
  templateUrl: './explore.component.html'
})
export class ExploreComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scholarshipApi = inject(ScholarshipService);
  private readonly catalogApi = inject(CatalogService);
  private readonly studentApi = inject(StudentService);
  private readonly country = inject(CountryService);
  private readonly i18n = inject(I18nService);

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
    const selectedCountryCode = this.resolveFilterCountry(filters.country ?? '');

    return this.scholarships().filter((item) => {
      const matchesSearch = !search || [item.title, item.description, item.provider]
        .some((value) => value.toLocaleLowerCase().includes(search));
      const matchesCountry = !filters.country || this.country.code(this.countryReference(item)) === selectedCountryCode;
      const matchesUniversity = !filters.university || this.referenceId(item.university) === filters.university;
      const matchesCategory = !filters.category || this.referenceId(item.category) === filters.category;
      const matchesFunding = !filters.fundingType || item.fundingType === filters.fundingType;
      const matchesDegree = !filters.degree || item.eligibility?.eligibleDegrees?.includes(filters.degree);
      const matchesDeadline = !deadline || new Date(item.deadline) <= deadline;
      return matchesSearch && matchesCountry && matchesUniversity && matchesCategory
        && matchesFunding && matchesDegree && matchesDeadline;
    });
  });

  readonly mapCountries = computed<MapCountryData[]>(() => {
    const grouped = new Map<string, number>();

    this.filteredScholarships().forEach((item) => {
      const code = this.country.code(this.countryReference(item));
      if (code) grouped.set(code, (grouped.get(code) ?? 0) + 1);
    });

    return [...grouped].map(([code, count]) => ({ code, count }));
  });

  readonly selectedCountryCode = computed(() => this.resolveFilterCountry(this.filterValues().country ?? ''));
  readonly destinations = computed<DestinationOption[]>(() => {
    const options = new Map<string, DestinationOption>();
    for (const scholarship of this.scholarships()) {
      const metadata = this.country.metadata(this.countryReference(scholarship));
      if (metadata) options.set(metadata.code, metadata);
    }
    const collator = new Intl.Collator(this.i18n.language(), { sensitivity: 'base' });
    return [...options.values()].sort((left, right) => collator.compare(left.name, right.name));
  });
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
  }

  applyFilters(): void {
    this.scrollToResults();
  }

  selectCountry(code: string): void {
    const matches = this.filteredScholarships().filter((item) =>
      this.country.code(this.countryReference(item)) === code
    );
    if (matches.length === 1) {
      void this.router.navigate(['/scholarships', matches[0]._id]);
      return;
    }
    if (matches.length > 1) {
      this.filters.controls.country.setValue(code);
      this.scrollToResults();
    }
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
    getReference: (item: Scholarship) => ReferenceItem | null
  ): ReferenceItem[] {
    const options = new Map<string, ReferenceItem>();
    scholarships.forEach((item) => {
      const reference = getReference(item);
      if (!reference) return;
      options.set(reference._id, reference);
    });
    return [...options.values()].sort((left, right) => left.name.localeCompare(right.name));
  }

  private uniqueStrings(values: string[]): string[] {
    return [...new Set(values.map((value) => value.trim()).filter(Boolean))]
      .sort((left, right) => left.localeCompare(right));
  }

  private resolveFilterCountry(value: string): string {
    if (!value) return '';
    if (/^[a-z]{2}$/i.test(value)) return value.toUpperCase();
    return this.country.code(this.countries().find((item) => item._id === value))
      ?? this.country.code(value)
      ?? '';
  }

  private scrollToResults(): void {
    setTimeout(() => document.getElementById('opportunity-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
}
