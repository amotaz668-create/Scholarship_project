import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { ScholarshipApplication } from '../../../core/models/application.models';
import { NotificationItem } from '../../../core/models/notification.models';
import { Scholarship } from '../../../core/models/scholarship.models';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StudentService } from '../../../core/services/student.service';
import { ApplicationJourneyComponent } from '../../../shared/components/application-journey/application-journey.component';
import { ScholarshipCardComponent } from '../../../shared/components/scholarship-card/scholarship-card.component';
import { ProgressRingComponent } from '../../../shared/components/progress-ring/progress-ring.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({
  selector: 'app-student-dashboard', standalone: true,
  imports: [DatePipe, RouterLink, ApplicationJourneyComponent, ProgressRingComponent, ScholarshipCardComponent, StatCardComponent, UiStateComponent],
  template: `
    <section class="dashboard-welcome page-container">
      <div><p class="eyebrow">JOURNEY COMMAND CENTER</p><h1>{{ greeting() }}, {{ firstName() }}.</h1><p>Ready to discover your next opportunity?</p></div>
      <a class="button primary" routerLink="/explore">Explore the Atlas →</a>
    </section>
    <section class="page-container dashboard-grid">
      <article class="passport-progress"><app-progress-ring [value]="completion()" /><div><p class="eyebrow">OPPORTUNITY PROFILE</p><h2>Your passport strength</h2><p>A complete profile helps you evaluate eligibility faster.</p><a routerLink="/profile" class="text-link">Complete profile →</a></div></article>
      <app-stat-card label="Active applications" [value]="activeApplications().length" caption="On the way" icon="↗" />
      <app-stat-card label="Upcoming deadlines" [value]="upcomingDeadlines()" caption="Next 30 days" icon="◷" />
      <app-stat-card label="Unread notifications" [value]="unreadNotifications()" caption="Journey updates" icon="✦" />
      <app-stat-card label="Saved scholarships" [value]="savedCount()" caption="From your profile" icon="☆" />
      <app-stat-card label="Match score" value="Unavailable" caption="No scoring API available" icon="◎" />
    </section>
    <section class="section page-container dashboard-columns">
      <div><div class="section-heading split"><div><p class="eyebrow">RECENT PROGRESS</p><h2>Your active route</h2></div><a routerLink="/applications" class="text-link">All applications →</a></div>
        @if (loading()) { <div class="skeleton journey-skeleton"></div> }
        @else if (applications().length) { <app-application-journey [application]="applications()[0]" /> }
        @else { <app-ui-state title="Your journey starts here" message="Explore scholarships and start a draft application." /> }
      </div>
      <div class="deadline-board"><div class="section-heading"><p class="eyebrow">DEADLINE BOARD</p><h2>Next departures</h2></div>@for (item of recommendations().slice(0, 4); track item._id) { <a [routerLink]="['/scholarships', item._id]"><span>{{ item.deadline | date:'dd MMM' }}</span><div><b>{{ item.title }}</b><small>{{ item.provider }}</small></div><i>→</i></a> } @empty { <p class="muted">No published scholarships found.</p> }</div>
    </section>
    <section class="section page-container"><div class="section-heading split"><div><p class="eyebrow">RECOMMENDED</p><h2>Fresh routes to explore</h2></div><a routerLink="/explore" class="text-link">Open Atlas →</a></div><div class="scholarship-grid">@for (item of recommendations().slice(0, 3); track item._id) { <app-scholarship-card [scholarship]="item" /> }</div></section>
  `
})
export class StudentDashboardComponent {
  readonly auth = inject(AuthService); private readonly studentApi = inject(StudentService); private readonly applicationApi = inject(ApplicationService); private readonly notificationApi = inject(NotificationService); private readonly scholarshipApi = inject(ScholarshipService);
  readonly loading = signal(true); readonly completion = signal(0); readonly favorites = signal<string[]>([]); readonly applications = signal<ScholarshipApplication[]>([]); readonly notifications = signal<NotificationItem[]>([]); readonly recommendations = signal<Scholarship[]>([]);
  readonly activeApplications = computed(() => this.applications().filter((item) => !['accepted', 'rejected', 'withdrawn'].includes(item.status)));
  readonly unreadNotifications = computed(() => this.notifications().filter((item) => !item.isRead).length);
  readonly savedCount = computed(() => this.favorites().length);
  readonly upcomingDeadlines = computed(() => this.recommendations().filter((item) => { const days = (new Date(item.deadline).getTime() - Date.now()) / 86_400_000; return days >= 0 && days <= 30; }).length);
  readonly firstName = computed(() => this.auth.currentUser()?.name.split(' ')[0] ?? 'Traveler');
  constructor() { forkJoin({ profile: this.studentApi.getProfile().pipe(catchError(() => of(null))), applications: this.applicationApi.myApplications(), notifications: this.notificationApi.list(), scholarships: this.scholarshipApi.list({ limit: 12 }) }).subscribe({ next: ({ profile, applications, notifications, scholarships }) => { if (profile) { this.completion.set(profile.data.completionPercentage); this.favorites.set((profile.data.profile.favorites ?? []).map(String)); } this.applications.set(applications.data); this.notifications.set(notifications.notifications); this.recommendations.set(scholarships.data); this.loading.set(false); }, error: () => this.loading.set(false) }); }
  greeting(): string { const hour = new Date().getHours(); return hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'; }
}
