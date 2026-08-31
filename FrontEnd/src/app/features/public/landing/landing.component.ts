import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Scholarship } from '../../../core/models/scholarship.models';
import { ReferenceItem } from '../../../core/models/api.models';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { CountryService } from '../../../core/services/country.service';
import { ScholarshipCardComponent } from '../../../shared/components/scholarship-card/scholarship-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

interface DestinationSummary { code: string; name: string; count: number; flag: string; }

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, ScholarshipCardComponent, UiStateComponent],
  template: `
    <section class="hero atlas-background">
      <div class="hero-grid"></div>
      <div class="hero-content page-container">
        <p class="eyebrow"><span class="live-dot"></span> GLOBAL OPPORTUNITIES, ONE PASSPORT</p>
        <h1>YOUR FUTURE<br><span>HAS NO BORDERS.</span></h1>
        <p class="hero-copy">Discover scholarships around the world and turn opportunities into your next destination.</p>
        <div class="hero-search">
          <span>⌕</span>
          <input [formControl]="search" (keyup.enter)="explore()" placeholder="Search scholarship, country, university or field">
          <button class="button primary" type="button" (click)="explore()">Explore opportunities →</button>
        </div>
        <div class="hero-actions">
          <a class="text-link" routerLink="/register">Start your journey <span>↗</span></a>
          <span>Explore · Discover · Qualify · Apply · Study</span>
        </div>
      </div>
      <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
    </section>

    <section class="stats-strip">
      <div class="page-container stats-grid">
        <div><strong>{{ totalScholarships() }}</strong><span>Scholarships</span></div>
        <div><strong>{{ countries().length }}</strong><span>Countries</span></div>
        <div><strong>{{ universities().length }}</strong><span>Universities</span></div>
        <div><strong>—</strong><span>Successful applications <small>Protected statistic</small></span></div>
      </div>
    </section>

    <section class="section page-container">
      <div class="section-heading split"><div><p class="eyebrow">POPULAR DESTINATIONS</p><h2>Pick a place on your horizon.</h2></div><a routerLink="/explore" class="text-link">Open the Atlas →</a></div>
      @if (loading()) {
        <div class="destination-grid skeleton-grid">@for (item of [1,2,3,4]; track item) { <div class="skeleton card-skeleton"></div> }</div>
      } @else if (destinations().length) {
        <div class="destination-grid">
          @for (destination of destinations(); track destination.code; let index = $index) {
            <button class="destination-card" type="button" [style.--index]="index" (click)="openCountry(destination.code)">
              <span class="destination-flag">{{ destination.flag }}</span><small>DESTINATION 0{{ index + 1 }}</small>
              <h3>{{ destination.name }}</h3><p>{{ destination.count }} available {{ destination.count === 1 ? 'scholarship' : 'scholarships' }}</p><b>Explore →</b>
            </button>
          }
        </div>
      } @else {
        <app-ui-state title="No destinations yet" message="Published scholarships will appear here when the backend has data." />
      }
    </section>

    <section class="section page-container">
      <div class="section-heading split"><div><p class="eyebrow">RECOMMENDED OPPORTUNITIES</p><h2>Your next boarding pass.</h2></div><a routerLink="/explore" class="text-link">View all →</a></div>
      @if (error()) { <app-ui-state icon="!" title="Atlas unavailable" [message]="error()" /> }
      @else if (!loading() && !scholarships().length) { <app-ui-state title="No scholarships found" message="Published scholarships from the backend will appear here." /> }
      @else {
        <div class="scholarship-grid">@for (item of scholarships().slice(0, 3); track item._id) { <app-scholarship-card [scholarship]="item" /> }</div>
      }
    </section>

    <section class="passport-cta page-container">
      <div><p class="eyebrow">OPPORTUNITY PASSPORT</p><h2>Every application is a step toward somewhere new.</h2><p>Build your profile once, follow every application, and keep your entire journey in one place.</p></div>
      <a class="button light" routerLink="/register">Create your passport →</a>
    </section>
  `
})
export class LandingComponent {
  private readonly scholarshipsApi = inject(ScholarshipService);
  private readonly catalogApi = inject(CatalogService);
  private readonly router = inject(Router);
  private readonly country = inject(CountryService);
  readonly search = new FormControl('', { nonNullable: true });
  readonly loading = signal(true);
  readonly error = signal('');
  readonly scholarships = signal<Scholarship[]>([]);
  readonly countries = signal<ReferenceItem[]>([]);
  readonly universities = signal<ReferenceItem[]>([]);
  readonly totalScholarships = signal(0);
  readonly destinations = computed<DestinationSummary[]>(() => {
    const counts = new Map<string, DestinationSummary>();
    this.scholarships().forEach((item) => {
      const metadata = this.country.metadata(item.country);
      if (!metadata) return;
      const current = counts.get(metadata.code);
      counts.set(metadata.code, { ...metadata, count: (current?.count ?? 0) + 1 });
    });
    return [...counts.values()].sort((a, b) => b.count - a.count).slice(0, 6);
  });

  constructor() {
    forkJoin({ scholarships: this.scholarshipsApi.list({ limit: 100 }), catalogs: this.catalogApi.loadAll() }).subscribe({
      next: ({ scholarships, catalogs }) => {
        this.scholarships.set(scholarships.data);
        this.totalScholarships.set(scholarships.pagination.total);
        this.countries.set(catalogs.countries.data ?? []);
        this.universities.set(catalogs.universities.data ?? []);
        this.loading.set(false);
      },
      error: () => { this.error.set('We could not reach the scholarship service. Start the backend and try again.'); this.loading.set(false); }
    });
  }

  explore(): void {
    void this.router.navigate(['/explore'], { queryParams: this.search.value ? { search: this.search.value } : {} });
  }

  openCountry(code: string): void {
    void this.router.navigate(['/explore'], { queryParams: { country: code } });
  }
}
