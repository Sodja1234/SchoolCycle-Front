import { Component} from '@angular/core';;
import { Category } from '../../../core/models/announcement/category';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { CategorieCardComponent } from "../../../components/categorie-card/categorie-card.component";

@Component({
  selector: 'app-categories-list',
  imports: [CommonModule, CategorieCardComponent],
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.css',
})
export class CategoriesListComponent {
  categories!: Category[];

  constructor( private categorieService: CategoriesService) {}

  ngOnInit() {
    this.getCategories();
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

}
