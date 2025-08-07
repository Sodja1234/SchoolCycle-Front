import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Router, RouterLink } from '@angular/router';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { UrlStorageService } from '../../../core/services/url/url-storage.service';

@Component({
  selector: 'app-announcement-list',
  standalone: true,
  imports: [AnnouncementCardComponent, RouterLink],
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent {
  announcements: Announcement[] = [];

  constructor(
    private announcementService: AnnouncementService,
    private userService: UserLocalService,
    private router: Router,
    private urlStorage: UrlStorageService
  ) {}

  ngOnInit() {
    this.getAnnouncements();
  }

  getAnnouncements(page: number = 1) {
    this.announcementService.getAnnouncements(undefined, page).subscribe({
      next: (res) => {
        this.announcements = res.data;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des annonces :", err);
      }
    });
  }

  handleCreateAnnouncement() {
    if (this.userService.isAuthenticated()) {
      this.router.navigate(['/create-announcement']);
    } else {
      // Stocker la redirection forcée
      this.urlStorage.setForcedRedirectUrl('/create-announcement');
      // Stocker aussi l'URL actuelle comme fallback
      this.urlStorage.setPreviousUrl(this.router.url);
      this.router.navigate(['/login']);
    }
  }
}
