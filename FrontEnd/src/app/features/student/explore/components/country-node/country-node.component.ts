import { Component, input, output } from '@angular/core';
import { ReferenceItem } from '../../../../../core/models/api.models';

export interface CountryNode {
  country: ReferenceItem;
  count: number;
  x: number;
  y: number;
}

@Component({
  selector: 'app-country-node',
  standalone: true,
  template: `
    <button
      type="button"
      class="country-node"
      [class.selected]="selected()"
      [style.left.%]="node().x"
      [style.top.%]="node().y"
      [style.--node-size.px]="28 + node().count * 4"
      (click)="chosen.emit(node().country._id)"
    >
      <span>{{ node().count }}</span>
      <b>{{ node().country.name }}</b>
    </button>
  `,
  styles: [':host { display: contents; }']
})
export class CountryNodeComponent {
  readonly node = input.required<CountryNode>();
  readonly selected = input(false);
  readonly chosen = output<string>();
}
