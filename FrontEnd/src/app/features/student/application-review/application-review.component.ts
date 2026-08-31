import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ApplicationPreparation, ResolvedApplicationRequirement } from '../../../core/models/application.models';
import { ReferenceItem } from '../../../core/models/api.models';
import { StudentDocument } from '../../../core/models/notification.models';
import { ApplicationService } from '../../../core/services/application.service';
import { CountryService } from '../../../core/services/country.service';
import { DocumentService } from '../../../core/services/document.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({
  selector: 'app-application-review',
  standalone: true,
  imports: [RouterLink, UiStateComponent],
  template: `
    <section class="page-hero compact page-container application-flow-hero"><p class="eyebrow">REVIEW & SUBMIT</p><h1>Review your <span>application.</span></h1><p>Nothing is submitted until you confirm below.</p></section>
    @if (loading()) { <section class="section page-container"><div class="skeleton details-skeleton"></div></section> }
    @else if (error() && !preparation()) { <section class="section page-container"><app-ui-state icon="!" title="Application unavailable" [message]="error()" /></section> }
    @else if (preparation(); as data) {
      <div class="application-review-layout page-container">
        <main>
          @if (error()) { <div class="alert error">{{ error() }}</div> }
          <section class="content-card review-scholarship"><p class="eyebrow">SCHOLARSHIP</p><h2><bdi>{{ data.scholarship.title }}</bdi></h2><dl class="record-details"><div><dt>Country</dt><dd>{{ country.label(data.scholarship.country) }}</dd></div><div><dt>University</dt><dd><bdi>{{ refName(data.scholarship.university) }}</bdi></dd></div><div><dt>Degree</dt><dd>{{ degreeLabel(data) }}</dd></div></dl></section>
          <section class="content-card"><p class="eyebrow">PERSONAL INFORMATION</p><h2>Profile data used</h2><dl class="review-list">@for (requirement of profileRequirements(data); track requirement.key) { <div><dt>{{ label(requirement) }}</dt><dd><bdi>{{ value(requirement.value) }}</bdi></dd></div> } @empty { <p class="muted">No additional profile fields are required.</p> }</dl></section>
          <section class="content-card"><p class="eyebrow">APPLICATION ANSWERS</p><h2>Scholarship-specific information</h2><dl class="review-list">@for (requirement of answerRequirements(data); track requirement.key) { <div><dt>{{ label(requirement) }}</dt><dd><bdi>{{ value(requirement.value) }}</bdi></dd></div> } @empty { <p class="muted">No additional answers are required.</p> }</dl></section>
          <section class="content-card"><p class="eyebrow">DOCUMENTS</p><h2>Files attached</h2><div class="document-list">@for (document of selectedDocuments(data); track document._id) { <article><span class="file-icon">DOC</span><div><b>{{ document.type }}</b><small>{{ document.fileName }}</small></div><button class="text-link" type="button" (click)="view(document)">View</button></article> } @empty { <p class="muted">No documents attached.</p> }</div></section>
        </main>
        <aside class="application-flow-summary"><p class="eyebrow">FINAL CHECK</p><h2>{{ data.readiness.complete ? 'Ready to submit' : 'Application incomplete' }}</h2>@if (!data.readiness.complete) { <div class="missing-summary">@for (item of missing(data); track item) { <span>{{ item }}</span> }</div> }<a class="button ghost wide" [routerLink]="['/applications', id, 'complete']">Edit information</a><button class="button primary wide" type="button" [disabled]="!data.readiness.complete || submitting()" (click)="submit()">{{ submitting() ? 'Submitting…' : 'Submit application' }}</button><p class="muted">Submission creates a historical snapshot of the profile information shown here.</p></aside>
      </div>
    }
  `
})
export class ApplicationReviewComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applications = inject(ApplicationService);
  private readonly documents = inject(DocumentService);
  readonly country = inject(CountryService);
  readonly i18n = inject(I18nService);
  readonly preparation = signal<ApplicationPreparation | null>(null);
  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly error = signal('');
  readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  constructor() {
    this.applications.prepare(this.id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ data }) => this.preparation.set(data),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Application could not be loaded.'))
    });
  }

  submit(): void {
    this.submitting.set(true);
    this.error.set('');
    this.applications.submit(this.id).pipe(finalize(() => this.submitting.set(false))).subscribe({
      next: () => void this.router.navigate(['/applications'], { queryParams: { submitted: this.id } }),
      error: (error: unknown) => {
        if (error instanceof HttpErrorResponse && error.error?.missing) {
          this.preparation.update((current) => current ? { ...current, readiness: { complete: false, missing: error.error.missing } } : current);
        }
        this.error.set(apiErrorMessage(error, 'Application could not be submitted.'));
      }
    });
  }

  profileRequirements(data: ApplicationPreparation): ResolvedApplicationRequirement[] { return data.requirements.filter((item) => item.source === 'profile' && item.type !== 'document'); }
  answerRequirements(data: ApplicationPreparation): ResolvedApplicationRequirement[] { return data.requirements.filter((item) => item.source === 'application' && item.type !== 'document'); }
  selectedDocuments(data: ApplicationPreparation): StudentDocument[] { const ids = new Set(data.selectedDocumentIds); return data.availableDocuments.filter((item) => ids.has(item._id)); }
  label(requirement: ResolvedApplicationRequirement): string { return this.i18n.language() === 'ar' && requirement.labelAr ? requirement.labelAr : requirement.label; }
  value(value: unknown): string { return value === undefined || value === null || value === '' ? 'Not provided' : value === true ? 'Yes' : value === false ? 'No' : String(value); }
  refName(value: string | ReferenceItem): string { return typeof value === 'string' ? value : value.name; }
  degreeLabel(data: ApplicationPreparation): string { return data.scholarship.eligibility?.eligibleDegrees?.map((degree) => this.i18n.translate(degree)).join(', ') || this.i18n.translate('Open level'); }
  missing(data: ApplicationPreparation): string[] { return [...data.readiness.missing.profileFields.map((item) => this.i18n.language() === 'ar' && item.labelAr ? item.labelAr : item.label), ...data.readiness.missing.answers.map((item) => this.i18n.language() === 'ar' && item.labelAr ? item.labelAr : item.label), ...data.readiness.missing.documents]; }

  view(document: StudentDocument): void {
    const preview = window.open('', '_blank');
    this.documents.view(document._id).subscribe({ next: (blob) => { const url = URL.createObjectURL(blob); if (preview) preview.location.href = url; else window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 60_000); }, error: (error: unknown) => { preview?.close(); this.error.set(apiErrorMessage(error, 'Could not open the document.')); } });
  }
}
