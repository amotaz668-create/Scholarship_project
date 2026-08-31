import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationStatus, ScholarshipApplication, STAFF_APPLICATION_TRANSITIONS } from '../../../core/models/application.models';
import { ApplicationService } from '../../../core/services/application.service';
import { DocumentService } from '../../../core/services/document.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ApplicationJourneyComponent } from '../../../shared/components/application-journey/application-journey.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';

@Component({
  selector: 'app-employee-applications',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, ApplicationJourneyComponent, StatusBadgeComponent, UiStateComponent],
  template: `
    <section class="management-page">
      <header class="page-header"><p class="eyebrow">APPLICATION REVIEW</p><h1>Review an assigned application</h1><p>Only applications assigned to your employee account can be opened or updated.</p></header>
      <form class="lookup-bar" [formGroup]="lookupForm" (ngSubmit)="lookup()"><input formControlName="id" placeholder="24-character MongoDB application ID"><button class="button primary" type="submit" [disabled]="lookupForm.invalid || loading()">{{ loading() ? 'Looking up…' : 'Find application →' }}</button></form>
      @if (error()) { <div class="alert error">{{ error() }}</div> }
      @if (application(); as item) {
        <div class="review-grid"><div><app-application-journey [application]="item"/>
          <section class="management-card"><div class="section-heading"><p class="eyebrow">APPLICATION CONTENT</p><h2>Submitted information</h2></div>
            <dl class="record-details"><div><dt>Student ID</dt><dd><bdi>{{ item.studentId }}</bdi></dd></div><div><dt>Application ID</dt><dd><bdi>{{ item._id }}</bdi></dd></div><div><dt>Created</dt><dd>{{ item.createdAt | date:'medium' }}</dd></div><div><dt>Submitted</dt><dd>{{ (item.submittedAt | date:'medium') || 'Not submitted' }}</dd></div></dl>
            <h3>Answers</h3>@for (answer of item.answers; track answer.requirementKey || answer.question) { <div class="answer-block"><b>{{ answer.question }}</b><p><bdi>{{ answer.answer }}</bdi></p></div> } @empty { <p class="muted">No custom answers supplied.</p> }
            <h3>Documents attached to application</h3>@for (document of item.documents; track document.documentId || document.fileName) { <button class="document-link" type="button" [disabled]="!document.documentId" (click)="view(document.documentId)">{{ document.name }} ↗</button> } @empty { <p class="muted">No documents attached to this application.</p> }
          </section>
        </div><aside class="management-card review-actions"><p class="eyebrow">DECISION DESK</p><h2>Move journey forward</h2><app-status-badge [status]="item.status"/><label>Review note<textarea rows="5" [formControl]="note" placeholder="Explain the next step to the student"></textarea></label><div class="decision-buttons">@for (next of transitions(item.status); track next) { <button class="button" [class.primary]="next === 'under_review' || next === 'accepted'" [class.danger]="next === 'rejected'" type="button" (click)="update(next)">{{ next.replaceAll('_', ' ') }}</button> } @empty { <p class="muted">No further status transitions are allowed.</p> }</div></aside></div>
      } @else if (!loading() && !error()) { <app-ui-state title="Enter an application ID" message="Open an application assigned to your employee account."/> }
    </section>
  `
})
export class EmployeeApplicationsComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApplicationService);
  private readonly documents = inject(DocumentService);
  readonly application = signal<ScholarshipApplication | null>(null);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly lookupForm = this.fb.nonNullable.group({ id: ['', [Validators.required, Validators.pattern(/^[a-f\d]{24}$/i)]] });
  readonly note = this.fb.nonNullable.control('');

  lookup(): void {
    if (this.lookupForm.invalid) return;
    this.loading.set(true); this.error.set(''); this.application.set(null);
    this.api.getById(this.lookupForm.controls.id.value).subscribe({
      next: ({ data }) => { this.application.set(data); this.loading.set(false); },
      error: (error: unknown) => { this.error.set(apiErrorMessage(error, 'Application not found or not assigned to you.')); this.loading.set(false); }
    });
  }

  view(documentId?: string): void {
    if (!documentId) return;
    const preview = window.open('', '_blank');
    this.documents.view(documentId).subscribe({
      next: (blob) => { const url = URL.createObjectURL(blob); if (preview) preview.location.href = url; else window.open(url, '_blank'); setTimeout(() => URL.revokeObjectURL(url), 60_000); },
      error: (error: unknown) => { preview?.close(); this.error.set(apiErrorMessage(error, 'Could not open the document.')); }
    });
  }

  transitions(status: ApplicationStatus): readonly ApplicationStatus[] { return STAFF_APPLICATION_TRANSITIONS[status]; }
  update(status: ApplicationStatus): void {
    const current = this.application(); if (!current) return;
    this.api.updateStatus(current._id, status, this.note.value).subscribe({
      next: ({ data }) => { this.application.set(data); this.note.setValue(''); },
      error: (error: unknown) => this.error.set(apiErrorMessage(error))
    });
  }
}
