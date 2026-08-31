import { Component, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReferenceItem } from '../../../../../core/models/api.models';
import { Scholarship } from '../../../../../core/models/scholarship.models';
import { CountryService } from '../../../../../core/services/country.service';

@Component({
  selector: 'app-atlas-detail-panel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <aside class="atlas-panel">
      <button class="panel-close labeled-close" type="button" (click)="closed.emit()" aria-label="Close scholarship details"><span aria-hidden="true">×</span><span>Close</span></button>
      <p class="eyebrow">{{ country.label(scholarship().country) }}</p>
      <h2>{{ scholarship().title }}</h2>
      <p>{{ refName(scholarship().university) }}</p>
      <div class="atlas-panel-grid">
        <span><small>DEGREE</small>{{ scholarship().eligibility?.eligibleDegrees?.join(', ') || 'Open' }}</span>
        <span><small>FUNDING</small>{{ scholarship().fundingType }}</span>
        <span><small>FIELD</small>{{ refName(scholarship().category) }}</span>
        <span><small>DEADLINE</small>{{ scholarship().deadline.slice(0, 10) }}</span>
      </div>
      <div class="panel-actions">
        <a class="button primary wide" [routerLink]="['/scholarships', scholarship()._id]">View details →</a>
      </div>
    </aside>
  `,
  styles: [':host { display: contents; }']
})
export class AtlasDetailPanelComponent {
  readonly country = inject(CountryService);
  readonly scholarship = input.required<Scholarship>();
  readonly closed = output<void>();

  refName(value: string | ReferenceItem): string {
    return typeof value === 'string' ? 'Global' : value.name;
  }
}
