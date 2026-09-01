import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { Scholarship } from '../../../core/models/scholarship.models';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StudentService } from '../../../core/services/student.service';
import { ScholarshipCardComponent } from '../../../shared/components/scholarship-card/scholarship-card.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({ selector: 'app-saved', standalone: true, imports: [RouterLink, ScholarshipCardComponent, UiStateComponent], template: `
  <section class="page-hero compact page-container"><p class="eyebrow">SAVED OPPORTUNITIES</p><h1>Your personal <span>departure board.</span></h1><p>Keep promising opportunities close while you decide where to go next.</p></section>
  <section class="page-container sectionless">@if (loading()) { <div class="scholarship-grid"><div class="skeleton card-skeleton"></div></div> } @else if (!scholarships().length) { <app-ui-state icon="☆" title="Nothing saved yet" message="Save scholarships from Explore to build your shortlist." /><div class="center-actions"><a routerLink="/explore" class="button primary">Explore opportunities →</a></div> } @else { <div class="scholarship-grid">@for (item of scholarships(); track item._id) { <app-scholarship-card [scholarship]="item" [saveEnabled]="true" [saved]="true" (saveToggle)="remove($event)" /> }</div> }</section>` })
export class SavedComponent {
  private readonly studentApi = inject(StudentService); private readonly scholarshipApi = inject(ScholarshipService); readonly loading = signal(true); readonly scholarships = signal<Scholarship[]>([]); private ids: string[] = [];
  constructor() { this.studentApi.getProfile().subscribe({ next: ({ data }) => { this.ids = (data.profile.favorites ?? []).map(String); if (!this.ids.length) { this.loading.set(false); return; } forkJoin(this.ids.map((id) => this.scholarshipApi.getById(id).pipe(map((item) => item.data), catchError(() => of(null))))).subscribe({ next: (results) => { this.scholarships.set(results.filter((item): item is Scholarship => item !== null)); this.loading.set(false); }, error: () => this.loading.set(false) }); }, error: () => this.loading.set(false) }); }
  remove(item: Scholarship): void { const next = this.ids.filter((id) => id !== item._id); this.studentApi.updateProfile({ favorites: next }).subscribe({ next: () => { this.ids = next; this.scholarships.update((items) => items.filter((saved) => saved._id !== item._id)); } }); }
}
