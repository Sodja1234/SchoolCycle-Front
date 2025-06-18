import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserLocalService} from '../core/services/userlocal/userlocal.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userLocalService = inject(UserLocalService);
  const user = userLocalService.getToken();
  const token = user?.token;

  if (token) {
    // Rediriger vers l'accueil ou dashboard si déjà connecté
    router.navigate(['']);
    return false;
  }
  return true;
};
