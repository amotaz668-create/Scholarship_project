import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>(this.readTheme());

  constructor() { this.apply(); }

  toggle(): void {
    this.theme.set(this.theme() === 'dark' ? 'light' : 'dark');
    localStorage.setItem('scholarship-atlas-theme', this.theme());
    this.apply();
  }

  private readTheme(): ThemeMode {
    const saved = localStorage.getItem('scholarship-atlas-theme');
    return saved === 'light' ? 'light' : 'dark';
  }

  private apply(): void {
    document.documentElement.dataset['theme'] = this.theme();
    document.documentElement.style.colorScheme = this.theme();
  }
}
