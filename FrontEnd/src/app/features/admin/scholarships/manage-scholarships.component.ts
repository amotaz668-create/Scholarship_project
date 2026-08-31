import { DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReferenceItem } from '../../../core/models/api.models';
import { ScholarshipStatus } from '../../../core/models/constants';
import { Scholarship, ScholarshipPayload } from '../../../core/models/scholarship.models';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { apiErrorMessage } from '../../../core/services/error-message';
import { ScholarshipService } from '../../../core/services/scholarship.service';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { UiStateComponent } from '../../../shared/components/ui-state/ui-state.component';
import { ScholarshipEditorComponent } from './components/scholarship-editor/scholarship-editor.component';

@Component({
  selector: 'app-manage-scholarships',
  standalone: true,
  imports: [DatePipe, FormsModule, ScholarshipEditorComponent, StatusBadgeComponent, UiStateComponent],
  templateUrl: './manage-scholarships.component.html'
})
export class ManageScholarshipsComponent {
  private readonly api = inject(ScholarshipService);
  private readonly catalogsApi = inject(CatalogService);

  readonly auth = inject(AuthService);
  readonly scholarships = signal<Scholarship[]>([]);
  readonly categories = signal<ReferenceItem[]>([]);
  readonly countries = signal<ReferenceItem[]>([]);
  readonly universities = signal<ReferenceItem[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');
  readonly editorOpen = signal(false);
  readonly editing = signal<Scholarship | null>(null);
  search = '';
  status = '';

  readonly filtered = computed(() => this.scholarships().filter((item) =>
    (!this.status || item.status === this.status) &&
    (!this.search || `${item.title} ${item.provider}`.toLowerCase().includes(this.search.toLowerCase()))
  ));

  constructor() {
    this.reload();
    this.catalogsApi.loadAll().subscribe({
      next: ({ categories, countries, universities }) => {
        this.categories.set(categories.data);
        this.countries.set(countries.data);
        this.universities.set(universities.data);
      },
      error: (error: unknown) => this.error.set(apiErrorMessage(error, 'Could not load scholarship reference data.'))
    });
  }

  onStatusChange(status: string): void {
    this.status = status as typeof this.status;
    this.reload();
  }

  reload(): void {
    this.loading.set(true);
    this.api.list({ limit: 100, status: this.status ? this.status as ScholarshipStatus : undefined }).subscribe({
      next: ({ data }) => {
        this.scholarships.set(data);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.loading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.editorOpen.set(true);
  }

  openEdit(item: Scholarship): void {
    this.editing.set(item);
    this.editorOpen.set(true);
  }

  closeEditor(): void {
    this.editorOpen.set(false);
    this.editing.set(null);
  }

  save(payload: ScholarshipPayload): void {
    this.saving.set(true);
    this.error.set('');
    const current = this.editing();
    const request = current ? this.api.update(current._id, payload) : this.api.create(payload);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        this.closeEditor();
        this.reload();
      },
      error: (error: unknown) => {
        this.error.set(apiErrorMessage(error));
        this.saving.set(false);
      }
    });
  }

  remove(item: Scholarship): void {
    if (!confirm(`Delete ${item.title}?`)) return;
    this.api.delete(item._id).subscribe({
      next: () => this.scholarships.update((items) => items.filter((current) => current._id !== item._id)),
      error: (error: unknown) => this.error.set(apiErrorMessage(error))
    });
  }

  refName(value: string | ReferenceItem): string {
    return typeof value === 'string' ? value : value.name;
  }
}
