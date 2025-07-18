import { Component, ViewChild, OnDestroy } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import { Observable, Subscription } from 'rxjs';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { FavoriteStateService } from '../../../core/services/favorite/favorite.service';
import L from 'leaflet';
import { ChatPopUpsComponent } from "../../chat/chat-pop-ups/chat-pop-ups.component";

@Component({
  selector: 'app-announcement-single',
  standalone: true,
  imports: [RouterLink, HeaderComponent, FooterComponent, CommonModule, FormsModule, AnnouncementCardComponent, ChatPopUpsComponent],
  templateUrl: './announcement-single.component.html',
  styleUrls: ['./announcement-single.component.css'],
})
export class AnnouncementSingleComponent implements OnDestroy {
  @ViewChild('chatPopups') chatPopups!: ChatPopUpsComponent;
  @ViewChild('reportForm') reportForm!: NgForm;

  // Data
  announcement!: Announcement;
  similarAnnouncements: Announcement[] = [];
  currentImage: string = '';
  articleId: number = -1;
  currentUserId!: number;
  user: AuthLoginResponse | null = null;
  storageUrl = environment.storageUrl;

  // States
  isModalOpen = false;
  isDeleteModalOpen = false;
  isReportModalOpen = false;
  hasAlreadyReported = false;
  isReportSent = false;
  toggleShareMenu = false;

  // Favorites
  isFavorite$!: Observable<boolean>;
  showSuccessMessage = false;
  successMessageFavorite = '';

  // Report form
  customMotif: string = '';
  motif: string = '';
  detail: string = '';

  // Simple Toast
  showSimpleToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  // Map
  map: L.Map | undefined;

  // Timeouts
  private messageTimeout: any;
  private toastTimeout: any;
  private routeSub!: Subscription;


  constructor(
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router,
    private favoriteState: FavoriteStateService,
    private userLocalService: UserLocalService
  ) {}

  ngOnInit() {
    this.user = this.userLocalService.getUser();
    this.currentUserId = this.user?.id || -1;

    this.routeSub = this.route.params.subscribe(params => {
      this.articleId = +params['id'];
      this.loadAnnouncementData();
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    if (this.map) this.map.remove();
    clearTimeout(this.messageTimeout);
    clearTimeout(this.toastTimeout);
  }

  private loadAnnouncementData() {
    this.getSingleAnnouncement();
    this.getSimilarAnnouncement();
    this.checkIfAlreadyReported();
    this.isFavorite$ = this.favoriteState.isFavorite(this.articleId);
  }

  // Simple Toast Methods
  showToast(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    this.toastMessage = message;
    this.toastType = type;
    this.showSimpleToast = true;

    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.hideToast();
    }, duration);
  }

  hideToast() {
    this.showSimpleToast = false;
  }

  get toastClass() {
    return this.toastType === 'success'
      ? 'fixed top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50'
      : 'fixed top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
  }

  // Announcement Methods
  getSingleAnnouncement() {
    this.announcementService.getAnnoucement(this.articleId).subscribe({
      next: (res) => {
        this.announcement = res;
        this.currentImage = this.announcement.photos?.[0]?.url || '';

        if (this.announcement.exchange_location_address) {
          this.geocodeAddress(this.announcement.exchange_location_address);
        }
      },
      error: (err) => {
        this.showToast("Erreur lors du chargement de l'annonce", 'error');
        console.error("Erreur chargement annonce :", err);
      }
    });
  }

  getSimilarAnnouncement() {
    this.announcementService.getSimilarAnnouncements(this.articleId).subscribe({
      next: (res) => this.similarAnnouncements = res.data,
      error: (err) => console.error('Erreur annonces similaires', err)
    });
  }

  changeMainImage(url: string) {
    this.currentImage = url;
  }

  // Report Methods
  openReportModal() {
    this.isReportModalOpen = true;
    this.checkIfAlreadyReported();
  }

  closeReportModal() {
    this.isReportModalOpen = false;
    this.reportForm?.resetForm();
  }

  submitReport() {
    const finalMotif = this.motif === 'other' ? this.customMotif : this.motif;

    const payload = {
      user_id: this.currentUserId,
      announcement_id: this.articleId,
      motif: finalMotif, // Utilisez finalMotif ici
      detail: this.detail,
    };

    this.announcementService.reportAnnouncement(payload).subscribe({
      next: () => {
        this.hasAlreadyReported = true;
        localStorage.setItem(`report_${this.articleId}_by_${this.currentUserId}`, 'true');
        this.showToast('Annonce signalée avec succès');
        this.closeReportModal();
      },
      error: (err) => {
        this.showToast('Erreur lors du signalement', 'error');
        console.error("Erreur signalement :", err);
      }
    });
  }

  checkIfAlreadyReported() {
    this.hasAlreadyReported = localStorage.getItem(`report_${this.articleId}_by_${this.currentUserId}`) === 'true';
  }

  // Map Methods
  geocodeAddress(address: string): void {
    if (!address.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (data?.length) {
          this.initMap(parseFloat(data[0].lat), parseFloat(data[0].lon));
        }
      })
      .catch(err => console.error('Erreur géolocalisation :', err));
  }

  initMap(lat: number, lon: number): void {
    if (this.map) this.map.remove();

    this.map = L.map('map').setView([lat, lon], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    L.marker([lat, lon])
      .addTo(this.map)
      .bindPopup('Lieu de rendez-vous')
      .openPopup();

    setTimeout(() => this.map?.invalidateSize(), 100);
  }

  // Favorite Methods
  toggleFavorite() {
    this.announcementService.toggleFavorite(this.announcement.id).subscribe({
      next: (res: any) => {
        this.successMessageFavorite = res.message;
        this.showSuccessMessage = true;
        this.messageTimeout = setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (err) => {
        this.showToast('Erreur lors de la mise à jour', 'error');
        console.error('Erreur favori:', err);
      }
    });
  }

  // Share Methods
  get shareUrl(): string {
    return `${window.location.origin}/single-announcement/${this.articleId}`;
  }

  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }

  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
    this.showToast('Lien copié dans le presse-papier');
  }

  // Auth Methods
  get isAuthor(): boolean {
    return this.announcement?.created_by?.id === this.currentUserId;
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  get isAuthenticated(): boolean {
    return !!this.userLocalService.getUser();
  }

  get isModified(): boolean {
    if (!this.announcement?.created_at_raw || !this.announcement?.updated_at_raw) return false;
    return new Date(this.announcement.created_at_raw).getTime() !==
      new Date(this.announcement.updated_at_raw).getTime();
  }

  // Chat Methods
  openChatPopUp() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.chatPopups.openPopUpOrRedirect();
  }

  // Delete Methods
  openDeleteModal() { this.isDeleteModalOpen = true; }
  closeDeleteModal() { this.isDeleteModalOpen = false; }

  confirmDelete() {
    this.announcementService.deleteAnnouncement(this.articleId).subscribe({
      next: () => this.router.navigate(['/announcement-gallery']),
      error: (err) => {
        this.showToast('Erreur lors de la suppression', 'error');
        console.error('Erreur suppression:', err);
      }
    });
  }
  // Modal Methods
  toggleModal() { this.isModalOpen = !this.isModalOpen; }
  closeModal() { this.isModalOpen = false; }

  // Navigation Methods
  redirectToLogin() {
    this.router.navigate(['/login'], {
      queryParams: { returnUrl: this.router.url }
    });
    this.closeReportModal();
  }
}
