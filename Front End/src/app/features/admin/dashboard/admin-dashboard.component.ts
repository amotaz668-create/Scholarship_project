import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminLog, AdminStatistics, DashboardStatistics } from '../../../core/models/admin.models';
import { AdminService } from '../../../core/services/admin.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

type DashboardKey = keyof DashboardStatistics;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DatePipe, RouterLink, StatCardComponent, UiStateComponent],
  template: `
    <section class="management-page">
      <header class="page-header split">
        <div><p class="eyebrow">ADMIN CONTROL</p><h1>System overview</h1><p>Live totals from the admin dashboard and statistics APIs.</p></div>
        <a class="button primary" routerLink="/admin/scholarships">Add scholarship →</a>
      </header>

      @if (dashboardError()) { <div class="alert error">{{ dashboardError() }}</div> }
      <div class="management-stats">
        <app-stat-card label="Total users" [value]="value('totalUsers')" caption="All roles" icon="◎" />
        <app-stat-card label="Scholarships" [value]="value('totalScholarships')" caption="All statuses" icon="✦" />
        <app-stat-card label="Applications" [value]="value('totalApplications')" caption="Total journeys" icon="↗" />
        <app-stat-card label="Pending" [value]="value('pendingApplications')" caption="Submitted" icon="◷" />
        <app-stat-card label="Accepted" [value]="value('acceptedApplications')" caption="Successful" icon="✓" />
        <app-stat-card label="Rejected" [value]="value('rejectedApplications')" caption="Closed decisions" icon="×" />
      </div>

      <div class="admin-dashboard-columns">
        <section class="management-card">
          <div class="section-heading split"><div><p class="eyebrow">APPLICATION MIX</p><h2>By status</h2></div><a routerLink="/admin/statistics" class="text-link">Full statistics →</a></div>
          @if (statisticsError()) {
            <app-ui-state [compact]="true" title="Application data unavailable" [message]="statisticsError()" />
          } @else if (statistics()?.applicationsByStatus?.length) {
            <div class="bar-chart">@for (item of statistics()!.applicationsByStatus; track item._id) { <div><span>{{ item._id.replaceAll('_',' ') }}</span><div><i [style.width.%]="barWidth(item.count)"></i></div><b>{{ item.count }}</b></div> }</div>
          } @else if (!statisticsLoading()) {
            <app-ui-state [compact]="true" title="No application data" message="Aggregates will appear after applications are created." />
          }
        </section>

        <section class="management-card">
          <div class="section-heading split"><div><p class="eyebrow">RECENT ACTIVITY</p><h2>Admin log</h2></div><a routerLink="/admin/logs" class="text-link">All logs →</a></div>
          @if (logsError()) {
            <app-ui-state [compact]="true" title="Activity unavailable" [message]="logsError()" />
          } @else {
            <div class="activity-list">
              @for (log of logs().slice(0,5); track log._id) {
                <article><span>✦</span><div><b>{{ log.action.replaceAll('_',' ') }}</b><p>{{ log.details }}</p><small>{{ log.createdAt | date:'medium' }}</small></div></article>
              } @empty {
                @if (!logsLoading()) { <app-ui-state [compact]="true" title="No activity yet" message="Logged admin actions will appear here." /> }
              }
            </div>
          }
        </section>
      </div>
    </section>
  `
})
export class AdminDashboardComponent {
  private readonly api = inject(AdminService);
  readonly dashboard = signal<DashboardStatistics | null>(null);
  readonly statistics = signal<AdminStatistics | null>(null);
  readonly logs = signal<AdminLog[]>([]);
  readonly dashboardLoading = signal(true);
  readonly statisticsLoading = signal(true);
  readonly logsLoading = signal(true);
  readonly dashboardError = signal('');
  readonly statisticsError = signal('');
  readonly logsError = signal('');

  constructor() {
    this.api.dashboard().subscribe({
      next: ({ data }) => { this.dashboard.set(data); this.dashboardLoading.set(false); },
      error: (error: unknown) => { this.dashboardError.set(apiErrorMessage(error, 'Could not load dashboard totals.')); this.dashboardLoading.set(false); }
    });
    this.api.statistics().subscribe({
      next: ({ data }) => { this.statistics.set(data); this.statisticsLoading.set(false); },
      error: (error: unknown) => { this.statisticsError.set(apiErrorMessage(error, 'Could not load application statistics.')); this.statisticsLoading.set(false); }
    });
    this.api.logs().subscribe({
      next: ({ logs }) => { this.logs.set(logs); this.logsLoading.set(false); },
      error: (error: unknown) => { this.logsError.set(apiErrorMessage(error, 'Could not load recent activity.')); this.logsLoading.set(false); }
    });
  }

  value(key: DashboardKey): number | string {
    if (this.dashboardLoading()) return '…';
    if (this.dashboardError()) return 'Error';
    const current = this.dashboard()?.[key];
    return typeof current === 'number' && Number.isFinite(current) ? current : 'Error';
  }

  barWidth(count: number): number {
    const max = Math.max(...(this.statistics()?.applicationsByStatus.map((item) => item.count) ?? [1]), 1);
    return Math.max(6, (count / max) * 100);
  }
}
