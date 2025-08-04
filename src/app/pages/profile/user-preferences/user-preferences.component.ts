import { Component, OnInit } from '@angular/core';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { FormsModule } from '@angular/forms';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { CommonModule } from '@angular/common';
import { ProfileService } from '../../../core/services/profile/profile.service';
import { Category } from '../../../core/models/announcement/category';


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

  constructor(private categoriesService: CategoriesService,userLocalService:UserLocalService,private profileService: ProfileService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

   loadCategories(): void {
    this.profileService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        console.log('Catégories chargées :', this.categories);
      },
      error: (err) => console.error('Erreur chargement catégories :', err)
    });
  }

  loadFavoriteCategories(): void {
    this.profileService.getPreferences().subscribe({
      next: (cats) => {
        this.favoriteCategories = cats;
        console.log('Préférences chargées :', this.favoriteCategories);
      },
      error: (err) => console.error('Erreur chargement préférences :', err)
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

  removeCategory(cat: Category): void {
    this.favoriteCategories = this.favoriteCategories.filter(c => c.id !== cat.id);
  }

  onCancel(): void {
    this.favoriteCategories = [];
    this.selectedCategoryId = null;
  }

  onSave(): void {
    const categoryIds = this.favoriteCategories.map(c => c.id);
    console.log('Catégories préférées à enregistrer :', categoryIds);

    this.profileService.savePreferences(categoryIds).subscribe({
      next: () => alert('Préférences mises à jour avec succès'),
      error: () => alert('Erreur lors de la mise à jour des préférences')
    });
  }
}
