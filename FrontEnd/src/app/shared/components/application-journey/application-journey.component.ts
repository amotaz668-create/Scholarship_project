import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { ScholarshipApplication, ApplicationStatus } from '../../../core/models/application.models';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'app-application-journey',
  standalone: true,
  imports: [DatePipe, StatusBadgeComponent],
  template: `
    <article class="journey-card">
      <div class="journey-heading">
        <div><small>APPLICATION JOURNEY</small><h3>{{ application().scholarshipTitle }}</h3></div>
        <app-status-badge [status]="application().status" />
      </div>
      <div class="journey-meta">
        <span>Started {{ application().createdAt | date:'mediumDate' }}</span>
        <b>Step {{ currentStep() }} / {{ steps.length }}</b>
      </div>
      <div class="journey-track" [style.--progress]="progress() + '%'">
        @for (step of steps; track step.status; let index = $index) {
          <div class="journey-step" [class.done]="index + 1 < currentStep()" [class.active]="index + 1 === currentStep()">
            <span>{{ index + 1 < currentStep() ? '✓' : index + 1 }}</span>
            <small>{{ step.label }}</small>
          </div>
        }
      </div>
      @if (latestNote()) { <p class="journey-note">{{ latestNote() }}</p> }
    </article>
  `
})
export class ApplicationJourneyComponent {
  readonly application = input.required<ScholarshipApplication>();
  readonly steps: Array<{ status: ApplicationStatus; label: string }> = [
    { status: 'draft', label: 'Discover' },
    { status: 'submitted', label: 'Applied' },
    { status: 'under_review', label: 'Under review' },
    { status: 'missing_documents', label: 'Documents' },
    { status: 'accepted', label: 'Decision' }
  ];
  readonly currentStep = computed(() => {
    const status = this.application().status;
    if (status === 'withdrawn' || status === 'rejected') return 5;
    const index = this.steps.findIndex((step) => step.status === status);
    return index >= 0 ? index + 1 : 1;
  });
  readonly progress = computed(() => ((this.currentStep() - 1) / (this.steps.length - 1)) * 100);
  readonly latestNote = computed(() => this.application().timeline?.at(-1)?.note ?? '');
}
