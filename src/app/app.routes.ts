import { Title } from '@angular/platform-browser';
import { adminGuard } from './guards/admin/admin.guard';
import { Routes } from '@angular/router';
import {guestGuard} from './guards/guest.guard';
import {authGuard} from './guards/auth/auth.guard';
import { tutorGuard } from './guards/tutor/tutor.guard';

export const routes: Routes = [
  {
    path: '',
    title : 'Accueil - School Cycle',
    loadComponent: () =>
      import('../app/pages/home/home/home.component').then(
        (m) => m.HomeComponent
      ),
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
    path: 'profils',
    title : 'Profil - School Cycle',
    canActivate: [authGuard, tutorGuard],
    loadComponent: () =>
      import('../app/pages/profile/profils/profils.component').then(
        (m) => m.ProfilsComponent
      ),
  },
  {
    path: 'user-setting',
    title : 'Paramètres - School Cycle',
    canActivate: [authGuard, tutorGuard],
    loadComponent: () =>
      import('../app/pages/profile/user-setting/user-setting.component').then(
        (m) => m.UserSettingComponent
      ),
  },
  {
    path: 'chat',
    title : 'Chat - School Cycle',
    canActivate: [authGuard, tutorGuard],
    loadComponent: () =>
      import('../app/pages/chat/chat-container/chat-container.component').then(
        (m) => m.ChatContainerComponent
      ),
  },
  {
    path: 'create-announcement',
    title : 'Publier une annonce - School Cycle',
    canActivate: [authGuard, tutorGuard],
    loadComponent: () =>
      import(
        '../app/pages/announcement/announcement-create/announcement-create.component'
      ).then((m) => m.AnnouncementCreateComponent),
  },
  {
    path: 'edit-announcement/:id',
    title : 'Modifier une annonce - School Cycle',
    canActivate: [authGuard, tutorGuard],
    loadComponent: () =>
      import(
        '../app/pages/announcement/announcement-edit/announcement-edit.component'
      ).then((m) => m.AnnouncementEditComponent),
  },
  {
    path: 'single-announcement/:id',
    title : 'Annonce - School Cycle',
    loadComponent: () =>
      import(
        '../app/pages/announcement/announcement-single/announcement-single.component'
      ).then((m) => m.AnnouncementSingleComponent),
  },
  {
    path: 'announcement-gallery',
    title : 'Galerie - School Cycle',
    loadComponent: () =>
      import(
        '../app/pages/announcement/announcement-gallery/announcement-gallery.component'
      ).then((m) => m.AnnouncementGalleryComponent),
  },
  {
    path: 'admin/dashboard',
    title : 'Admin Dashboard - School Cycle',
    canActivate : [adminGuard, authGuard],
    loadComponent: () =>
      import(
        '../app/pages/admin/dashboard/dashboard.component'
      ).then((m) => m.DashboardComponent),
  },
  {
    path: 'admin/categories',
    title : 'Categories - School Cycle',
    canActivate : [adminGuard, authGuard],
    loadComponent: () =>
      import(
        '../app/pages/admin/categories-list/categories-list.component'
      ).then((m) => m.CategoriesListComponent),
  },
  {
    path: 'admin/announcements',
    loadComponent: () =>
      import(
        '../app/pages/admin/announcement-list/announcement-list.component'
      ).then((m) => m.AnnouncementListComponent),
  },
  {
    path : '404',
    title : '404 - School Cycle',
    loadComponent :()=> import('../app/pages/page-not-found/page-not-found.component').then((m)=> m.PageNotFoundComponent)
  },

  //pour toutes les routes vides on redigigera à l'acceuil
  {
    path : '',
    pathMatch : 'full',
    redirectTo : ''
  },

  //pour toutes routes generiques non existantes on sera rediriger à la route 404
  {
    path : '**',
    redirectTo : '404'
  },
];
