import { Component, NgModule } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import {
  PaginationMeta,
  PaginationUrls,
} from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-announcement-gallery',
  imports: [
    HeaderComponent,
    FooterComponent,
    AnnouncementCardComponent,
    CommonModule,
    FormsModule
  ],
  templateUrl: './announcement-gallery.component.html',
  styleUrl: './announcement-gallery.component.css',
})
export class AnnouncementGalleryComponent {
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  searchTerm: string = '';
  selectedOperations: string[] = [];
  selectedPriceRange: number[] = [];
  suggestions: Announcement[] = [];
  constructor(private announcementService: AnnouncementService) {}

  ngOnInit() {
    this.getAnnoucements();
  }

  // Récupère les annonces depuis l'API
  getAnnoucements(page: number = 1) {

    //on fait appel au service avec le numero de page passé en parametre
    this.announcementService.getAnnouncements(page, this.searchTerm, this.selectedOperations, this.selectedPriceRange).subscribe({
      next: (res) => {
        //on stocke les annonces recus dans la varible data de PaginatedAnnouncements !!
        this.announcements = res.data;

        //on stocke les annonces recus dans la varible meta de PaginatedAnnouncements !!
        this.paginationMeta = res.meta;

        //on stocke les annonces recus dans la varible links de PaginatedAnnouncements !!
        this.paginationUrls = res.links;

        //debug
        console.log('Annonces:', this.announcements);
        console.log('paginationMeta:', res.meta);
        console.log('paginationUrls:', res.links);
      },
      
      //cas d'erreur
      error: (err) => {
        console.error('Erreur lors du chargement des annonces :', err);
      },
    });
  }

  //methode pour ecouter les changements des saisies et proposer les sugestions
onSearchChange(term: string): void {
  if (term.length < 2) {
    this.suggestions = [];
    return;
  }

  this.announcementService.getAnnouncements(1, term).subscribe({
    next: (res) => {
      this.suggestions = res.data.slice(0, 5); // max 5 suggestions
    },
    error: (err) => {
      console.error('Erreur chargement suggestions :', err);
    },
  });
}

//pour selectionner les sugestions
onSelectSuggestion(item: Announcement): void {
  this.searchTerm = item.title;
  this.suggestions = [];
  this.getAnnoucements(); // relancer la recherche complète
}

  //methode utiliser lorque l'utilisateur clique un lien  de la pagination
  onPageChange(url: string | null | undefined): void {

    //si l'url n'est pas valide, on return rien
    if (typeof url !== 'string') return;

    //on extrait  le parametre page depuis l'url
    const pageParam = new URL(url).searchParams.get('page');

    //on converti la valeur page en nombre
    const page = pageParam ? +pageParam : 1;

    //on renvoit les annonces pour la page selectionné
    this.getAnnoucements(page);
  }
  
// gestion du submit du formulaire de recherche
onSearchSubmit(event: Event): void {

  //pour empercher de recharger la page
  event.preventDefault();

  //debug
  console.log(this.getAnnoucements)
  console.log(this.searchTerm)

  // recharge avec searchTerm
  this.getAnnoucements(); 
}
}
