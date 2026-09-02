import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ReferenceItem } from '../../../core/models/api.models';
import { Scholarship } from '../../../core/models/scholarship.models';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { CountryService } from '../../../core/services/country.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StudentService } from '../../../core/services/student.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-scholarship-details',
  standalone: true,
  imports: [DatePipe, DecimalPipe, RouterLink, StatusBadgeComponent, UiStateComponent, FormsModule],
  template: `
@if (loading()) {
  <section class="section page-container">
    <div class="skeleton details-skeleton"></div>
  </section>
}

@else if (error() && !scholarship()) {
  <section class="section page-container">
    <app-ui-state
      icon="!"
      title="Scholarship unavailable"
      [message]="error()"
    />
  </section>
}

@else if (scholarship(); as item) {

  <header class="scholarship-detail-hero">
    <div class="detail-orbit"></div>

    <div class="page-container">

      <a class="back-link" routerLink="/explore">
        ← Back to Atlas
      </a>

      <div class="detail-heading">

        <div>
          <p class="eyebrow">
            {{ country.label(item.country) }} · {{ item.provider }}
          </p>

          <h1>{{ item.title }}</h1>

          <p>{{ refName(item.university) }}</p>
        </div>

        <div class="passport-stamp">
          <small>STATUS</small>

          <app-status-badge [status]="item.status" />

          <b>{{ daysLeft(item.deadline) }}</b>

          <span>DAYS LEFT</span>
        </div>

      </div>

      <div class="detail-facts">

        <span>
          <small>DEGREE</small>
          {{ degreeLabel(item) }}
        </span>

        <span>
          <small>FIELD</small>
          <bdi>{{ refName(item.category) }}</bdi>
        </span>

        <span>
          <small>FUNDING</small>
          {{ i18n.translate(item.fundingType) }}
        </span>

        <span>
          <small>DEADLINE</small>
          {{ item.deadline | date:'mediumDate' }}
        </span>

      </div>

    </div>
  </header>


  <main class="detail-layout page-container">

    <div class="detail-content">

      <!-- OVERVIEW -->
      <section class="content-card">

        <p class="eyebrow">01 / OVERVIEW</p>

        <h2>About this opportunity</h2>

        <p class="prose">
          {{ item.description }}
        </p>

      </section>


      <!-- ELIGIBILITY -->
      <section class="content-card">

        <p class="eyebrow">02 / ELIGIBILITY</p>

        <h2>Who can apply</h2>

        <div class="requirement-grid">

          <div>
            <small>Minimum GPA</small>
            <b>
              {{ item.eligibility?.minGPA ?? 'Not specified' }}
            </b>
          </div>

          <div>
            <small>Maximum age</small>
            <b>
              {{ item.eligibility?.maxAge ?? 'Not specified' }}
            </b>
          </div>

          <div>
            <small>Degrees</small>
            <b>
              {{ degreeLabel(item, false) }}
            </b>
          </div>

          <div>
            <small>Gender</small>
            <b>
              {{
                item.eligibility?.gender
                  ? i18n.translate(item.eligibility!.gender!)
                  : 'Not specified'
              }}
            </b>
          </div>

        </div>

      </section>


      <!-- BENEFITS -->
      <section class="content-card">

        <p class="eyebrow">03 / BENEFITS & FUNDING</p>

        <h2>Your funding package</h2>

        <div class="benefit-banner">

          <span>✦</span>

          <div>

            <b>
              {{ i18n.translate(item.fundingType) }}
            </b>

            <p>
              @if (item.amount) {
                {{ item.amount | number }} {{ item.currency || '' }}
              }

              @else {
                Exact amount is not specified by the provider.
              }
            </p>

          </div>

        </div>

      </section>


      <!-- REQUIRED DOCUMENTS -->
      <section class="content-card">

        <p class="eyebrow">04 / REQUIRED DOCUMENTS</p>

        <h2>Pack your application</h2>

        @if (item.requiredDocuments?.length) {

          <ul class="document-checklist">

            @for (
              document of item.requiredDocuments;
              track document.type
            ) {

              <li>

                <span>✓</span>

                <div>

                  <b>{{ document.type }}</b>

                  <small>
                    {{ document.required ? 'Required' : 'Optional' }}
                  </small>

                </div>

              </li>

            }

          </ul>

        }

        @else {

          <p class="muted">
            The provider has not listed required documents yet.
          </p>

        }

      </section>


      <!-- APPLICATION INFORMATION -->
      <section class="content-card">

        <p class="eyebrow">05 / APPLICATION INFORMATION</p>

        <h2>Before departure</h2>

        <p class="prose">
          Start an application inside Scholarship Atlas.
          It will be created as a draft so you can review it before submission.
        </p>

        @if (item.applicationUrl) {

          <a
            class="text-link"
            [href]="item.applicationUrl"
            target="_blank"
            rel="noopener"
          >
            Visit provider website ↗
          </a>

        }

      </section>

    </div>


    <!-- APPLY CARD -->
    <aside class="apply-card">

      <p class="eyebrow">YOUR NEXT MOVE</p>

      <h2>Ready to begin?</h2>

      <p>
        Create a draft application, then submit it from My Applications
        when it is complete.
      </p>


      @if (error()) {

        <div class="alert error">
          {{ error() }}
        </div>

      }


      @if (success()) {

        <div class="alert success">
          {{ success() }}
        </div>

      }


      @if (auth.role() === 'student') {

        <!-- DEGREE SELECTION -->
        <label>
          Degree you are applying for

          <select
            [ngModel]="selectedDegree()"
            (ngModelChange)="selectedDegree.set($event)"
          >

            <option value="">
              Select degree
            </option>

            @for (
              degree of degreeOptions(item);
              track degree
            ) {

              <option [value]="degree">
                {{ i18n.translate(degree) }}
              </option>

            }

          </select>

        </label>


        <!-- START APPLICATION -->
        <button
          class="button primary wide"
          type="button"
          [disabled]="
            applying() ||
            item.status !== 'published' ||
            !selectedDegree()
          "
          (click)="apply(item)"
        >

          @if (applying()) {
            Creating draft…
          }

          @else {
            Start application →
          }

        </button>


        <!-- FAVORITE -->
        <button
          class="button ghost wide"
          type="button"
          (click)="toggleFavorite(item)"
        >

          {{ saved() ? 'Saved ✓' : 'Save scholarship' }}

        </button>

      }

      @else if (auth.currentUser()) {

        <p class="availability-note">
          Applications are available to student accounts.
        </p>

      }

      @else {

        <a
          class="button primary wide"
          [routerLink]="['/login']"
          [queryParams]="{
            returnUrl: '/scholarships/' + item._id
          }"
        >
          Sign in to apply →
        </a>

      }


      <!-- DEADLINE -->
      <div class="application-fineprint">

        <span>Deadline</span>

        <b>
          {{ item.deadline | date:'fullDate' }}
        </b>

      </div>

    </aside>

  </main>
}
`

})
export class ScholarshipDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly scholarshipApi = inject(ScholarshipService);
  private readonly applicationApi = inject(ApplicationService);
  private readonly studentApi = inject(StudentService);
  readonly selectedDegree = signal("");
  readonly auth = inject(AuthService);
  readonly country = inject(CountryService);
  readonly i18n = inject(I18nService);
  readonly scholarship = signal<Scholarship | null>(null);
  readonly loading = signal(true); readonly applying = signal(false); readonly error = signal(''); readonly success = signal(''); readonly favorites = signal<string[]>([]); readonly profileExists = signal(false);
  readonly saved = computed(() => this.scholarship() ? this.favorites().includes(this.scholarship()!._id) : false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '';
    this.scholarshipApi.getById(id).pipe(finalize(() => this.loading.set(false))).subscribe({ next: ({ data }) => this.scholarship.set(data), error: (error: unknown) => this.error.set(apiErrorMessage(error, 'This scholarship could not be found.')) });
    if (this.auth.role() === 'student') this.studentApi.getProfile().subscribe({ next: ({ data }) => { this.profileExists.set(true); this.favorites.set((data.profile.favorites ?? []).map(String)); }, error: () => undefined });
  }
  apply(item: Scholarship): void {
    if (!this.selectedDegree()) {
      this.error.set("Please select a degree.");
      return;
    }

    this.applying.set(true);
    this.error.set("");

    this.applicationApi
      .create({
        scholarshipId: item._id,
        selectedDegree: this.selectedDegree(),
        answers: [],
        documents: [],
      })
      .pipe(finalize(() => this.applying.set(false)))
      .subscribe({
        next: ({ data }) => {
          this.success.set(
            "Draft ready. Opening application…",
          );

          setTimeout(
            () =>
              void this.router.navigate([
                "/applications",
                data._id,
                "complete",
              ]),
            350,
          );
        },
        error: (error: unknown) =>
          this.error.set(
            apiErrorMessage(
              error,
              "Could not create the application.",
            ),
          ),
      });
  }
  toggleFavorite(item: Scholarship): void { const next = this.saved() ? this.favorites().filter((id) => id !== item._id) : [...this.favorites(), item._id]; const request = this.profileExists() ? this.studentApi.updateProfile({ favorites: next }) : this.studentApi.createProfile({ favorites: next }); request.subscribe({ next: () => { this.profileExists.set(true); this.favorites.set(next); }, error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  refName(value: string | ReferenceItem): string { return typeof value === 'string' ? 'Global' : value.name; }
  daysLeft(date: string): number { return Math.max(0, Math.ceil((new Date(date).getTime() - Date.now()) / 86_400_000)); }
  degreeLabel(item: Scholarship, openLevel = true): string { return item.eligibility?.eligibleDegrees?.map((degree) => this.i18n.translate(degree)).join(', ') || this.i18n.translate(openLevel ? 'Open level' : 'Open'); }
  degreeOptions(item: Scholarship): string[] {
    const degrees = item.eligibility?.eligibleDegrees ?? [];

    return degrees.length
      ? degrees
      : ["Bachelor", "Master", "PhD"];
  }
}
