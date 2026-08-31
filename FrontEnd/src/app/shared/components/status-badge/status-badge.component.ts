import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: '<span class="status-badge" [attr.data-tone]="tone()">{{ label() }}</span>'
})
export class StatusBadgeComponent {
  readonly status = input.required<string>();
  readonly label = computed(() => this.status().replaceAll('_', ' '));
  readonly tone = computed(() => {
    const status = this.status();
    if (['accepted', 'approved', 'published', 'active'].includes(status)) return 'success';
    if (['rejected', 'closed', 'withdrawn'].includes(status)) return 'danger';
    if (['under_review', 'submitted', 'pending', 'missing_documents'].includes(status)) return 'warning';
    return 'neutral';
  });
}
