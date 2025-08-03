import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { MainLayout } from './core/layouts/main-layout/main-layout';
// import { AuthLayout } from './core/layouts/auth-layout/auth-layout';
import { IncomeForm } from './income/income-form';
import { ExpenseForm } from './expense/expense-form';
import { SavingForm } from './saving/saving-form';
import { BudgetForm } from './Budget/budget-form';

export const routes: Routes = [
  //  {
  //   path: '',
  //   component: AuthLayout,
  //   children: [
  //     { path: '', redirectTo: 'login', pathMatch: 'full' },
  //     { path: 'login', component: Login },
  //     { path: 'register', component: Register }
  //   ]
  // },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'income', component: IncomeForm },
      { path: 'expense', component: ExpenseForm },
      { path: 'saving', component: SavingForm },
      { path: 'budget', component: BudgetForm },

      // other routes...
    ],
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
];
