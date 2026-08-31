import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReferenceItem } from '../../../../../core/models/api.models';
import { ApplicationRequirement, ApplicationRequirementType, Scholarship, ScholarshipPayload } from '../../../../../core/models/scholarship.models';
import { CountryService } from '../../../../../core/services/country.service';

@Component({
  selector: 'app-scholarship-editor',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './scholarship-editor.component.html'
})
export class ScholarshipEditorComponent {
  private readonly fb = inject(FormBuilder);
  readonly countryMetadata = inject(CountryService);

  readonly editing = input<Scholarship | null>(null);
  readonly categories = input<ReferenceItem[]>([]);
  readonly countries = input<ReferenceItem[]>([]);
  readonly universities = input<ReferenceItem[]>([]);
  readonly saving = input(false);
  readonly submitted = output<ScholarshipPayload>();
  readonly dismissed = output<void>();
  readonly requirements = signal<ApplicationRequirement[]>([]);
  readonly requirementTypes: ApplicationRequirementType[] = ['text', 'textarea', 'number', 'date', 'select', 'boolean'];
  readonly profileFields = ['name', 'email', 'phone', 'dateOfBirth', 'gender', 'nationality', 'country', 'address', 'university', 'faculty', 'department', 'degree', 'graduationYear', 'GPA', 'targetDegreeLevel', 'englishLevel', 'IELTS', 'TOEFL'];

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    provider: ['', Validators.required],
    category: ['', Validators.required],
    university: ['', Validators.required],
    country: ['', Validators.required],
    fundingType: ['', Validators.required],
    amount: [''],
    currency: [''],
    deadline: ['', Validators.required],
    applicationUrl: [''],
    status: ['draft' as 'draft' | 'published' | 'closed'],
    minGPA: [''],
    maxAge: [''],
    gender: [''],
    degrees: [''],
    fields: [''],
    documents: ['']
  });

  private readonly syncEditor = effect(() => {
    const item = this.editing();
    this.form.reset(this.emptyValues());
    this.requirements.set((item?.applicationRequirements ?? []).map((requirement) => ({ ...requirement, options: [...(requirement.options ?? [])] })));
    if (!item) return;

    this.form.patchValue({
      title: item.title,
      description: item.description,
      provider: item.provider,
      category: this.refId(item.category),
      university: this.refId(item.university),
      country: this.refId(item.country),
      fundingType: item.fundingType,
      amount: item.amount?.toString() ?? '',
      currency: item.currency ?? '',
      deadline: item.deadline.slice(0, 10),
      applicationUrl: item.applicationUrl ?? '',
      status: item.status,
      minGPA: item.eligibility?.minGPA?.toString() ?? '',
      maxAge: item.eligibility?.maxAge?.toString() ?? '',
      gender: item.eligibility?.gender ?? '',
      degrees: item.eligibility?.eligibleDegrees?.join(', ') ?? '',
      fields: item.eligibility?.eligibleFields?.join(', ') ?? '',
      documents: item.requiredDocuments?.map((document) => document.type).join(', ') ?? ''
    });
  });

  submit(): void {
    if (this.form.invalid || !this.requirementsValid()) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    this.submitted.emit({
      title: raw.title,
      description: raw.description,
      provider: raw.provider,
      category: raw.category,
      university: raw.university,
      country: raw.country,
      fundingType: raw.fundingType,
      amount: this.optionalNumber(raw.amount),
      currency: raw.currency || undefined,
      deadline: raw.deadline,
      applicationUrl: raw.applicationUrl || undefined,
      status: raw.status,
      eligibility: {
        minGPA: this.optionalNumber(raw.minGPA),
        maxAge: this.optionalNumber(raw.maxAge),
        eligibleDegrees: this.list(raw.degrees),
        eligibleFields: this.list(raw.fields),
        gender: (raw.gender || undefined) as 'Male' | 'Female' | undefined
      },
      requiredDocuments: this.list(raw.documents).map((type) => ({ type, required: true })),
      applicationRequirements: this.requirements().map((requirement) => ({
        ...requirement,
        key: requirement.key.trim(),
        label: requirement.label.trim(),
        labelAr: requirement.labelAr?.trim() || undefined,
        options: requirement.options?.map((option) => option.trim()).filter(Boolean) ?? [],
        profileField: requirement.source === 'profile' ? requirement.profileField : undefined
      }))
    });
  }

  addRequirement(): void {
    this.requirements.update((items) => [...items, {
      key: '', label: '', labelAr: '', type: 'text', required: true,
      source: 'application', options: []
    }]);
  }

  removeRequirement(index: number): void {
    this.requirements.update((items) => items.filter((_, current) => current !== index));
  }

  updateRequirement(index: number, field: keyof ApplicationRequirement, value: unknown): void {
    this.requirements.update((items) => items.map((requirement, current) => {
      if (current !== index) return requirement;
      const next = { ...requirement, [field]: value } as ApplicationRequirement;
      if (field === 'source' && value === 'application') delete next.profileField;
      return next;
    }));
  }

  updateRequirementOptions(index: number, value: string): void {
    this.updateRequirement(index, 'options', this.list(value));
  }

  requirementsValid(): boolean {
    const keys = this.requirements().map((requirement) => requirement.key.trim());
    return this.requirements().every((requirement) =>
      /^[A-Za-z][A-Za-z0-9_.-]*$/.test(requirement.key.trim()) &&
      Boolean(requirement.label.trim()) &&
      (requirement.source === 'application' || Boolean(requirement.profileField))
    ) && new Set(keys).size === keys.length;
  }

  private emptyValues() {
    return {
      title: '', description: '', provider: '', category: '', university: '', country: '',
      fundingType: '', amount: '', currency: '', deadline: '', applicationUrl: '',
      status: 'draft' as const, minGPA: '', maxAge: '', gender: '', degrees: '', fields: '', documents: ''
    };
  }

  private list(value: string): string[] {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  private optionalNumber(value: string): number | undefined {
    return value === '' ? undefined : Number(value);
  }

  private refId(value: string | ReferenceItem): string {
    return typeof value === 'string' ? value : value._id;
  }
}
