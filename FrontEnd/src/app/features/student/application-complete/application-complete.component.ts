import { Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { finalize, startWith } from 'rxjs';
import { ApplicationPreparation, ResolvedApplicationRequirement } from '../../../core/models/application.models';
import { StudentDocument } from '../../../core/models/notification.models';
import { ApplicationService } from '../../../core/services/application.service';
import { DocumentService } from '../../../core/services/document.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { I18nService } from '../../../core/i18n/i18n.service';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({
  selector: 'app-application-complete',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, UiStateComponent],
  template: `
    <section class="page-hero compact page-container application-flow-hero">
      <p class="eyebrow">PREPARE APPLICATION</p>
      <h1>Complete your <span>application.</span></h1>
      <p>Profile information is reused automatically. Add only missing or scholarship-specific details.</p>
    </section>
    @if (loading()) { <section class="section page-container"><div class="skeleton details-skeleton"></div></section> }
    @else if (error() && !preparation()) { <section class="section page-container"><app-ui-state icon="!" title="Application unavailable" [message]="error()" /></section> }
    @else if (preparation(); as data) {
      <form class="application-flow-layout page-container" [formGroup]="form" (ngSubmit)="save(false)">
        <main class="application-flow-main">
          @if (error()) { <div class="alert error">{{ error() }}</div> }
          @if (success()) { <div class="alert success">{{ success() }}</div> }

          <section class="content-card">
            <div class="section-heading"><p class="eyebrow">PROFILE DATA</p><h2>Already in your passport</h2></div>
            <div class="prepared-data-grid">
              @for (requirement of profileRequirements(); track requirement.key) {
                @if (requirement.origin === 'profile') {
                  <div><small>{{ requirementLabel(requirement) }}</small><b><bdi>{{ displayValue(requirement.value) }}</bdi></b><span>From your profile</span></div>
                }
              } @empty { <p class="muted">This scholarship does not request additional reusable profile fields.</p> }
            </div>
          </section>

          @if (editableRequirements().length) {
            <section class="content-card">
              <div class="section-heading"><p class="eyebrow">ADDITIONAL INFORMATION</p><h2>Complete the missing details</h2></div>
              <div class="dynamic-requirements">
                @for (requirement of editableRequirements(); track requirement.key) {
                  <label [class.full-width]="requirement.type === 'textarea'">
                    {{ requirementLabel(requirement) }} @if (requirement.required) { <span class="required-mark">*</span> }
                    @switch (requirement.type) {
                      @case ('textarea') { <textarea rows="6" [formControlName]="requirement.key"></textarea> }
                      @case ('number') { <input type="number" [formControlName]="requirement.key"> }
                      @case ('date') { <input type="date" [formControlName]="requirement.key"> }
                      @case ('select') { <select [formControlName]="requirement.key"><option value="">Select</option>@for (option of requirement.options || []; track option) { <option [value]="option">{{ option }}</option> }</select> }
                      @case ('boolean') { <span class="confirmation-control"><input type="checkbox" [formControlName]="requirement.key"> I confirm</span> }
                      @default { <input type="text" [formControlName]="requirement.key"> }
                    }
                    @if (requirement.source === 'profile') { <small>This reusable value can also be saved to your Profile.</small> }
                  </label>
                }
              </div>
              @if (hasEditableProfileFields()) { <label class="check-label save-profile-choice"><input type="checkbox" [formControl]="saveToProfile"> Save reusable personal information back to my Profile</label> }
            </section>
          }

          <section class="content-card">
            <div class="section-heading"><p class="eyebrow">DOCUMENTS</p><h2>Required files</h2></div>
            <div class="application-document-list">
              @for (type of documentTypes(); track type) {
                <article [class.ready]="documentFor(type)">
                  <div><span class="file-icon">DOC</span><div><b>{{ type }}</b><small>{{ documentFor(type)?.fileName || 'No file selected' }}</small></div></div>
                  @if (documentFor(type); as document) {
                    <div class="document-row-actions"><button class="text-link" type="button" (click)="view(document)">View</button><label class="check-label"><input type="checkbox" [checked]="selectedDocumentIds().has(document._id)" (change)="toggleDocument(document, $any($event.target).checked)"> Attach</label></div>
                  } @else {
                    <div class="inline-upload"><input type="file" accept=".pdf,.jpg,.jpeg,.png" (change)="pickFile(type, $event)"><button class="button ghost small" type="button" [disabled]="!pendingFiles.has(type) || uploadingType() === type" (click)="upload(type)">{{ uploadingType() === type ? 'Uploading…' : 'Upload' }}</button></div>
                  }
                </article>
              } @empty { <p class="muted">No documents are required for this scholarship.</p> }
            </div>
          </section>
        </main>

        <aside class="application-flow-summary">
          <p class="eyebrow">DRAFT APPLICATION</p>
          <h2><bdi>{{ data.scholarship.title }}</bdi></h2>
          <p>{{ completionText() }}</p>
          @if (!localComplete()) { <div class="missing-summary">@for (item of missingLabels(); track item) { <span>{{ item }}</span> }</div> }
          <button class="button ghost wide" type="submit" [disabled]="saving()">{{ saving() ? 'Saving…' : 'Save draft' }}</button>
          <button class="button primary wide" type="button" [disabled]="saving() || form.invalid" (click)="save(true)">Continue to review →</button>
          <a class="text-link center-link" routerLink="/applications">Back to My Applications</a>
        </aside>
      </form>
    }
  `
})
export class ApplicationCompleteComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly applications = inject(ApplicationService);
  private readonly documents = inject(DocumentService);
  readonly i18n = inject(I18nService);
  readonly preparation = signal<ApplicationPreparation | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly uploadingType = signal('');
  readonly error = signal('');
  readonly success = signal('');
  readonly selectedDocumentIds = signal<Set<string>>(new Set());
  readonly saveToProfile = new FormControl(false, { nonNullable: true });
  readonly form = new UntypedFormGroup({});
  readonly formState = toSignal(this.form.valueChanges.pipe(startWith(this.form.getRawValue())));
  readonly pendingFiles = new Map<string, File>();
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly profileRequirements = computed(() => this.preparation()?.requirements.filter((item) => item.source === 'profile' && item.type !== 'document') ?? []);
  readonly editableRequirements = computed(() => this.preparation()?.requirements.filter((item) =>
    item.type !== 'document' && (item.source === 'application' || item.origin !== 'profile')) ?? []);
  readonly hasEditableProfileFields = computed(() => this.editableRequirements().some((item) => item.source === 'profile'));
  readonly documentTypes = computed(() => {
    const data = this.preparation();
    if (!data) return [];
    return [...new Set([
      ...(data.scholarship.requiredDocuments ?? []).map((document) => document.type),
      ...data.requirements.filter((requirement) => requirement.type === 'document').map((requirement) => requirement.key)
    ])];
  });
  readonly localComplete = computed(() => { this.formState(); return this.form.valid && this.documentTypes().every((type) => Boolean(this.documentFor(type)) && this.selectedDocumentIds().has(this.documentFor(type)!._id)); });
  readonly completionText = computed(() => this.localComplete() ? 'Ready for review' : 'Complete the required information before review.');
  readonly missingLabels = computed(() => {
    this.formState();
    const labels = this.editableRequirements().filter((item) => item.required && this.form.get(item.key)?.invalid).map((item) => this.requirementLabel(item));
    for (const type of this.documentTypes()) if (!this.documentFor(type) || !this.selectedDocumentIds().has(this.documentFor(type)!._id)) labels.push(type);
    return labels;
  });

  constructor() { this.load(); }

  load(): void {
    this.loading.set(true);
    this.applications.prepare(this.id).pipe(finalize(() => this.loading.set(false))).subscribe({
      next: ({ data }) => this.bind(data),
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Application could not be prepared.'))
    });
  }

  save(review: boolean): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.saving.set(true);
    this.error.set('');
    const answers = this.editableRequirements()
      .filter((item) => item.source === 'application')
      .map((item) => ({ requirementKey: item.key, question: item.label, answer: this.form.get(item.key)?.value }));
    const profileData = Object.fromEntries(this.editableRequirements()
      .filter((item) => item.source === 'profile' && item.profileField)
      .map((item) => [item.profileField!, this.form.get(item.key)?.value]));
    this.applications.update(this.id, {
      answers,
      profileData,
      documents: (this.preparation()?.availableDocuments ?? [])
        .filter((document) => this.selectedDocumentIds().has(document._id))
        .map((document) => ({
          documentId: document._id,
          name: document.type,
          type: document.type,
          fileName: document.fileName,
          fileUrl: document.fileUrl,
          mimeType: document.mimeType
        })),
      saveProfile: this.saveToProfile.value
    }).pipe(finalize(() => this.saving.set(false))).subscribe({
      next: ({ data }) => {
        this.bind(data);
        if (review && data.readiness.complete) void this.router.navigate(['/applications', this.id, 'review']);
        else if (review) this.error.set('Complete all required information and documents before review.');
        else this.success.set('Draft saved.');
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Could not save the application. Please try again.'))
    });
  }

  pickFile(type: string, event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.pendingFiles.set(type, file);
  }

  upload(type: string): void {
    const file = this.pendingFiles.get(type);
    if (!file) return;
    this.uploadingType.set(type);
    this.documents.upload(type, file).pipe(finalize(() => this.uploadingType.set(''))).subscribe({
      next: ({ data }) => {
        this.preparation.update((current) => current ? { ...current, availableDocuments: [data, ...current.availableDocuments.filter((item) => item._id !== data._id)] } : current);
        this.selectedDocumentIds.update((ids) => new Set([...ids, data._id]));
        this.pendingFiles.delete(type);
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Could not upload the document.'))
    });
  }

  toggleDocument(document: StudentDocument, selected: boolean): void {
    this.selectedDocumentIds.update((ids) => {
      const next = new Set(ids);
      if (selected) next.add(document._id); else next.delete(document._id);
      return next;
    });
  }

  view(document: StudentDocument): void {
    const preview = window.open('', '_blank');
    this.documents.view(document._id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        if (preview) preview.location.href = url;
        else window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      },
      error: (error: unknown) => { preview?.close(); this.error.set(apiErrorMessage(error, 'Could not open the document.')); }
    });
  }

  documentFor(type: string): StudentDocument | undefined {
    const documents = this.preparation()?.availableDocuments ?? [];
    return documents.find((document) => document.type === type && this.selectedDocumentIds().has(document._id))
      ?? documents.find((document) => document.type === type);
  }

  requirementLabel(requirement: ResolvedApplicationRequirement): string {
    return this.i18n.language() === 'ar' && requirement.labelAr ? requirement.labelAr : requirement.label;
  }

  displayValue(value: unknown): string { return value === undefined || value === null || value === '' ? 'Not provided' : String(value); }

  private bind(data: ApplicationPreparation): void {
    this.preparation.set(data);
    const selected = new Set(data.selectedDocumentIds);
    for (const type of [...new Set((data.scholarship.requiredDocuments ?? []).map((document) => document.type))]) {
      if (!data.availableDocuments.some((document) => document.type === type && selected.has(document._id))) {
        const reusable = data.availableDocuments.find((document) => document.type === type);
        if (reusable) selected.add(reusable._id);
      }
    }
    this.selectedDocumentIds.set(selected);
    for (const key of Object.keys(this.form.controls)) this.form.removeControl(key);
    for (const requirement of data.requirements) {
      if (requirement.type === 'document' || (requirement.source === 'profile' && requirement.origin === 'profile')) continue;
      const validators = requirement.required
        ? [requirement.type === 'boolean' ? Validators.requiredTrue : Validators.required]
        : [];
      this.form.addControl(requirement.key, new UntypedFormControl(requirement.value ?? (requirement.type === 'boolean' ? false : ''), validators));
    }
  }
}
