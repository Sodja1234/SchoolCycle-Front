import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';
import { AuthLoginData, AuthLoginResponse } from '../../../core/models/auth/auth';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { UrlStorageService } from '../../../core/services/url/url-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userLocalService: UserLocalService,
    private router: Router,
    private route: ActivatedRoute,
    private urlStorage: UrlStorageService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const data: AuthLoginData = this.loginForm.value;

    this.authService.login(data).subscribe({
      next: (response: AuthLoginResponse) => {
        this.userLocalService.stockerUserLocal(response);
        this.successMessage = 'Connexion réussie. Redirection en cours...';
        const role = response.role;

        setTimeout(() => {
          this.successMessage = '';
          this.handleRedirection(role);
        }, 2500);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect.';
        this.loading = false;
        setTimeout(() => {
          this.errorMessage = '';
        }, 2500);
      },
    });
  }

  private handleRedirection(role: string): void {
    try {
      // 1. Vérifier d'abord la redirection forcée
      const forcedRedirect = this.urlStorage.getForcedRedirectUrl();

      // 2. Vérifier l'URL précédente normale
      const previousUrl = this.urlStorage.getPreviousUrl();

      // 3. Vérifier le queryParam returnUrl
      const returnUrl = this.route.snapshot.queryParams['returnUrl'];
      const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;

      // Déterminer l'URL cible
      const targetUrl = this.determineTargetUrl(role, forcedRedirect, previousUrl, decodedUrl);

      // Nettoyer la redirection forcée après utilisation
      if (forcedRedirect) {
        this.urlStorage.clearForcedRedirectUrl();
      }

      // Effectuer la redirection
      this.router.navigateByUrl(targetUrl).catch(() => {
        this.router.navigate([this.getDefaultUrlForRole(role)]);
      });
    } catch (e) {
      console.error('Erreur lors de la redirection:', e);
      this.router.navigate(['/']);
    }
  }

  private determineTargetUrl(
    role: string,
    forcedRedirect: string | null,
    previousUrl: string,
    decodedUrl: string | null
  ): string {
    // Priorité 1: Redirection forcée (action spécifique)
    if (forcedRedirect && this.isValidUrl(forcedRedirect)) {
      return forcedRedirect;
    }

    // Priorité 2: URL précédente stockée
    if (previousUrl && this.isValidUrl(previousUrl)) {
      return previousUrl;
    }

    // Priorité 3: URL de retour depuis queryParams
    if (decodedUrl && this.isValidUrl(decodedUrl)) {
      return decodedUrl;
    }

    // Fallback: Redirection par rôle
    return this.getDefaultUrlForRole(role);
  }

  private isValidUrl(url: string): boolean {
    return url.startsWith('/') && !url.includes('/login');
  }

  private getDefaultUrlForRole(role: string): string {
    switch (role) {
      case 'admin':
        return '/admin/dashboard';
      case 'tutor':
        return '/tutor/dashboard';
      default:
        return '/';
    }
  }
}
