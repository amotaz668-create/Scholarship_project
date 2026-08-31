import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { User, UserRole } from '../../../core/models/user.models';
import { apiErrorMessage } from '../../../core/services/error-message';
import { UserService } from '../../../core/services/user.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({ selector: 'app-manage-users', standalone: true, imports: [DatePipe, FormsModule, ReactiveFormsModule, StatusBadgeComponent, UiStateComponent], template: `
  <section class="management-page"><header class="page-header split"><div><p class="eyebrow">USER DIRECTORY</p><h1>Manage users</h1><p>Only safe account fields are shown. Passwords and hashes are never returned or displayed.</p></div><button class="button primary" type="button" (click)="staffOpen.set(true)">Create staff account</button></header>
    <div class="toolbar"><input [(ngModel)]="search" placeholder="Search name or email"><select [(ngModel)]="role"><option value="">All roles</option><option value="student">Student</option><option value="employee">Employee</option><option value="admin">Admin</option></select><button class="button ghost small" type="button" (click)="reload()">Apply filters</button></div>
    @if (error()) { <div class="alert error">{{ error() }}</div> }
    @if (loading()) { <div class="skeleton table-skeleton"></div> } @else if (!users().length) { <app-ui-state title="No users found" message="Try changing the directory filters." /> } @else { <div class="table-wrap"><table><thead><tr><th>User</th><th>Role</th><th>Joined</th><th>Status</th><th>Actions</th></tr></thead><tbody>@for (user of users(); track user._id) { <tr><td><div class="user-cell"><span>{{ initials(user.name) }}</span><div><b>{{ user.name }}</b><small>{{ user.email }}</small></div></div></td><td>{{ user.role }}</td><td>{{ user.createdAt | date:'mediumDate' }}</td><td><app-status-badge [status]="user.isActive ? 'active' : 'inactive'" /></td><td><div class="table-actions"><button type="button" (click)="toggle(user)">{{ user.isActive ? 'Deactivate' : 'Activate' }}</button><button type="button" class="danger-link" (click)="remove(user)">Delete</button></div></td></tr> }</tbody></table></div> }
    @if (staffOpen()) { <div class="modal-backdrop" (click)="staffOpen.set(false)"><section class="modal-card" (click)="$event.stopPropagation()"><button class="panel-close" type="button" (click)="staffOpen.set(false)">×</button><p class="eyebrow">ADMIN ACTION</p><h2>Create staff account</h2><p class="muted">Public registration always creates students. Staff accounts use the protected endpoint.</p><form [formGroup]="staffForm" (ngSubmit)="createStaff()"><label>Name<input formControlName="name"></label><label>Email<input type="email" formControlName="email"></label><label>Temporary password<input type="password" formControlName="password"></label><label>Role<select formControlName="role"><option value="employee">Employee</option><option value="admin">Admin</option></select></label><button class="button primary wide" type="submit" [disabled]="staffForm.invalid">Create account</button></form></section></div> }
  </section>` })
export class ManageUsersComponent {
  private readonly api = inject(UserService); private readonly fb = inject(FormBuilder); readonly users = signal<User[]>([]); readonly loading = signal(true); readonly error = signal(''); readonly staffOpen = signal(false); search = ''; role: UserRole | '' = '';
  private readonly i18n = inject(I18nService);
  readonly staffForm = this.fb.nonNullable.group({ name: ['', [Validators.required, Validators.minLength(2)]], email: ['', [Validators.required, Validators.email]], password: ['', [Validators.required, Validators.minLength(6)]], role: ['employee' as 'employee' | 'admin', Validators.required] });
  constructor() { this.reload(); }
  reload(): void { this.loading.set(true); this.api.getAll({ search: this.search || undefined, role: this.role || undefined }).subscribe({ next: ({ data }) => { this.users.set(data); this.loading.set(false); }, error: (error: unknown) => { this.error.set(apiErrorMessage(error)); this.loading.set(false); } }); }
  createStaff(): void { if (this.staffForm.invalid) return; this.api.createStaff(this.staffForm.getRawValue()).subscribe({ next: () => { this.staffOpen.set(false); this.staffForm.reset({ name: '', email: '', password: '', role: 'employee' }); this.reload(); }, error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  toggle(user: User): void { if (!user._id) return; this.api.changeStatus(user._id, !user.isActive).subscribe({ next: ({ data }) => this.users.update((items) => items.map((item) => item._id === data._id ? data : item)), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  remove(user: User): void { if (!user._id) return; const message = this.i18n.language() === 'ar' ? `حذف ${user.email}؟` : `Delete ${user.email}?`; if (!confirm(message)) return; this.api.delete(user._id).subscribe({ next: () => this.users.update((items) => items.filter((item) => item._id !== user._id)), error: (error: unknown) => this.error.set(apiErrorMessage(error)) }); }
  initials(name: string): string { return name.split(' ').slice(0,2).map((word) => word[0]).join('').toUpperCase(); }
}
