import { Component, Input } from '@angular/core';
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement',
  imports: [CommonModule],
  templateUrl: './announcement.component.html',
  styleUrl: './announcement.component.css'
})
export class AnnouncementComponent {
  @Input() filterType!: string
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  articleId: number = -1;
  isModalOpen = false;
  isDeleteModalOpen = false;
  selectedTab: string = 'tab1';
  tabIndex: number = 0;

  constructor(
    private announcementService: AnnouncementService,
  ) {}

  ngOnInit() {
    this.getAnnouncements();
  }

  // Récupère les annonces depuis l'API
  getAnnouncements(page: number = 1) {
    let filters: any={}
      if (this.filterType === 'disable') {
        filters.deleted_at = true;
    }

    //on fait appel au service avec le numero de page passé en parametre
    this.announcementService.getAnnouncements(undefined, page,filters).subscribe({
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
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur suppression annonce', err);
      },
    });
  }
}
