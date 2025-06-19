import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {NgClass, NgIf} from '@angular/common';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-new-password',
  imports: [ReactiveFormsModule, NgIf, RouterLink, NgClass],
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit {
  // Propriétés utilisées dans le composant
  token!: string; // Jeton de réinitialisation de mot de passe
  email!: string; // Email de l’utilisateur
  resetForm!: FormGroup; // Formulaire de réinitialisation
  isSubmited = false; // Indique si le formulaire a été soumis
  errorMessage = ''; // Message d’erreur à afficher
  successMessage = ''; // Message de succès à afficher

  // Injection des services nécessaires
  constructor(
    private route: ActivatedRoute, // Pour récupérer les paramètres de l’URL
    private fb: FormBuilder,       // Pour construire le formulaire
    private router: Router,        // Pour rediriger après succès
    private authservice: AuthService, // Service d'authentification pour appeler l’API
  ) {}

  // Méthode appelée à l'initialisation du composant
  ngOnInit() {
    this.tokenData(); // Récupère le token depuis les paramètres de route
    this.emailData(); // Récupère l’email depuis les query params

    // Création du formulaire avec validation
    this.resetForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(8)]], // Mot de passe obligatoire avec min 8 caractères
        password_confirmation: ['', [Validators.required]] // Confirmation obligatoire
      },
      {
        validators: this.passwordsMatchValidator // Validateur personnalisé : mots de passe doivent correspondre
      }
    );
  }

  // Validateur personnalisé : vérifie que les deux mots de passe sont identiques
  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  // Récupération du token depuis les paramètres de route (`/reset-password/:token`)
  tokenData() {
    this.route.paramMap.subscribe(params => {
      this.token = params.get('token')!;
    });
  }

  // Récupération de l’email depuis les paramètres de requête (`?email=user@example.com`)
  emailData() {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email')!;
    });
  }

  // Fonction appelée à la soumission du formulaire
  onSubmit() {
    this.isSubmited = true; // Indique que le formulaire est soumis
    this.successMessage = "";
    this.errorMessage = "";

    // Ne rien faire si le formulaire est invalide
    if (this.resetForm.invalid) return;

    // Récupération des données du formulaire
    const formData = this.resetForm.value;

    // Appel du service pour envoyer la requête de réinitialisation
    this.authservice.resetPassword({
      token: this.token,
      email: this.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    }).subscribe({
      // En cas de succès
      next: () => {
        this.successMessage = 'Mot de passe restauré avec succès';
        // Redirection vers la page de login après 2 secondes
        setTimeout(() => {
          this.router.navigate(['login']);
          this.successMessage = ''
        }, 2500);
        // Réinitialisation du formulaire
        this.resetForm.reset();
        this.isSubmited = false;
      },
      // En cas d’erreur
      error: (error) => {
        this.errorMessage = error.error.message || error.error.status?.toString() || 'Une erreur est survenue';
        setTimeout(()=> {
          this.errorMessage = ''
        }, 2500)
        this.isSubmited = false;
      }
    });
  }
}
