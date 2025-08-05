import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {UrlStorageService} from '../services/url/url-storage.service';

export const navigationTrackerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const urlStorage = inject(UrlStorageService);

  // Configuration du tracker de navigation
  router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      if (!event.urlAfterRedirects.includes('/login')) {
        urlStorage.setPreviousUrl(event.urlAfterRedirects);
      }
    });

  return next(req);
};
