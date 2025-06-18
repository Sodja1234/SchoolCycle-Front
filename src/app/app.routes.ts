import { Routes } from '@angular/router';
import {guestGuard} from './guards/guest.guard';

export const routes: Routes = [
  {
    path : '',
    loadComponent:() => import('../app/pages/home/home/home.component').then((m)=> m.HomeComponent),
  },
  {
    path : 'register',
    title : 'Inscription - School Cycle',
    canActivate: [guestGuard],
    loadComponent:() => import('../app/pages/auth/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path : 'login',
    title : 'Connexion - School Cycle',
    canActivate: [guestGuard],
    loadComponent:() => import('../app/pages/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path : 'verify-email/:id/:hash',
    canActivate: [guestGuard],
    title : 'Vérification - School Cycle',
    loadComponent : () =>
      import('./pages/auth/verify-email/verify-email.component').then((m)=> m.VerifyEmailComponent)
  },
  {
    path: 'forgot-password',
    title : 'Mot de passe oublié - School Cycle',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./pages/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'password-reset/:token',
    title : 'Nouveau mot de passe - School Cycle',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('../app/pages/auth/new-password/new-password.component').then((m) => m.NewPasswordComponent),
  },
  {
    path:'profils',
    loadComponent: () => import('../app/pages/profile/profils/profils.component').then((m) => m.ProfilsComponent),
  },
  {
    path:'user-setting',
    loadComponent:() => import('../app/pages/profile/user-setting/user-setting.component').then((m) => m.UserSettingComponent),
  }
  ,

  {
    path: 'chat',
    loadComponent: () =>
      import('../app/pages/chat/chat-container/chat-container.component').then(
        (m) => m.ChatContainerComponent
      )
  }
  ,
  {
    path:'create-announcement',
    loadComponent:() => import('../app/pages/announcement/announcement-create/announcement-create.component').then((m) => m.AnnouncementCreateComponent),
  },
  {
    path:'single-announcement/:id',
    loadComponent:() => import('../app/pages/announcement/announcement-single/announcement-single.component').then((m) => m.AnnouncementSingleComponent),
  },
  {
    path:'announcement-gallery',
    loadComponent:()=>import('../app/pages/announcement/announcement-gallery/announcement-gallery.component').then((m)=>m.AnnouncementGalleryComponent)
  }

];
