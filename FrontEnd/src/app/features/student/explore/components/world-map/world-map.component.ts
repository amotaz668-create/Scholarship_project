import { Component, computed, inject, input, output, signal } from '@angular/core';
import world from '@svg-maps/world';
import { CountryService } from '../../../../../core/services/country.service';
import { I18nService } from '../../../../../core/i18n/i18n.service';

export interface MapCountryData {
  code: string;
  count: number;
}

interface TooltipState {
  code: string;
  x: number;
  y: number;
}

@Component({
  selector: 'app-world-map',
  standalone: true,
  template: `
    <div class="world-map" (pointerleave)="tooltip.set(null)">
      <svg
        class="world-map-svg"
        [attr.viewBox]="map.viewBox"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Interactive scholarship world map"
      >
        @for (location of map.locations; track location.id) {
          @let code = location.id.toUpperCase();
          @let active = activeByCode().get(code);
          <path
            class="map-country"
            [class.active]="!!active"
            [class.selected]="selectedCode() === code"
            [attr.d]="location.path"
            [attr.data-country-code]="code"
            [attr.tabindex]="active ? 0 : null"
            [attr.role]="active ? 'button' : null"
            [attr.aria-label]="active ? tooltipText(code, active.count) : countryName(code, location.name)"
            (pointermove)="showPointerTooltip($event, code, active?.count)"
            (focus)="showFocusTooltip($event, code, active?.count)"
            (blur)="tooltip.set(null)"
            (click)="choose(code, !!active)"
            (keydown.enter)="choose(code, !!active)"
            (keydown.space)="$event.preventDefault(); choose(code, !!active)"
          />
        }
      </svg>

      @if (tooltip(); as tip) {
        @let active = activeByCode().get(tip.code);
        @if (active) {
          <div class="map-tooltip" role="tooltip" [style.left.px]="tip.x" [style.top.px]="tip.y">
            <strong>{{ country.flag(tip.code) }} {{ countryName(tip.code) }}</strong>
            <span>{{ scholarshipCount(active.count) }}</span>
          </div>
        }
      }
    </div>
  `
})
export class WorldMapComponent {
  readonly countries = input<MapCountryData[]>([]);
  readonly selectedCode = input('');
  readonly countryChosen = output<string>();
  readonly tooltip = signal<TooltipState | null>(null);
  readonly map = world;
  readonly country = inject(CountryService);
  private readonly i18n = inject(I18nService);

  readonly activeByCode = computed(() => new Map(this.countries().map((item) => [item.code, item])));

  countryName(code: string, fallback = code): string {
    return this.country.name({ name: fallback, code });
  }

  scholarshipCount(count: number): string {
    if (this.i18n.language() === 'ar') return `${count} ${count === 1 ? 'منحة دراسية' : 'منح دراسية'}`;
    return `${count} ${count === 1 ? 'scholarship' : 'scholarships'}`;
  }

  tooltipText(code: string, count: number): string {
    return `${this.country.flag(code)} ${this.countryName(code)}. ${this.scholarshipCount(count)}`;
  }

  showPointerTooltip(event: PointerEvent, code: string, count?: number): void {
    if (!count || event.pointerType === 'touch') return;
    const svg = (event.currentTarget as SVGPathElement).ownerSVGElement;
    if (!svg) return;
    const bounds = svg.getBoundingClientRect();
    this.tooltip.set({ code, x: event.clientX - bounds.left, y: event.clientY - bounds.top });
  }

  showFocusTooltip(event: FocusEvent, code: string, count?: number): void {
    if (!count) return;
    const path = event.currentTarget as SVGPathElement;
    const svg = path.ownerSVGElement;
    if (!svg) return;
    const pathBounds = path.getBoundingClientRect();
    const svgBounds = svg.getBoundingClientRect();
    this.tooltip.set({
      code,
      x: pathBounds.left - svgBounds.left + pathBounds.width / 2,
      y: pathBounds.top - svgBounds.top + pathBounds.height / 2
    });
  }

  choose(code: string, active: boolean): void {
    if (active) this.countryChosen.emit(code);
  }
}
