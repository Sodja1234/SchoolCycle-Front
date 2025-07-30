import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Profile } from '../../../core/models/profile/profile';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-profile-info',
  imports: [ReactiveFormsModule],
  templateUrl: './user-profile-info.component.html',
  styleUrls: ['./user-profile-info.component.css']
})
export class UserProfileInfoComponent implements OnInit {
  profileForm!: FormGroup;
  userProfile!: Profile | undefined;
  user!: AuthLoginResponse | null;
  avatarUrl: string | undefined;

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
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      console.warn('Formulaire invalide');
      return;
    }

    const formData = new FormData();
    const formValue = this.profileForm.value;

    formData.append('name', formValue.name || '');
    formData.append('telephone', formValue.telephone || '');
    formData.append('bio', formValue.bio || '');
    formData.append('adresse', formValue.adresse || '');
    formData.append('profession', formValue.profession || '');

    if (formValue.avatar) {
      formData.append('avatar', formValue.avatar);
    }

    // Appel à la méthode updateName
    this.profileService.updateName(formData).subscribe({
      next: () => {
        console.log('Profil mis à jour');
        this.getProfileTutor(); 
        this.router.navigate(['/profils']); // Redirection après succès
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour :', err);
      }
    });
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
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
}
