import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Scholarship } from '../../../core/models/scholarship.models';
import { ReferenceItem } from '../../../core/models/api.models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { CountryService } from '../../../core/services/country.service';
import { I18nService } from '../../../core/i18n/i18n.service';

@Component({
  selector: 'app-scholarship-card',
  standalone: true,
  imports: [RouterLink, StatusBadgeComponent],
  template: `
    <article class="boarding-card">
      <div class="boarding-topline">
        <span class="country-code">{{ countryLabel() }}</span>
        <span class="ticket-number">SA / {{ scholarship()._id.slice(-5).toUpperCase() }}</span>
      </div>
      <div class="boarding-body">
        <div>
          <small class="eyebrow">{{ universityName() }}</small>
          <h3>{{ scholarship().title }}</h3>
          <div class="chip-row">
            @for (degree of scholarship().eligibility?.eligibleDegrees?.slice(0, 2) ?? []; track degree) {
              <span class="chip">{{ i18n.translate(degree) }}</span>
            }
            <span class="chip accent">{{ i18n.translate(scholarship().fundingType) }}</span>
          </div>
        </div>
        <div class="deadline-stamp">
          <small>DEADLINE</small>
          <b>{{ deadlineDay() }}</b>
          <span>{{ deadlineMonth() }}</span>
        </div>
      </div>
      <div class="boarding-footer">
        <app-status-badge [status]="scholarship().status" />
        <div class="ticket-actions">
          <button type="button" class="button ghost small" [disabled]="!saveEnabled()" (click)="$event.stopPropagation(); saveToggle.emit(scholarship())">
            {{ saved() ? 'Saved ✓' : 'Save' }}
          </button>
          <a class="button primary small" [routerLink]="['/scholarships', scholarship()._id]">Details →</a>
        </div>
      </div>
    </article>
  `
})
export class ScholarshipCardComponent {
  private readonly country = inject(CountryService);
  readonly i18n = inject(I18nService);
  readonly scholarship = input.required<Scholarship>();
  readonly saveEnabled = input(false);
  readonly saved = input(false);
  readonly saveToggle = output<Scholarship>();
  readonly countryLabel = computed(() => this.country.label(this.scholarship().country) || 'Destination pending');
  readonly universityName = computed(() => this.refName(this.scholarship().university, 'Multiple institutions'));
  readonly deadlineDay = computed(() => new Date(this.scholarship().deadline).toLocaleDateString(this.i18n.language(), { day: '2-digit' }));
  readonly deadlineMonth = computed(() => new Date(this.scholarship().deadline).toLocaleDateString(this.i18n.language(), { month: 'short' }).toUpperCase());

  private refName(value: string | ReferenceItem, fallback: string): string {
    return typeof value === 'string' ? fallback : value.name;
  }
}
