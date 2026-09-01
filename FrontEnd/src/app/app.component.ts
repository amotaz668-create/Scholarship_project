import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { I18nService } from "./core/i18n/i18n.service";
import { ThemeService } from "./core/services/theme.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="global-preferences" aria-label="Language and theme controls">
      <button
        type="button"
        class="nav-preference"
        (click)="i18n.toggleLanguage()"
      >
        <span aria-hidden="true">文</span>
        <span>{{ i18n.language() === "en" ? "العربية" : "English" }}</span>
      </button>

      <button type="button" class="nav-preference" (click)="theme.toggle()">
        <span aria-hidden="true">{{
          theme.theme() === "dark" ? "☀" : "☾"
        }}</span>
        <span>{{ theme.theme() === "dark" ? "Light" : "Dark" }}</span>
      </button>
    </div>

    <router-outlet />
  `,
})
export class AppComponent {
  readonly i18n = inject(I18nService);
  readonly theme = inject(ThemeService);
}
