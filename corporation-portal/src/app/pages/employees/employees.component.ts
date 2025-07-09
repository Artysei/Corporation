import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { EmployeeDto, EmployeeService } from '../../Services/employee.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeDialogComponent } from './employee-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeesComponent {
  private readonly fb    = inject(FormBuilder);
  private readonly api   = inject(EmployeeService);
  private readonly modal = inject(NgbModal);

  readonly filterForm: FormGroup = this.fb.group({
    department: [''],
    name: [''],
    bornFrom:  [''],
    bornTo:    [''],
    hiredFrom: [''],
    hiredTo:   [''],
    salaryFrom: [''],
    salaryTo:   ['']
  });

  readonly sortField = signal<
    'department' | 'name' | 'birth' | 'hire' | 'salary' | 'id'
  >('id');
  readonly sortAsc = signal(true);

  readonly loading   = signal(false);
  readonly employees = signal<EmployeeDto[]>([]);

  constructor() {
    effect(() => {
      const sub = this.filterForm.valueChanges
        .pipe(debounceTime(300))
        .subscribe(() => this.fetch());
      this.fetch();
      return () => sub.unsubscribe();
    });
  }

  private fetch(): void {
    this.loading.set(true);

    const v = this.filterForm.value;

    this.api
      .getAll({
        Department: v.department || undefined,
        Name:       v.name       || undefined,
        BornFrom:   v.bornFrom   || undefined,
        BornTo:     v.bornTo     || undefined,
        HiredFrom:  v.hiredFrom  || undefined,
        HiredTo:    v.hiredTo    || undefined,
        SalaryFrom: v.salaryFrom || undefined,
        SalaryTo:   v.salaryTo   || undefined,
        OrderBy:    this.sortField(),
        Asc:        this.sortAsc()
      })
      .subscribe(list => {
        this.employees.set(list);
        this.loading.set(false);
      });
  }

  changeSort(field: 'department' | 'name' | 'birth' | 'hire' | 'salary' | 'id') {
    if (this.sortField() === field) {
      this.sortAsc.update(v => !v);
    } else {
      this.sortField.set(field);
      this.sortAsc.set(true);
    }
    this.fetch();
  }

  openCreate(): void {
    const ref = this.modal.open(EmployeeDialogComponent, { centered: true });
    ref.componentInstance.title = 'Создать сотрудника';
    ref.result.then(ok => ok && this.fetch(), () => {});
  }

  openEdit(e: EmployeeDto): void {
    const ref = this.modal.open(EmployeeDialogComponent, { centered: true });
    ref.componentInstance.title    = 'Редактировать сотрудника';
    ref.componentInstance.employee = e;
    ref.result.then(ok => ok && this.fetch(), () => {});
  }

  confirmDelete(id: number): void {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true });
    ref.componentInstance.message = 'Удалить сотрудника?';
    ref.result.then(ok => ok && this.api.delete(id).subscribe(() => this.fetch()));
  }

  trackById(_: number, item: EmployeeDto) {
    return item.id;
  }
}
