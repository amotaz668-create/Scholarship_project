import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./shared/components/atlas-shell/atlas-shell.component').then((m) => m.AtlasShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/public/landing/landing.component').then((m) => m.LandingComponent)
      },
      {
        path: 'explore',
        loadComponent: () => import('./features/student/explore/explore.component').then((m) => m.ExploreComponent)
      },
      {
        path: 'scholarships/:id',
        loadComponent: () => import('./features/student/scholarship-details/scholarship-details.component').then((m) => m.ScholarshipDetailsComponent)
      },
      {
        path: 'dashboard',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/dashboard/student-dashboard.component').then((m) => m.StudentDashboardComponent)
      },
      {
        path: 'journey',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/journey/journey.component').then((m) => m.JourneyComponent)
      },
      {
        path: 'applications',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/applications/applications.component').then((m) => m.ApplicationsComponent)
      },
      {
        path: 'applications/:id/complete',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/application-complete/application-complete.component').then((m) => m.ApplicationCompleteComponent)
      },
      {
        path: 'applications/:id/review',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/application-review/application-review.component').then((m) => m.ApplicationReviewComponent)
      },
      {
        path: 'saved',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/saved/saved.component').then((m) => m.SavedComponent)
      },
      {
        path: 'notifications',
        canActivate: [authGuard],
        loadComponent: () => import('./features/student/notifications/notifications.component').then((m) => m.NotificationsComponent)
      },
      {
        path: 'profile',
        canActivate: [authGuard, roleGuard],
        data: { roles: ['student'] },
        loadComponent: () => import('./features/student/profile/profile.component').then((m) => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'] },
    loadComponent: () => import('./shared/components/management-shell/management-shell.component').then((m) => m.ManagementShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent) },
      { path: 'scholarships', loadComponent: () => import('./features/admin/scholarships/manage-scholarships.component').then((m) => m.ManageScholarshipsComponent) },
      { path: 'applications', loadComponent: () => import('./features/admin/applications/manage-applications.component').then((m) => m.ManageApplicationsComponent) },
      { path: 'users', loadComponent: () => import('./features/admin/users/manage-users.component').then((m) => m.ManageUsersComponent) },
      { path: 'statistics', loadComponent: () => import('./features/admin/statistics/statistics.component').then((m) => m.StatisticsComponent) },
      { path: 'logs', loadComponent: () => import('./features/admin/logs/admin-logs.component').then((m) => m.AdminLogsComponent) },
      { path: 'notifications', loadComponent: () => import('./features/student/notifications/notifications.component').then((m) => m.NotificationsComponent) }
    ]
  },
  {
    path: 'employee',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['employee'] },
    loadComponent: () => import('./shared/components/management-shell/management-shell.component').then((m) => m.ManagementShellComponent),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', loadComponent: () => import('./features/employee/dashboard/employee-dashboard.component').then((m) => m.EmployeeDashboardComponent) },
      { path: 'scholarships', loadComponent: () => import('./features/admin/scholarships/manage-scholarships.component').then((m) => m.ManageScholarshipsComponent) },
      { path: 'applications', loadComponent: () => import('./features/employee/applications/employee-applications.component').then((m) => m.EmployeeApplicationsComponent) },
      { path: 'notifications', loadComponent: () => import('./features/student/notifications/notifications.component').then((m) => m.NotificationsComponent) }
    ]
  },
  { path: '**', redirectTo: '' }
];
