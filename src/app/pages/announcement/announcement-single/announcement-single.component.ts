import { Component } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import { Observable } from 'rxjs';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { FavoriteStateService } from '../../../core/services/favorite/favorite.service';
import L from 'leaflet';

@Component({
  selector: 'app-announcement-single',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, CommonModule, FormsModule, AnnouncementCardComponent],
  templateUrl: './announcement-single.component.html',
  styleUrl: './announcement-single.component.css',
})
export class AnnouncementSingleComponent {
  constructor(
    private annoncementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteState: FavoriteStateService,
    private userLocalService: UserLocalService
  ) {}

  storageUrl = environment.storageUrl;
  currentImage: string = '';
  announcement!: Announcement;
  similarAnnouncements: Announcement[] = [];
  articleId: number = -1;
  currentUserId!: number;

  isModalOpen = false;
  isDeleteModalOpen = false;
  isReportModalOpen = false;
  //affichage d'un pop up contenant un message d'erreur ou de success
  showToastReport = false;
  toastReportType: 'success' | 'error' = 'success';
  toastReportMessage = '';
  isFavorite$!: Observable<boolean>;
  user: AuthLoginResponse | null = null;

  showSuccessMessage = false;
  messageTimeout: any;
  successMessageFavorite: string = '';
  toggleShareMenu = false;
  successMessage: string = '';

  motif: string = '';
  detail: string = '';
  isReportSent = false;
  hasAlreadyReported = false;
  reported!:string

  map: L.Map | undefined;

  ngOnInit() {
    this.user = this.userLocalService.getUser();
    const user = JSON.parse(localStorage.getItem('userSession')!);
    this.currentUserId = user?.id;

    this.route.params.subscribe((params) => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
      this.checkIfAlreadyReported();
      this.isFavorite$ = this.favoriteState.isFavorite(this.articleId);
    });
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  openReportModal() {
    this.isReportModalOpen = true;
  }

  closeReportModal() {
    this.isReportModalOpen = false;
  }

  confirmDelete() {
    this.deleteAnnouncement();
    this.closeDeleteModal();
  }

  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  geocodeAddress(address: string): void {
    if (!address.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          this.initMap(lat, lon);
        } else {
          console.error('Adresse introuvable.');
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la géolocalisation :', err);
      });
  }

  initMap(lat: number, lon: number): void {
    if (this.map) {
      this.map.remove(); // Supprime l'ancienne instance
    }

    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map)
      .bindPopup('Lieu de rendez-vous')
      .openPopup();

    // Fix affichage éventuel
    setTimeout(() => {
      this.map?.invalidateSize();
    }, 100);
  }

  getSingleAnnouncement() {
    this.annoncementService.getAnnoucement(this.articleId).subscribe({
      next: (res) => {
        this.announcement = res;
        this.currentUserId = +localStorage.getItem('id')!;

        if (this.announcement.photos?.length > 0) {
          this.currentImage = this.announcement.photos[0].url;
        }

        if (this.announcement.exchange_location_address) {
          this.geocodeAddress(this.announcement.exchange_location_address);
        }
      },
      error: (err) => {
        console.error("Erreur chargement annonce :", err);
      },
    });
  }

  getSimilarAnnouncement() {
    this.annoncementService.getSimilarAnnouncements(this.articleId).subscribe(
      (res) => {
        this.similarAnnouncements = res.data;
      },
      (error) => {
        console.error('Erreur de récupération des annonces similaires', error);
      }
    );
  }

  deleteAnnouncement() {
    this.annoncementService.deleteAnnouncement(this.articleId).subscribe({
      next: () => {
        this.router.navigate(['/announcement-gallery']);
      },
      error: (err) => {
        console.error('Erreur suppression annonce', err);
      },
    });
  }

  changeMainImage(url: string) {
    this.currentImage = url;
  }

  get isAuthor(): boolean {
    const userId = JSON.parse(localStorage.getItem('userSession')!);
    this.currentUserId = userId?.id;
    return this.announcement?.created_by?.id === this.currentUserId;
  }

  get isModified(): boolean {
    if (!this.announcement?.created_at_raw || !this.announcement?.updated_at_raw) return false;

    return new Date(this.announcement.created_at_raw).getTime() !== new Date(this.announcement.updated_at_raw).getTime();
  }

  submitReport() {
    const payload = {
      user_id: this.currentUserId,
      announcement_id: this.articleId,
      motif: this.motif,
      detail: this.detail,
    };

    this.annoncementService.reportAnnouncement(payload).subscribe({
      next: () => {
        this.isReportSent = true;
        const reportKey = `report_${this.articleId}_by_${this.currentUserId}`;
        localStorage.setItem(reportKey, 'true');
        //this.hasAlreadyReported = true;
        this.toastReportType = 'success';
        this.showToastReport = true
        this.toastReportMessage = "Annonce signalée";
        setTimeout(() => {
        this.showToastReport = false;
        window.location.reload()
      }, 2000);
        this.motif = '';
        this.detail = '';
      },
      error: (err) => {
        console.error("Erreur lors du signalement :", err);
        this.toastReportType = 'error';
        this.showToastReport = true
        this.toastReportMessage = "Remplissez correctement le formulaire";
        setTimeout(() => {
        this.showToastReport = false;
      }, 2000);
      },
    });
  }

  checkIfAlreadyReported() {
    const reportKey = `report_${this.articleId}_by_${this.currentUserId}`;
    this.hasAlreadyReported = localStorage.getItem(reportKey) === 'true';
  }

  get shareUrl(): string {
    return `${window.location.origin}/single-announcement/${this.articleId}`;
  }

  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
    this.successMessage = 'Lien copié avec succès';
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }

  toggleFavorite() {
    this.annoncementService.toggleFavorite(this.announcement.id).subscribe({
      next: (res: any) => {
        this.successMessageFavorite = res.message;
        this.showSuccessMessage = true;

        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors du toggle favorite:', err);
      },
    });
  }
}
