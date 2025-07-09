import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserLocalService } from '../../core/services/userlocal/userlocal.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const userLocalService = inject(UserLocalService)
  const router = inject(Router)
  const user = userLocalService.getUser();
  const role = user?.role;
  if (role !== 'admin') {
    router.navigate(['/'])
    return false;
  }
  return true;
};
