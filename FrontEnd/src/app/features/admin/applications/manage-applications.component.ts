import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApplicationStatus, ScholarshipApplication } from '../../../core/models/application.models';
import { ApplicationService } from '../../../core/services/application.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-manage-applications', standalone: true, imports: [DatePipe, FormsModule, StatusBadgeComponent, UiStateComponent], template: `
  <section class="management-page"><header class="page-header"><p class="eyebrow">APPLICATION OPERATIONS</p><h1>Manage applications</h1><p>Admin-only application list with transitions enforced by the backend.</p></header>
    <div class="toolbar"><input [(ngModel)]="search" placeholder="Search scholarship or application ID"><select [(ngModel)]="status"><option value="">All statuses</option>@for (item of statuses; track item) { <option [value]="item">{{ item.replaceAll('_',' ') }}</option> }</select></div>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="skeleton table-skeleton"></div> } @else if (!filtered().length) { <app-ui-state title="No applications found" message="Applications matching these filters will appear here." /> } @else { <div class="table-wrap"><table><thead><tr><th>Application</th><th>Student ID</th><th>Date</th><th>Status</th><th>Next action</th></tr></thead><tbody>@for (item of filtered(); track item._id) { <tr><td><b>{{ item.scholarshipTitle }}</b><small>{{ item._id }}</small></td><td>{{ item.studentId }}</td><td>{{ item.createdAt | date:'mediumDate' }}</td><td><app-status-badge [status]="item.status" /></td><td><div class="table-actions">@for (next of transitions(item.status); track next) { <button type="button" (click)="changeStatus(item,next)">{{ label(next) }}</button> } @empty { <span class="muted">No actions</span> }</div></td></tr> }</tbody></table></div> }
  </section>` })
export class ManageApplicationsComponent {
  private readonly api = inject(ApplicationService); readonly applications = signal<ScholarshipApplication[]>([]); readonly loading = signal(true); readonly error = signal(''); search = ''; status = '';
  readonly statuses: ApplicationStatus[] = ['draft','submitted','under_review','missing_documents','accepted','rejected','withdrawn'];
  readonly filtered = computed(() => this.applications().filter((item) => (!this.status || item.status === this.status) && (!this.search || `${item.scholarshipTitle} ${item._id}`.toLowerCase().includes(this.search.toLowerCase()))));
  constructor() { this.api.allApplications().subscribe({ next: ({ data }) => { this.applications.set(data); this.loading.set(false); }, error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } }); }
  transitions(status: ApplicationStatus): ApplicationStatus[] { const map: Partial<Record<ApplicationStatus, ApplicationStatus[]>> = { submitted: ['under_review'], under_review: ['accepted','rejected','missing_documents'], missing_documents: ['under_review','rejected'] }; return map[status] ?? []; }
  label(status: ApplicationStatus): string { return status.replaceAll('_',' '); }
  changeStatus(item: ScholarshipApplication, status: ApplicationStatus): void { const note = prompt(`Add a note for ${this.label(status)}:`, `Application moved to ${this.label(status)}`); if (note === null) return; this.api.updateStatus(item._id, status, note).subscribe({ next: ({ data }) => this.applications.update((items) => items.map((current) => current._id === data._id ? data : current)), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
}
