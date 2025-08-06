import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import {UserLocalService} from '../../core/services/userlocal/userlocal.service';
import {UrlStorageService} from '../../core/services/url/url-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserLocalService);
  const urlStorage = inject(UrlStorageService);

  if (userService.isAuthenticated()) {
    return true;
  }

  // Stocke l'URL actuelle avant redirection
  urlStorage.setPreviousUrl(state.url);
  router.navigate(['/login']);
  return false;
};
