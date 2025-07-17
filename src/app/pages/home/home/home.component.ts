import { Component } from '@angular/core';
import { AnnouncementListComponent } from '../../announcement/announcement-list/announcement-list.component';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
import {UserLocalService} from '../../../core/services/userlocal/userlocal.service';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { Category } from '../../../core/models/announcement/category';
@Component({
  selector: 'app-home',
  imports: [AnnouncementListComponent, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private userlocalService : UserLocalService, private categorieService: CategoriesService ) {
  }
  isConnected: boolean = false;
  name!: string | undefined;
  email!: string | undefined;
  token!: string;
  categories:Category[] = []


  ngOnInit() {
      initFlowbite();
    this.userConnected();
    this.getCategories()
  }

  userConnected(){
    const user = this.userlocalService.getUser();
    this.name = user?.name;
    this.email = user?.email;
    const token = user?.token;
    if (token){
      this.isConnected = true;
    }else {
      this.isConnected = false;
    }
  }

    // Récupère les catégories depuis l'API
  getCategories() {
    this.categorieService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data; // Stocke les catégories dans la propriété du composant
        console.log('Catégories:', this.categories); // Debug
      },
    });
  }

}

