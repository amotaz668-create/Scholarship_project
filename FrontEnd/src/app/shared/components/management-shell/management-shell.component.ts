import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-management-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="management-shell">
      <app-sidebar [role]="auth.role() === 'employee' ? 'employee' : 'admin'" />
      <main class="management-content"><router-outlet /></main>
    </div>
  `
})
export class ManagementShellComponent {
  readonly auth = inject(AuthService);
}
