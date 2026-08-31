import { Component, input } from '@angular/core';

@Component({
  selector: 'app-ui-state',
  standalone: true,
  template: `
    <div class="ui-state" [class.compact]="compact()">
      <span class="state-icon">{{ icon() }}</span>
      <h3>{{ title() }}</h3>
      <p>{{ message() }}</p>
    </div>
  `
})
export class UiStateComponent {
  readonly icon = input('✦');
  readonly title = input.required<string>();
  readonly message = input.required<string>();
  readonly compact = input(false);
}
