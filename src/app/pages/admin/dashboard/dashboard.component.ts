import { Component, numberAttribute } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import {
  PaginationMeta,
  PaginationUrls,
} from '../../../core/models/announcement/pagination';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../../core/models/user';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  user!: AuthLoginResponse | null;
  articleId: number = -1;

  suggestions: Announcement[] = [];
  constructor(
    private announcementService: AnnouncementService,
    private authservice: UserLocalService,
  ) {}

  ngOnInit() {
    this.getAnnoucements();
    this.user = this.authservice.getUser();
    console.log('user', this.user);
  }

  // Récupère les annonces depuis l'API
  getAnnoucements(page: number = 1) {
    //on fait appel au service avec le numero de page passé en parametre
    this.announcementService
      .getAnnouncements(
        page,
      )
      .subscribe({
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
    this.getAnnoucements(page);
  }
}
