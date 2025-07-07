import { Component } from '@angular/core';
import { Category } from '../../../core/models/announcement/category';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CategorieCardComponent } from '../../../components/categorie-card/categorie-card.component';
import { SidebardComponent } from '../../../components/sidebard/sidebard.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-categories-list',
  imports: [CommonModule, CategorieCardComponent, SidebardComponent,ReactiveFormsModule],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent {
  categories!: Category[];
  isSubmited: boolean = false;
  createModalOpen: boolean = false;
  createCategorieForm!: FormGroup;
  //affichage d'un pop up contenant un message d'erreur ou de success
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';

  constructor(
    private categorieService: CategoriesService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getCategories();
    this.createCategorieForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      photo: ['', Validators.required],
    });
  }

  // Récuperation des catégories depuis l'API via le service categorie
  getCategories() {
    this.categorieService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        console.log('Catégories:', this.categories); // Debug
      },
    });
  }

    openCreateModal() {
    this.createModalOpen = true;
  }
  closeCreateModal() {
    this.createModalOpen = false;
  }

  selectedFile!: File;
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Mise à jour du champ "photo" dans le formulaire
      this.createCategorieForm.patchValue({ photo: file });
      this.createCategorieForm.get('photo')?.updateValueAndValidity();
    }
  } 


  onSubmit() {
    this.isSubmited = true;
    if (this.createCategorieForm.invalid) {
      console.log('Formulaire invalide');

      //on active le toast avec message d'erreur
      this.showToast = true;
      this.toastType = 'error';
      this.toastMessage = 'Veuillez remplir correctement le formulaire';
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
      return;
    }

    const formData = new FormData();
    formData.append('name', this.createCategorieForm.get('name')?.value);
    formData.append(
      'description',
      this.createCategorieForm.get('description')?.value
    );
    formData.append('photo', this.selectedFile);

    this.categorieService.createCategorie(formData).subscribe({
      next: (res) => {
        this.isSubmited = false;
        this.showToast = true;
        this.toastType = 'success';
        this.toastMessage = 'Categorie creer avec success';
        setTimeout(() => {
          this.showToast = false;
          this.createModalOpen = false;
          window.location.reload();
        }, 2000);
        console.log('Catégorie créée', res);
        this.createCategorieForm.reset();
      },
      error: (err) => {
        //Si erreur : message d’erreur
        this.isSubmited = false;
        this.toastType = 'error';
        this.toastMessage = 'Une erreur est survenue.';
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
        console.error('Erreur lors de la création', err);
      },
    });
  }
}
