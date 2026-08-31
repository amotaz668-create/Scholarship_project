import { Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { applicationStatusText } from '../../../core/models/application.models';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  template: '<span class="status-badge" [attr.data-tone]="tone()">{{ label() }}</span>'
})
export class StatusBadgeComponent {
  private readonly i18n = inject(I18nService);
  readonly status = input.required<string>();
  readonly label = computed(() => this.i18n.translate(applicationStatusText(this.status())));
  readonly tone = computed(() => {
    const status = this.status();
    if (['accepted', 'approved', 'published', 'active'].includes(status)) return 'success';
    if (['rejected', 'closed', 'withdrawn'].includes(status)) return 'danger';
    if (['under_review', 'submitted', 'pending', 'missing_documents'].includes(status)) return 'warning';
    return 'neutral';
  });
}
