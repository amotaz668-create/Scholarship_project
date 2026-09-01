import { Component, input } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  template: `
    <div class="progress-ring" [class.small]="small()" [style.--value]="value()">
      <strong>{{ value() }}%</strong>
      <span>{{ label() }}</span>
    </div>
  `,
  styles: [':host { display: contents; }']
})
export class ProgressRingComponent {
  readonly value = input.required<number>();
  readonly label = input('complete');
  readonly small = input(false);
}
