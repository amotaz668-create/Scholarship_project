import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ScholarshipApplication } from '../../../core/models/application.models';
import { ApplicationService } from '../../../core/services/application.service';
import { StudentService } from '../../../core/services/student.service';
import { ApplicationJourneyComponent } from '../../../shared/components/application-journey/application-journey.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-journey', standalone: true, imports: [RouterLink, ApplicationJourneyComponent, StatCardComponent, UiStateComponent], template: `
  <section class="page-hero compact page-container"><p class="eyebrow">MY OPPORTUNITY PASSPORT</p><h1>Every stamp tells <span>your story.</span></h1><p>Follow your applications from discovery to destination.</p></section>
  <section class="page-container passport-summary"><div class="passport-cover"><div class="passport-emblem">✦</div><small>SCHOLARSHIP ATLAS</small><h2>OPPORTUNITY<br>PASSPORT</h2><span>STUDENT JOURNEY</span></div><div class="passport-stats"><app-stat-card label="Profile completion" [value]="completion() + '%'" icon="◎" /><app-stat-card label="Applications" [value]="applications().length" icon="↗" /><app-stat-card label="Accepted" [value]="count('accepted')" icon="✓" /><app-stat-card label="Saved" [value]="saved()" icon="☆" /></div></section>
  <section class="section page-container"><div class="section-heading split"><div><p class="eyebrow">APPLICATION JOURNEYS</p><h2>Your routes in motion</h2></div><a routerLink="/explore" class="button primary small">Discover another route</a></div>
    @if (loading()) { <div class="skeleton journey-skeleton"></div> } @else if (applications().length) { <div class="journey-list">@for (item of applications(); track item._id) { <app-application-journey [application]="item" /> }</div> } @else { <app-ui-state title="No passport stamps yet" message="Start an application and your journey will appear here." /> }
  </section>` })
export class JourneyComponent {
  private readonly appApi = inject(ApplicationService); private readonly studentApi = inject(StudentService); readonly applications = signal<ScholarshipApplication[]>([]); readonly loading = signal(true); readonly completion = signal(0); readonly saved = signal(0);
  constructor() { this.appApi.myApplications().subscribe({ next: ({ data }) => { this.applications.set(data); this.loading.set(false); }, error: () => this.loading.set(false) }); this.studentApi.getProfile().subscribe({ next: ({ data }) => { this.completion.set(data.completionPercentage); this.saved.set(data.profile.favorites?.length ?? 0); }, error: () => undefined }); }
  count(status: string): number { return this.applications().filter((item) => item.status === status).length; }
}
