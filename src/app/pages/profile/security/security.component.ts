import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { CommonModule } from '@angular/common';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css'] // Pluriel ici
})
export class SecurityComponent {
  passwordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userLocalService: UserLocalService
  ) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      password_confirmation: ['', Validators.required]
    });
  }

  onSubmit(): void {
    console.log("onSubmit déclenché");

    if (this.passwordForm.invalid) {
      return;
    }

    const { old_password, new_password, password_confirmation } = this.passwordForm.value;

    if (new_password !== password_confirmation) {
      alert('Le nouveau mot de passe ne correspond pas');
      return;
    }

    console.log('Appel du updateUserPassword avec data:', { old_password, new_password, password_confirmation });

    this.profileService.updateUserPassword({ old_password, new_password, password_confirmation }).subscribe({
      next: () => {
        alert('Mot de passe mis à jour avec succès');
        this.passwordForm.reset();
      },
      error: (err) => {
        console.error('Erreur de mise à jour:', err);
        alert('Échec de la mise à jour du mot de passe');
      }
    });
  }

  onCancel(): void {
    this.passwordForm.reset();
  }
}
