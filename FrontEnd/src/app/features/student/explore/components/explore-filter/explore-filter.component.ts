import { Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ReferenceItem } from '../../../../../core/models/api.models';

@Component({
  selector: 'app-explore-filter',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <aside class="filter-panel">
      <div class="panel-heading">
        <div><small>ROUTE PLANNER</small><h2>Filters</h2></div>
        <button type="button" (click)="cleared.emit()">Reset</button>
      </div>
      <form [formGroup]="form()" (ngSubmit)="applied.emit()">
        <label>Search<input formControlName="search" placeholder="Scholarship, provider…"></label>
        <label>Country
          <select formControlName="country">
            <option value="">All destinations</option>
            @for (item of countries(); track item._id) { <option [value]="item._id">{{ item.name }}</option> }
          </select>
        </label>
        <label>University
          <select formControlName="university">
            <option value="">All universities</option>
            @for (item of universities(); track item._id) { <option [value]="item._id">{{ item.name }}</option> }
          </select>
        </label>
        <label>Field
          <select formControlName="category">
            <option value="">All fields</option>
            @for (item of categories(); track item._id) { <option [value]="item._id">{{ item.name }}</option> }
          </select>
        </label>
        <label>Funding
          <select formControlName="fundingType">
            <option value="">Any funding</option>
            @for (item of fundingTypes(); track item) { <option [value]="item">{{ item }}</option> }
          </select>
        </label>
        <div class="form-row">
          <label>Degree
            <select formControlName="degree">
              <option value="">Any level</option>
              @for (item of degreeLevels(); track item) { <option [value]="item">{{ item }}</option> }
            </select>
          </label>
          <label>Deadline before<input type="date" formControlName="deadline"></label>
        </div>
        <button class="button primary wide" type="submit">Plot this route →</button>
      </form>
    </aside>
  `,
  styles: [':host { display: contents; }']
})
export class ExploreFilterComponent {
  readonly form = input.required<FormGroup>();
  readonly countries = input<ReferenceItem[]>([]);
  readonly universities = input<ReferenceItem[]>([]);
  readonly categories = input<ReferenceItem[]>([]);
  readonly fundingTypes = input<string[]>([]);
  readonly degreeLevels = input<string[]>([]);
  readonly applied = output<void>();
  readonly cleared = output<void>();
}
