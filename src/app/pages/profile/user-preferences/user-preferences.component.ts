import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { FormsModule } from '@angular/forms';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-user-preferences',
  imports: [FormsModule,CommonModule],
  templateUrl: './user-preferences.component.html',
  styleUrl: './user-preferences.component.css'
})
export class UserPreferencesComponent implements OnInit{
  
  categories: any[] = [];
  selectedCategoryId: string | null = null;

  // la liste de catégories favorites
  favoriteCategories: any[] = [];

  constructor(private categoriesService: CategoriesService,userLocalService:UserLocalService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoriesService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        console.log('Catégories chargées :', this.categories);
      },
      error: (err) => {
        console.error('Erreur chargement catégories :', err);
      }
    });
  }

  onAddCategory(): void {
    if (!this.selectedCategoryId) {
      alert('Veuillez sélectionner une catégorie à ajouter.');
      return;
    }

    const id = Number(this.selectedCategoryId);
    if (isNaN(id)) return;

    const category = this.categories.find(c => c.id === id);
    if (category && !this.favoriteCategories.some(c => c.id === id)) {
      this.favoriteCategories.push(category);
    }
  }

  removeCategory(cat: any): void {
    this.favoriteCategories = this.favoriteCategories.filter(c => c.id !== cat.id);
  }

  // le bouton Annuler 
  onCancel(): void {
    this.favoriteCategories = [];
    this.selectedCategoryId = null;
  }

  // Le bouton Enregistrer
  onSave(): void {
    console.log('Catégories préférées à enregistrer : ', this.favoriteCategories);
    
  }
}