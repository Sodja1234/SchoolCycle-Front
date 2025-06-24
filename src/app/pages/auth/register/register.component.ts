// Importation des modules Angular nécessaires
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,         // Permet de créer facilement des groupes de formulaires
  FormGroup,            // Représente un groupe de champs de formulaire
  Validators,           // Fournit des validateurs standards (ex: required, email)
  ValidationErrors,     // Type représentant des erreurs de validation
  AbstractControl,      // Représente un contrôle (champ) abstrait du formulaire
  ReactiveFormsModule   // Nécessaire pour les formulaires réactifs
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router'; // Pour la navigation
import {NgClass, NgIf} from '@angular/common'; // Pour afficher ou cacher des blocs HTML conditionnellement
import { AuthService } from '../../../core/services/auth/auth.service';
import {AuthRegisterData} from '../../../core/models/auth/auth';

// Déclaration du composant Angular
@Component({
  selector: 'app-register', // Nom utilisé dans le HTML pour appeler ce composant
  standalone: true,         // Composant autonome (sans module Angular déclaré autour)
  imports: [ReactiveFormsModule, NgIf, RouterLink], // Modules utilisés dans le template HTML
  templateUrl: './register.component.html', // Fichier HTML associé
  styleUrls: ['./register.component.css'],   // Fichier CSS associé
})
export class RegisterComponent implements OnInit {
  // Déclaration du formulaire de type FormGroup
  registerForm!: FormGroup;

  // Indique si le formulaire a été soumis (utile pour gérer les erreurs visuelles)
  submitted = false;

  // Messages d'erreur et de succès affichés dans le template
  errorMessage = '';
  successMessage = '';

  // Injection des services nécessaires dans le constructeur
  constructor(
    private fb: FormBuilder,       // Pour créer le formulaire
    private authService: AuthService, // Pour appeler l'API d'enregistrement
    private router: Router         // Pour naviguer après l'inscription
  ) {}

  // Initialisation du formulaire avec les validations
  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    console.log('Form Init')
    this.registerForm = this.fb.group(
      {
        name: ['', Validators.required],                      // Champ nom requis
        email: ['', [Validators.required, Validators.email]], // Champ email requis + format valide
        password: ['', [Validators.required, Validators.minLength(8)]],                 // Mot de passe requis
        password_confirmation: ['', Validators.required],               // Case à cocher (CGU) obligatoire
      },
      { validators: this.passwordsMatchValidator }            // Validation personnalisée (mot de passe = confirmation)
    );
  }

  // Validator personnalisé pour vérifier que le mot de passe et sa confirmation sont identiques
  passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  // Fonction appelée lors de la soumission du formulaire
  onSubmit(): void {
    console.log('clique surle formulaire')
    // Marque le formulaire comme soumis
    this.submitted = true;

    // Réinitialise les messages
    this.errorMessage = '';
    this.successMessage = '';

    this.registerForm.markAllAsTouched();
    // Si le formulaire est invalide, on arrête l’exécution
    if (this.registerForm.invalid) {
       this.errorMessage = 'Formulaire invalide | remplissez tous les champs'
      setTimeout(()=>{
        this.errorMessage = ''
      }, 2500)
      this.submitted = false;
      return
    }

    // Récupère les données saisies
    const data : AuthRegisterData = this.registerForm.value;

    // Appel au service d'enregistrement avec les données du formulaire
    this.authService.register(data).subscribe({
        // En cas de succès : affiche un message et réinitialise le formulaire
        next: () => {
          this.successMessage = 'Inscription réussie ! Un e-mail de confirmation a été envoyé.';
          this.registerForm.reset();
          setTimeout(()=>{
            this.successMessage ='';
          }, 2500)// Vide les champs
          this.submitted = false;               // Réinitialise les validations
        },
        // En cas d’erreur : affiche un message d’erreur personnalisé ou générique
        error: (error) => {
        // Si le backend a des erreurs de validation
        if (error.error?.errors) {
          const errors = error.error.errors;
          // Combine tous les messages en une seule chaîne (ex: pour email et password)
          this.errorMessage = Object.values(errors).flat().join(' | ');
        } else {
          this.errorMessage = error.error.message || 'Une erreur est survenue. Veuillez réessayer.';
        }

        setTimeout(() => {
          this.errorMessage = '';
        }, 3500);

        this.submitted = false;
      },

    });
  }
}
