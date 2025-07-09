import { Routes } from '@angular/router';

export default [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'employees',
    loadComponent: () =>
      import('./pages/employees/employees.component').then(
        m => m.EmployeesComponent
      )
  },
  { path: '**', redirectTo: 'about' }
] satisfies Routes;
