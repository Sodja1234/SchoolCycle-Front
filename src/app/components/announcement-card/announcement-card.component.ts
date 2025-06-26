import { Component, inject, Input } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Announcement } from '../../core/models/announcement/announcement';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserLocalService } from '../../core/services/userlocal/userlocal.service';
import { AuthLoginResponse } from '../../core/models/auth/auth';
import { FavoriteStateService } from '../../core/services/favorite/favorite.service';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-announcement-card',
  imports: [RouterModule,CommonModule ],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.css',
})
export class AnnouncementCardComponent {

  announcementId!: number;
  isFavorite$ : Observable<boolean> | undefined; // Observable pour l'état du favori
  errorMessage: string = '';
  successMessage: string = '';
  user : AuthLoginResponse | null = null;
  favoriteMessage: string = '';
  showSucessMessage: boolean = false;
  messageTimeout: any;
  storageUrl = environment.storageUrl;

  constructor(private announcementService: AnnouncementService, public userLocalService : UserLocalService, private favoriteState: FavoriteStateService) {}
  @Input() announcement!: Announcement;

  ngOnInit() {
    this.user = this.userLocalService.getUser();
    this.isFavorite$ = this.favoriteState.isFavorite(this.announcement.id);

    // Vérifiez l'état initial
    this.announcementService.checkFavorite(this.announcement.id).subscribe();
    console.log('Photo recuperer', this.announcement.photos[0]?.url);
  }

   toggleFavorite() {
    this.announcementService.toggleFavorite(this.announcement.id).subscribe({
      next: (res: any) => {
        // Affiche le message de succès
        this.successMessage = res.message;
        this.showSucessMessage = true;

        // Cache le message après 3 secondes
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
          this.showSucessMessage = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors du toggle favorite:', err);
      }
    });
  }

}
