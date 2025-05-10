import { Routes } from '@angular/router';
import { CustomerFormDialogComponent } from './features/customer/pages/customer-form/customer-form.components';
import { CustomerListComponent } from './features/customer/pages/customer-list/customer-list.component';
import { LoginPageComponent } from './features/login/pages/login-page.component';
import { AuthGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    redirectTo: 'customer',
    pathMatch: 'full',
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: CustomerListComponent,
      },
      {
        path: 'add',
        component: CustomerFormDialogComponent,
      },
      {
        path: 'update/:id',
        component: CustomerFormDialogComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'customer',
  },
];
