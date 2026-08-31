import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: `
    <article class="stat-card">
      <span class="stat-icon">{{ icon() }}</span>
      <div><small>{{ label() }}</small><strong>{{ value() }}</strong><p>{{ caption() }}</p></div>
    </article>
  `
})
export class StatCardComponent {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly caption = input('');
  readonly icon = input('✦');
}
