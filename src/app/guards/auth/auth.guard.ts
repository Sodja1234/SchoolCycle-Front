import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {UserLocalService} from '../../core/services/userlocal/userlocal.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userLocalService = inject(UserLocalService);
  const user = userLocalService.getUser();
  const token = user?.token;

  if (token) {
    return true;
  } else {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
};
