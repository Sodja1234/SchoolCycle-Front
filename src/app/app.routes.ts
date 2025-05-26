import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path : '',
    loadComponent:() => import('../app/pages/home/home/home.component').then((m)=> m.HomeComponent),
  },
  {
    path : 'register',
    loadComponent:() => import('../app/pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path : 'login',
    loadComponent:() => import('../app/pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path : 'verify-email/:id/:hash',
    loadComponent : ()=>
      import('./pages/auth/verify-email/verify-email.component').then((m)=> m.VerifyEmailComponent)
  },
  
  {
    path: 'forgot-password',
    loadComponent: () =>
    import('./pages/auth/reset-password/reset-password.component').then(
      (m) => m.ResetPasswordComponent
    ),
  }

];
