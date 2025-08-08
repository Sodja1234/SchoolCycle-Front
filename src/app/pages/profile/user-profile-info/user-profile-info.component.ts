import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { Profile } from '../../../core/models/profile/profile';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile-info',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile!: Profile | undefined;
  user!: AuthLoginResponse | null;
  avatarUrl: string | undefined;

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private userLocalService: UserLocalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      name: [''],
      telephone: [''],
      bio: [''],
      adresse: [''],
      profession: [''],
      avatar: [null]
    });

    this.user = this.userLocalService.getUser();
    this.getProfileTutor();
  }

  getProfileTutor(): void {
    this.profileService.getProfileTutor().subscribe({
      next: (response) => {
        const userData = response.data.user;
        this.profileForm.patchValue({
          name: userData.name,
          telephone: response.data.telephone,
          bio: response.data.bio,
          adresse: response.data.adresse,
          profession: response.data.profession,
          avatar: null
        });
        this.userProfile = response.data;
        this.avatarUrl = this.userProfile.avatar ?? undefined;
        console.log('Profil utilisateur récupéré:', this.userProfile);
      },
      error: (error) => {
        console.error('Erreur lors de la récupération du profil utilisateur: ', error);
        this.showToastMessage('Erreur lors du chargement du profil', 'error');
      }
    });
  }

  handleUpdate(): void {
    if (this.profileForm.invalid) {
      this.showToastMessage('Veuillez remplir correctement le formulaire', 'error');
      return;
    }

    const formValue = this.profileForm.value;

    // Vérifier si le nom a changé
    const isNameChanged = this.userProfile?.user?.name !== formValue.name;

    // Vérifier si d'autres champs ont changé ou avatar modifié
    const otherFieldsChanged =
      this.userProfile?.telephone !== formValue.telephone ||
      this.userProfile?.bio !== formValue.bio ||
      this.userProfile?.adresse !== formValue.adresse ||
      this.userProfile?.profession !== formValue.profession ||
      !!formValue.avatar;

    if (isNameChanged && !otherFieldsChanged) {
      // Mise à jour du nom uniquement
      this.updateNameOnly(formValue.name);
    } else {
      // Mise à jour complète du profil
      this.submitFullProfile(formValue);
    }
  }

  private updateNameOnly(name: string): void {
    if (!name) {
      this.showToastMessage('Le nom ne peut pas être vide', 'error');
      return;
    }

    const nameFormData = new FormData();
    nameFormData.append('name', name);

    this.profileService.updateName(nameFormData).subscribe({
      next: () => {
        this.showToastMessage('Nom mis à jour avec succès', 'success');
        this.getProfileTutor();
      },
      error: (err) => {
        this.showToastMessage('Erreur lors de la mise à jour du nom', 'error');
        console.error('Erreur updateName :', err);
      }
    });
  }

  private submitFullProfile(formValue: any): void {
    const profileFormData = new FormData();
    profileFormData.append('name', formValue.name || '');
    profileFormData.append('telephone', formValue.telephone || '');
    profileFormData.append('bio', formValue.bio || '');
    profileFormData.append('adresse', formValue.adresse || '');
    profileFormData.append('profession', formValue.profession || '');

    if (formValue.avatar) {
      profileFormData.append('avatar', formValue.avatar);
    }

    this.profileService.updateProfile(profileFormData).subscribe({
      next: (response) => {
        this.showToastMessage('Profil mis à jour avec succès', 'success');

        if (response) {
          this.profileForm.patchValue({
            name: response.user.name,
            telephone: response.telephone,
            bio: response.bio,
            adresse: response.adresse,
            profession: response.profession
          });
          this.avatarUrl = response.avatar || this.avatarUrl;
        }

        this.getProfileTutor();

        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/profils']);
        }, 2000);
      },
      error: (err) => {
        this.showToastMessage('Erreur lors de la mise à jour du profil', 'error');
        console.error('Erreur updateProfile :', err);
      }
    });
  }

  onFileChange(event: any): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileForm.patchValue({ avatar: file });
      this.profileForm.get('avatar')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          this.avatarUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }
  resetFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = '';
  }
  

  private showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    const duration = type === 'success' ? 2000 : 3000;
    setTimeout(() => (this.showToast = false), duration);
  }
}
