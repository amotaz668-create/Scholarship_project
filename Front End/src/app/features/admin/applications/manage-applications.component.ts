import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  APPLICATION_STATUSES,
  ApplicationStatus,
  applicationStatusText,
  ScholarshipApplication,
  STAFF_APPLICATION_TRANSITIONS
} from '../../../core/models/application.models';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ApplicationService } from '../../../core/services/application.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({
  selector: 'app-manage-applications',
  standalone: true,
  imports: [DatePipe, FormsModule, StatusBadgeComponent, UiStateComponent],
  template: `
   <section class="management-page">
  <header class="page-header">
    <p class="eyebrow">APPLICATION OPERATIONS</p>

    <h1>Manage applications</h1>

    <p>
      Admin-only application list with transitions enforced by the backend.
    </p>
  </header>

  <div class="toolbar">
    <input
      [ngModel]="search()"
      (ngModelChange)="search.set($event)"
      placeholder="Search scholarship, degree or application ID"
    >

    <select
      aria-label="Application status filter"
      [ngModel]="statusFilter()"
      (ngModelChange)="statusFilter.set($event)"
    >
      <option value="">All statuses</option>

      @for (item of statuses; track item) {
        <option [value]="item">
          {{ label(item) }}
        </option>
      }
    </select>
  </div>

  @if (error()) {
    <div class="alert error">
      {{ error() }}
    </div>
  }

  @if (loading()) {
    <div class="skeleton table-skeleton"></div>
  } @else if (!filtered().length) {
    <app-ui-state
      title="No applications found"
      message="Applications matching these filters will appear here."
    />
  } @else {
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Application</th>
            <th>Degree</th>
            <th>Student ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Next action</th>
          </tr>
        </thead>

        <tbody>
          @for (item of filtered(); track item._id) {
            <tr>
              <td>
                <b>{{ item.scholarshipTitle }}</b>
                <small>{{ item._id }}</small>
              </td>

              <td>
                <b>{{ item.selectedDegree || 'Not specified' }}</b>
              </td>

              <td>
                {{ item.studentId }}
              </td>

              <td>
                {{ item.createdAt | date:'mediumDate' }}
              </td>

              <td>
                <app-status-badge [status]="item.status" />
              </td>

              <td>
                <div class="table-actions">
                  @for (next of transitions(item.status); track next) {
                    <button
                      type="button"
                      [disabled]="updating().has(item._id)"
                      (click)="changeStatus(item, next)"
                    >
                      {{ label(next) }}
                    </button>
                  } @empty {
                    <span class="muted">No actions</span>
                  }
                </div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  }
</section>
  `
})
export class ManageApplicationsComponent {
  private readonly api = inject(ApplicationService);
  private readonly i18n = inject(I18nService);
  readonly applications = signal<ScholarshipApplication[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly search = signal('');
  readonly statusFilter = signal<ApplicationStatus | ''>('');
  readonly updating = signal(new Set<string>());
  readonly statuses = APPLICATION_STATUSES;

  readonly filtered = computed(() => {
    const search = this.search().trim().toLocaleLowerCase();
    const status = this.statusFilter();
    return this.applications().filter((item) =>
      (!status || item.status === status) &&
      (!search || `${item.scholarshipTitle} ${item.selectedDegree ?? ''} ${item._id} ${item.studentId}`.toLocaleLowerCase().includes(search))
    );
  });

  constructor() {
    this.api.allApplications().subscribe({
      next: ({ data }) => {
        this.applications.set(data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  transitions(status: ApplicationStatus): readonly ApplicationStatus[] {
    return STAFF_APPLICATION_TRANSITIONS[status];
  }

  label(status: ApplicationStatus): string {
    return this.i18n.translate(applicationStatusText(status));
  }

  changeStatus(item: ScholarshipApplication, status: ApplicationStatus): void {
    const statusText = applicationStatusText(status);
    const note = prompt(
      this.i18n.translate(`Add a note for ${statusText}:`),
      this.i18n.translate(`Application moved to ${statusText}`)
    );
    if (note === null) return;
    this.setUpdating(item._id, true);
    this.error.set('');
    this.api.updateStatus(item._id, status, note).subscribe({
      next: ({ data }) => {
        this.applications.update((items) => items.map((current) => current._id === data._id ? data : current));
        this.setUpdating(item._id, false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.setUpdating(item._id, false);
      }
    });
  }

  private setUpdating(id: string, active: boolean): void {
    this.updating.update((current) => {
      const next = new Set(current);
      active ? next.add(id) : next.delete(id);
      return next;
    });
  }
}
