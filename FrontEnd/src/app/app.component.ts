import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { I18nService } from './core/i18n/i18n.service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="global-preferences" aria-label="Language and theme controls">
      <button type="button" class="preference-button" (click)="i18n.toggleLanguage()">
        <span aria-hidden="true">文</span> {{ i18n.language() === 'en' ? 'العربية' : 'English' }}
      </button>
      <button type="button" class="preference-button" (click)="theme.toggle()">
        <span aria-hidden="true">{{ theme.theme() === 'dark' ? '☀' : '☾' }}</span> {{ theme.theme() === 'dark' ? 'Light' : 'Dark' }}
      </button>
    </div>
    <router-outlet />
  `
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
}
