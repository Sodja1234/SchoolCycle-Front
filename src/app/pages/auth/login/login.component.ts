// Import des modules nécessaires à Angular, à la navigation, aux formulaires réactifs et aux validations
import { Component } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { NgIf } from '@angular/common';
// Service d'authentification qui gère l'appel au backend
import {AuthService} from '../../../core/services/auth/auth.service';

// Modèles représentant les données envoyées au backend (login) et reçues (response)
import {AuthLoginData, AuthLoginResponse} from '../../../core/models/auth/auth';
import {UserLocalService} from '../../../core/services/userlocal/userlocal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [RouterLink, ReactiveFormsModule, NgIf], // Modules nécessaires au template
})
export class LoginComponent {

  loginForm: FormGroup;         // Formulaire de login
  loading = false;              // Indique si une requête est en cours
  successMessage = '';          // Message affiché en cas de succès
  errorMessage = '';            // Message affiché en cas d'erreur

  // Constructeur qui injecte :
  // - FormBuilder : pour construire le formulaire réactif
  // - AuthService : pour interagir avec le backend
  // - Router : pour naviguer après connexion
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userLocalService : UserLocalService,
    private router: Router,
    private route : ActivatedRoute
  ) {
    // Initialisation du formulaire avec deux champs : email et mot de passe
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Méthode appelée à la soumission du formulaire
  onSubmit(): void {
    if (this.loginForm.invalid) return; // Si le formulaire est invalide, on arrête

    this.loading = true;      // Affichage d’un indicateur de chargement
    this.errorMessage = '';   // Réinitialisation des messages d’erreur

    const data: AuthLoginData = this.loginForm.value; // Récupération
    // Appel du service d’authentification
    this.authService.login(data).subscribe({
      next: (response: AuthLoginResponse) => {
        this.userLocalService.stockerUserLocal(response);
        console.log(response)

        this.successMessage = 'Connexion réussie. Redirection en cours...';
        const role = response.role;

        console.log('Role reçu :', role);

        setTimeout(() => {
          this.successMessage = '';

          try {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'];
            const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;

            switch (role) {
              case 'admin':
                this.router.navigate(['/admin/dashboard']);
                break;
              case 'tutor':
                // Vérifie que l'URL est valide et interne à l'application
                if (decodedUrl && decodedUrl.startsWith('/')) {
                  this.router.navigateByUrl(decodedUrl).catch(() => this.router.navigate(['/']));
                } else {
                  this.router.navigate(['/']);
                }
                break;
              default:
                this.router.navigate(['/']);
            }
          } catch (e) {
            console.error('Erreur lors de la redirection:', e);
            this.router.navigate(['/']);
          }
        }, 2500);
      },
      error: (err) => {
        // En cas d’échec : on affiche un message d’erreur
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrecte.';
        this.loading = false; // Arrêt de l’indicateur de chargement
        setTimeout(()=>{
          this.errorMessage = ''
        }, 2500);
        this.loading = false;
      },
    });
  }
}
