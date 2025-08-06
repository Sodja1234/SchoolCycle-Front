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

    this.editCategorieForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    photo:['',Validators.required]
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

editModalOpen: boolean = false;
editCategorieForm!: FormGroup;
categoryToEditId!: number;

openEditModal(id: number) {
  this.categoryToEditId = id;
  this.editModalOpen = true;

  // On récupère les infos de la catégorie pour pré-remplir le formulaire
  const category = this.categories.find(cat => cat.id === id);
  if (category) {
    this.editCategorieForm.patchValue({
      name: category.name,
      description: category.description
    });
  }
}

closeEditModal() {
  this.editModalOpen = false;
  this.categoryToEditId = null as any;
}

onEditSubmit() {
  this.isSubmited = true;
  if (this.editCategorieForm.invalid) {
    this.showToast = true;
    this.toastType = 'error';
    this.toastMessage = 'Veuillez remplir correctement le formulaire';
    setTimeout(() => this.showToast = false, 2000);
    return;
  }

  const formData = this.editCategorieForm.value;

  this.categorieService.updateCategorie(this.categoryToEditId, formData).subscribe({
    next: () => {
      this.isSubmited = false;
      this.showToast = true;
      this.toastType = 'success';
      this.toastMessage = 'Catégorie mise à jour avec succès';
      setTimeout(() => {
        this.showToast = false;
        this.editModalOpen = false;
        this.getCategories(); // Recharge les données
      }, 2000);
    },
    error: (err) => {
      this.isSubmited = false;
      console.error('Erreur lors de la mise à jour', err);
      this.toastType = 'error';
      this.toastMessage = 'Erreur lors de la mise à jour';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 2000);
    }
  });
}
}
