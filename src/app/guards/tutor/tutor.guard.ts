import { CanActivateFn, Router } from '@angular/router';
import { UserLocalService } from '../../core/services/userlocal/userlocal.service';
import { inject } from '@angular/core';

export const tutorGuard: CanActivateFn = (route, state) => {
  const userLocalService = inject(UserLocalService)
  const router = inject(Router);
  const user = userLocalService.getUser();
  const role = user?.role;
  if (role !== 'tutor') {
    router.navigate(['/admin/dashboard']);
    return false;
  }
  return true;
};
