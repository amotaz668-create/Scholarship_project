import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminLog, AdminStatistics, DashboardStatistics } from '../../../core/models/admin.models';
import { AdminService } from '../../../core/services/admin.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-admin-dashboard', standalone: true, imports: [RouterLink, StatCardComponent, UiStateComponent], template: `
  <section class="management-page"><header class="page-header split"><div><p class="eyebrow">ADMIN CONTROL</p><h1>System overview</h1><p>Live totals from the admin dashboard and statistics APIs.</p></div><a class="button primary" routerLink="/admin/scholarships">Add scholarship →</a></header>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    <div class="management-stats"><app-stat-card label="Total users" [value]="dashboard()?.totalUsers ?? '—'" caption="All roles" icon="◎" /><app-stat-card label="Scholarships" [value]="dashboard()?.totalScholarships ?? '—'" caption="All statuses" icon="✦" /><app-stat-card label="Applications" [value]="dashboard()?.totalApplications ?? '—'" caption="Total journeys" icon="↗" /><app-stat-card label="Pending" [value]="dashboard()?.pendingApplications ?? '—'" caption="Submitted" icon="◷" /><app-stat-card label="Accepted" [value]="dashboard()?.acceptedApplications ?? '—'" caption="Successful" icon="✓" /><app-stat-card label="Rejected" [value]="dashboard()?.rejectedApplications ?? '—'" caption="Closed decisions" icon="×" /></div>
    <div class="admin-dashboard-columns"><section class="management-card"><div class="section-heading split"><div><p class="eyebrow">APPLICATION MIX</p><h2>By status</h2></div><a routerLink="/admin/statistics" class="text-link">Full statistics →</a></div>@if (statistics()?.applicationsByStatus?.length) { <div class="bar-chart">@for (item of statistics()!.applicationsByStatus; track item._id) { <div><span>{{ item._id.replaceAll('_',' ') }}</span><div><i [style.width.%]="barWidth(item.count)"></i></div><b>{{ item.count }}</b></div> }</div> } @else { <app-ui-state [compact]="true" title="No application data" message="Aggregates will appear after applications are created." /> }</section>
      <section class="management-card"><div class="section-heading split"><div><p class="eyebrow">RECENT ACTIVITY</p><h2>Admin log</h2></div><a routerLink="/admin/logs" class="text-link">All logs →</a></div><div class="activity-list">@for (log of logs().slice(0,5); track log._id) { <article><span>✦</span><div><b>{{ log.action.replaceAll('_',' ') }}</b><p>{{ log.details }}</p><small>{{ log.createdAt }}</small></div></article> } @empty { <app-ui-state [compact]="true" title="No activity yet" message="Logged admin actions will appear here." /> }</div></section></div>
  </section>` })
export class AdminDashboardComponent {
  private readonly api = inject(AdminService); readonly dashboard = signal<DashboardStatistics | null>(null); readonly statistics = signal<AdminStatistics | null>(null); readonly logs = signal<AdminLog[]>([]); readonly error = signal('');
  constructor() { forkJoin({ dashboard: this.api.dashboard(), statistics: this.api.statistics(), logs: this.api.logs() }).subscribe({ next: (result) => { this.dashboard.set(result.dashboard.data); this.statistics.set(result.statistics.data); this.logs.set(result.logs.logs); }, error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Could not load the admin dashboard.')) }); }
  barWidth(count: number): number { const max = Math.max(...(this.statistics()?.applicationsByStatus.map((item) => item.count) ?? [1])); return Math.max(6, (count / max) * 100); }
}
