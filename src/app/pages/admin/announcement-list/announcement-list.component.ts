import { Component } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import {
  PaginationMeta,
  PaginationUrls,
} from '../../../core/models/announcement/pagination';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { CommonModule } from '@angular/common';
import { SidebardComponent } from '../../../components/sidebard/sidebard.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-announcement-list',
  imports: [CommonModule, SidebardComponent],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.css',
})
export class AnnouncementListComponent {
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  articleId: number = -1;
  isModalOpen = false;
  isDeleteModalOpen = false;
  constructor(
    private announcementService: AnnouncementService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAnnouncements();
  }

  // Récupère les annonces depuis l'API
  getAnnouncements(page: number = 1) {
    //on fait appel au service avec le numero de page passé en parametre
    this.announcementService.getAnnouncements(undefined, page).subscribe({
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

  //methode utiliser lorque l'utilisateur clique un lien  de la pagination
  onPageChange(url: string | null | undefined): void {
    //si l'url n'est pas valide, on return rien
    if (typeof url !== 'string') return;

    //on extrait  le parametre page depuis l'url
    const pageParam = new URL(url).searchParams.get('page');

    //on converti la valeur page en nombre
    const page = pageParam ? +pageParam : 1;

    //on renvoit les annonces pour la page selectionné
    this.getAnnouncements(page);
  }

    openDeleteModal(id:number) {
    this.isDeleteModalOpen = true;
     this.articleId = id;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }
  
  
  confirmDelete() {
    this.deleteAnnouncement();
    this.closeDeleteModal();
  } 

  deleteAnnouncement() {
    this.announcementService.deleteAnnouncement(this.articleId).subscribe({
      next: () => {
        this.router.navigate(['/admin/announcement']);
      },
      error: (err) => {
        console.error('Erreur suppression annonce', err);
      },
    });
  }
}
