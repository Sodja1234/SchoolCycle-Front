import { Component } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from "../../../components/announcement-card/announcement-card.component";
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-gallery',
  imports: [HeaderComponent, FooterComponent, AnnouncementCardComponent, CommonModule],
  templateUrl: './announcement-gallery.component.html',
  styleUrl: './announcement-gallery.component.css'
})
export class AnnouncementGalleryComponent {
  announcements! : Announcement[]
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  constructor(private announcementService:AnnouncementService){}
  

  ngOnInit(){
    this.getAnnoucements();
  }

   
  // Récupère les annonces depuis l'API
  getAnnoucements(page : number = 1) {
    //on fait appel au service avec le numero de page passé en parametre
    this.announcementService.getAnnouncements(page).subscribe({
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
      error:(err) => {
        console.error("Erreur lors du chargement des annonces :", err);
      }
    });
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
}
