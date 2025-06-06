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
  },
  {
    path: 'password-reset/:token',
    loadComponent: () =>
      import('../app/pages/auth/new-password/new-password.component').then(
        (m) => m.NewPasswordComponent
      ),
  },
  {
    path:'profils',
    loadComponent: () => import('../app/pages/profile/profils/profils.component').then((m) => m.ProfilsComponent),
  },
  {
    path:'user-setting',
    loadComponent:() => import('../app/pages/profile/user-setting/user-setting.component').then((m) => m.UserSettingComponent),
  },

  {
    path: 'chat',
    loadComponent: () =>
      import('../app/pages/chat/chat-container/chat-container.component').then(
        (m) => m.ChatContainerComponent
      )
  }

];
