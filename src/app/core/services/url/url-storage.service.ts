import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlStorageService {
  private previousUrl: string = '/';
  private currentUrl: string = '/';
  private forcedRedirectUrl: string | null = null;

  setPreviousUrl(url: string): void {
    if (!url.includes('/login')) {
      this.previousUrl = this.currentUrl;
      this.currentUrl = url;
    }
  }

  getPreviousUrl(): string {
    return this.previousUrl;
  }

  // Méthodes pour la redirection forcée
  setForcedRedirectUrl(url: string): void {
    this.forcedRedirectUrl = url;
  }

  getForcedRedirectUrl(): string | null {
    return this.forcedRedirectUrl;
  }

  clearForcedRedirectUrl(): void {
    this.forcedRedirectUrl = null;
  }

  getCurrentUrl(): string {
    return this.currentUrl;
  }
}
