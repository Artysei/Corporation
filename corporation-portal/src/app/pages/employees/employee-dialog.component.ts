import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup,
  FormControl
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDto, EmployeeService } from '../../Services/employee.service';

type EmployeeForm = FormGroup<{
  department: FormControl<string>;
  fullName: FormControl<string>;
  birthDate: FormControl<string>;
  hireDate: FormControl<string>;
  salary: FormControl<number>;
}>;

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-dialog.component.html'
})
export class EmployeeDialogComponent {
  @Input() title = '';
  @Input() employee?: EmployeeDto;

  form: EmployeeForm;

  constructor(
    private readonly fb: FormBuilder,
    private readonly svc: EmployeeService,
    public modal: NgbActiveModal
  ) {
    this.form = this.fb.nonNullable.group({
      department: ['', Validators.required],
      fullName: ['', Validators.required],
      birthDate: ['', Validators.required], 
      hireDate: ['', Validators.required],
      salary: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    if (this.employee) {
      this.form.patchValue({
        department: this.employee.department,
        fullName: this.employee.fullName,
        birthDate: this.employee.birthDate,
        hireDate: this.employee.hireDate,
        salary: this.employee.salary
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.getRawValue();

    const request$ = this.employee
      ? this.svc.update(this.employee.id, dto)
      : this.svc.create(dto);

    request$.subscribe(() => this.modal.close(true));
  }
}
