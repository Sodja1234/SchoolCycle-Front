import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {NgClass, NgIf} from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule, NgIf, NgClass],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
  // Déclaration du formulaire de type FormGroup
  forgotPasswordForm!: FormGroup;

  // Indique si le formulaire a été soumis (utile pour gérer les erreurs visuelles)
  submitted = false;

  // Messages d'erreur et de succès affichés dans le template
  errorMessage = '';
  successMessage = '';

  // Injection des services nécessaires dans le constructeur
  constructor(
    private fb: FormBuilder, // Pour créer le formulaire
    private authService: AuthService, // Pour appeler l'API d'enregistrement
    private router: Router // Pour naviguer après l'inscription
  ) {}

  // Initialisation du formulaire avec les validations
  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Fonction appelée lors de la soumission du formulaire
  onSubmit(): void {
    // Marque le formulaire comme soumis
    this.submitted = true;

    // Réinitialise les messages
    this.errorMessage = '';
    this.successMessage = '';

    // Si le formulaire est invalide, on arrête l’exécution
    if (this.forgotPasswordForm.invalid) return;

    // Récupère la donnée saisie
    const formData = this.forgotPasswordForm.value;

    // Appel au service de dmenade u mot de passe oublié avec la donnée du formulaire
    this.authService
      .forgotPassword({
        email: formData.email,
      })
      .subscribe({
        // En cas de succès : affiche un message et réinitialise le formulaire
        next: () => {
          this.successMessage ='Un email a été envoyé, veuillez consulter votre boite mail.';
          this.forgotPasswordForm.reset();
          setTimeout(()=>{
            this.successMessage = ''
          }, 2500)
          this.submitted = false; // Réinitialise les validations
        },

        // En cas d’erreur : affiche un message d’erreur personnalisé ou générique
        error: (error) => {
          this.errorMessage = error.error.message || error.error.status?.toString() || ' Une erreur est survenue. Veuillez réessayer.';
          setTimeout(()=>{
            this.errorMessage = ''
          }, 2500)
          this.submitted = false;
        },
      });
  }
}
