import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : '',
    loadComponent:() => import('../app/app.component').then((m)=> m.AppComponent),
  },
  {
    path : 'register',
    loadComponent:() => import('../app/pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path : 'login',
    loadComponent:() => import('../app/pages/auth/login/login.component').then((m) => m.LoginComponent),
  }
];
