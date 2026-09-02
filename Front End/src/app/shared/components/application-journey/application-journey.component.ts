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
        <div><small>APPLICATION JOURNEY</small><h3>{{ application().scholarshipTitle }}</h3>
        <p class="muted">
  Degree:
  {{ application().selectedDegree || "Not specified" }}
</p>
</div>
        <app-status-badge [status]="application().status" />
      </div>
      <div class="journey-meta">
        <span>Started {{ application().createdAt | date:'mediumDate' }}</span>
        <b>Step {{ currentStep() }} / {{ steps.length }}</b>
      </div>
      <div class="journey-track" [class.withdrawn]="application().status === 'withdrawn'" [class.rejected]="application().status === 'rejected'" [class.accepted]="application().status === 'accepted'" [style.--progress]="progress() + '%'">
        @for (step of steps; track step.status; let index = $index) {
          <div class="journey-step" [class.done]="state(index) === 'done'" [class.active]="state(index) === 'active'" [class.cancelled]="state(index) === 'cancelled'" [class.decision-rejected]="state(index) === 'rejected'" [class.decision-accepted]="state(index) === 'accepted'">
            <span>{{ symbol(index) }}</span>
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
    if (status === 'rejected' || status === 'accepted') return 5;
    if (status === 'withdrawn') return this.withdrawnAt();
    const index = this.steps.findIndex((step) => step.status === status);
    return index >= 0 ? index + 1 : 1;
  });
  readonly progress = computed(() => ((this.currentStep() - 1) / (this.steps.length - 1)) * 100);
  readonly latestNote = computed(() => this.application().timeline?.at(-1)?.note ?? '');

  state(index: number): 'pending' | 'done' | 'active' | 'cancelled' | 'accepted' | 'rejected' {
    const status = this.application().status;
    if (status === 'accepted') return index === 4 ? 'accepted' : 'done';
    if (status === 'rejected') {
      if (index === 4) return 'rejected';
      const reachedDocuments = this.application().timeline?.some((item) => item.newStatus === 'missing_documents');
      return index < 3 || (index === 3 && reachedDocuments) ? 'done' : 'pending';
    }
    if (status === 'withdrawn') {
      const cancelledIndex = this.withdrawnAt() - 1;
      if (index < cancelledIndex) return 'done';
      return index === cancelledIndex ? 'cancelled' : 'pending';
    }
    if (index + 1 < this.currentStep()) return 'done';
    return index + 1 === this.currentStep() ? 'active' : 'pending';
  }

  symbol(index: number): string {
    const state = this.state(index);
    if (state === 'done' || state === 'accepted') return '✓';
    if (state === 'cancelled' || state === 'rejected') return '×';
    return String(index + 1);
  }

  private withdrawnAt(): number {
    const previous = this.application().timeline?.at(-1)?.oldStatus;
    if (previous === 'missing_documents') return 4;
    if (previous === 'under_review') return 3;
    return 2;
  }
}
