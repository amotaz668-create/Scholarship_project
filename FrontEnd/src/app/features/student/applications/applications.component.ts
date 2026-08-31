import { Component, computed, inject, signal } from '@angular/core';
import { ScholarshipApplication, ApplicationStatus } from '../../../core/models/application.models';
import { ApplicationService } from '../../../core/services/application.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ApplicationJourneyComponent } from '../../../shared/components/application-journey/application-journey.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-applications', standalone: true, imports: [ApplicationJourneyComponent, UiStateComponent], template: `
  <section class="page-hero compact page-container"><p class="eyebrow">MY APPLICATIONS</p><h1>Routes currently <span>in motion.</span></h1><p>Review drafts, submit applications and track every status change.</p></section>
  <section class="page-container"><div class="tab-bar">@for (tab of tabs; track tab.value) { <button type="button" [class.active]="filter() === tab.value" (click)="filter.set(tab.value)">{{ tab.label }} <span>{{ tab.value ? count(tab.value) : applications().length }}</span></button> }</div>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="skeleton journey-skeleton"></div> } @else if (!filtered().length) { <app-ui-state title="No applications in this stage" message="Your matching application journeys will appear here." /> }
    @else { <div class="application-list">@for (item of filtered(); track item._id) { <div><app-application-journey [application]="item" /><div class="application-actions"><span>Application ID: {{ item._id }}</span>@if (item.status === 'draft') { <button class="button primary small" type="button" (click)="submit(item)">Submit application</button> } @if (['submitted','under_review','missing_documents'].includes(item.status)) { <button class="button danger small" type="button" (click)="withdraw(item)">Withdraw</button> }</div></div> }</div> }
  </section>` })
export class ApplicationsComponent {
  private readonly api = inject(ApplicationService); readonly applications = signal<ScholarshipApplication[]>([]); readonly loading = signal(true); readonly error = signal(''); readonly filter = signal<ApplicationStatus | ''>('');
  readonly tabs: Array<{ label: string; value: ApplicationStatus | '' }> = [{ label: 'All', value: '' }, { label: 'Draft', value: 'draft' }, { label: 'Applied', value: 'submitted' }, { label: 'Under review', value: 'under_review' }, { label: 'Accepted', value: 'accepted' }, { label: 'Rejected', value: 'rejected' }];
  readonly filtered = computed(() => this.filter() ? this.applications().filter((item) => item.status === this.filter()) : this.applications());
  constructor() { this.reload(); }
  reload(): void { this.api.myApplications().subscribe({ next: ({ data }) => { this.applications.set(data); this.loading.set(false); }, error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } }); }
  count(status: ApplicationStatus): number { return this.applications().filter((item) => item.status === status).length; }
  submit(item: ScholarshipApplication): void { this.error.set(''); this.api.submit(item._id).subscribe({ next: ({ data }) => this.replace(data), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  withdraw(item: ScholarshipApplication): void { if (!confirm('Withdraw this application? This cannot be reversed.')) return; this.api.withdraw(item._id).subscribe({ next: ({ data }) => this.replace(data), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  private replace(updated: ScholarshipApplication): void { this.applications.update((items) => items.map((item) => item._id === updated._id ? updated : item)); }
}
