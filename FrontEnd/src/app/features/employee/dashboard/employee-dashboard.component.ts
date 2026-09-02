import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScholarshipApplication } from '../../../core/models/application.models';
import { Scholarship } from '../../../core/models/scholarship.models';
import { ApplicationService } from '../../../core/services/application.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [RouterLink, StatCardComponent],
  template: `
    <section class="management-page">

      <header class="page-header split">
        <div>
          <p class="eyebrow">EMPLOYEE DESK</p>
          <h1>Review workspace</h1>
          <p>Your assigned application queue and the shared scholarship catalog.</p>
        </div>
      </header>

      @if (error()) {
        <div class="alert error">{{ error() }}</div>
      }

      <div class="management-stats">
        <app-stat-card
          label="Catalog records"
          [value]="catalogLoading() ? '…' : scholarships().length"
          caption="Loaded from API"
          icon="✦"
        />

        <app-stat-card
          label="Assigned applications"
          [value]="applicationsLoading() ? '…' : applications().length"
          caption="Your authorized queue"
          icon="◎"
        />

        <app-stat-card
          label="Under review"
          [value]="applicationsLoading() ? '…' : count('under_review')"
          caption="Active reviews"
          icon="◷"
        />

        <app-stat-card
          label="Completed reviews"
          [value]="applicationsLoading() ? '…' : completed()"
          caption="Accepted or rejected"
          icon="✓"
        />
      </div>

      <section class="management-card">
        <div class="section-heading split">
          <div>
            <p class="eyebrow">RECENT CATALOG</p>
            <h2>Scholarships</h2>
          </div>

          <a
            routerLink="/employee/scholarships"
            class="text-link"
          >
            Manage catalog →
          </a>
        </div>

        <div class="mini-records">
          @for (item of scholarships().slice(0, 5); track item._id) {
            <article>
              <span>{{ item.status }}</span>

              <div>
                <b>
                  <bdi>{{ item.title }}</bdi>
                </b>

                <small>
                  <bdi>{{ item.provider }}</bdi>
                </small>
              </div>

              <time>
                {{ item.deadline.slice(0, 10) }}
              </time>
            </article>
          }

          @empty {
            <div class="empty-state">
              No catalog records
            </div>
          }
        </div>
      </section>

    </section>
  `
})
export class EmployeeDashboardComponent {
  private readonly scholarshipsApi = inject(ScholarshipService);
  private readonly applicationsApi = inject(ApplicationService);

  readonly scholarships = signal<Scholarship[]>([]);
  readonly applications = signal<ScholarshipApplication[]>([]);
  readonly catalogLoading = signal(true);
  readonly applicationsLoading = signal(true);
  readonly error = signal('');

  constructor() {
    this.scholarshipsApi.list({ limit: 100 }).subscribe({
      next: ({ data }) => {
        this.scholarships.set(data);
        this.catalogLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.catalogLoading.set(false);
      }
    });

    this.applicationsApi.assignedApplications().subscribe({
      next: ({ data }) => {
        this.applications.set(data);
        this.applicationsLoading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(
          apiErrorMessage(error, 'Could not load assigned applications.')
        );
        this.applicationsLoading.set(false);
      }
    });
  }

  count(status: string): number {
    return this.applications().filter(
      (item) => item.status === status
    ).length;
  }

  completed(): number {
    return this.applications().filter(
      (item) => ['accepted', 'rejected'].includes(item.status)
    ).length;
  }
}