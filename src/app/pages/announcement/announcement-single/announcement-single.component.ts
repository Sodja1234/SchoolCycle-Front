import { Component } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {AnnouncementCardComponent} from '../../../components/announcement-card/announcement-card.component';
import { Observable } from 'rxjs';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { FavoriteStateService } from '../../../core/services/favorite/favorite.service';
import L from 'leaflet';

@Component({
  selector: 'app-announcement-single',
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
  announcementData!: Announcement;
  currentUserId!: number;


  //modals
  isModalOpen = false;
  isDeleteModalOpen = false;
  isReportModalOpen: boolean = false;
  isFavorite$!: Observable<boolean>;
  user : AuthLoginResponse | null = null;
  showSuccessMessage: boolean = false;
  messageTimeout: any;


  // Message de succès pour l'ajout/suppression des favoris
  successMessageFavorite: string = '';

  //menu de partage
  toggleShareMenu = false;
  successMessage:string = ''

  //  Variables pour le formulaire de signalement
  motif: string = '';
  detail: string = '';
  isReportSent: boolean = false;
  hasAlreadyReported: boolean = false;

  // Carte
  map: L.Map | undefined;

  ngOnInit() {
    // Récupère l'ID de l'utilisateur connecté
    this.user = this.userLocalService.getUser();
    const user = JSON.parse(localStorage.getItem('userSession')!);
    this.currentUserId = user?.id;
    //recharger la page en dunction du nouvel id
    this.route.params.subscribe((params) => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
      this.checkIfAlreadyReported();
      this.isFavorite$ = this.favoriteState.isFavorite(this.articleId);
      console.log("la valeur de user : ", user);
    });
  }

  //ouvrir le modal qui a confimer ou non la suppressiion
  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

  //ferme le modal
  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  // Gestion Modal Signalement
  openReportModal() {
    this.isReportModalOpen = true;
  }
  closeReportModal() {
    this.isReportModalOpen = false;
  }

  //confirme la suppression
  confirmDelete() {
    this.deleteAnnouncement();
    this.closeDeleteModal();
  }
  toggleModal() {
    this.isModalOpen = !this.isModalOpen;
  }

  //ferme le modal
  closeModal() {
    this.isModalOpen = false;
  }

  //Geocoder appelé uniquement après récupération de l'annonce
  geocodeAddress(address: string): void {
    if (!address.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length) {
          const lat = data[0].lat;
          const lon = data[0].lon;
          this.initMap(+lat, +lon);
        } else {
          console.error('Adresse introuvable.');
        }
      })
      .catch((err) => {
        console.error('Erreur lors de la géolocalisation :', err);
      });
  }
  //initialisation de la la carte
  initMap(lat: number, lon: number): void {
    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([lat, lon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    L.marker([lat, lon]).addTo(this.map)
      .bindPopup('Lieu de rendez-vous')
      .openPopup();
  }
  //recuperation des annonces
  getSingleAnnouncement() {
    this.annoncementService.getAnnoucement(this.articleId).subscribe({
      next: (res) => {
        this.announcement = res;
        this.currentUserId = +localStorage.getItem('id')!;
        if (this.announcement.photos?.length > 0) {
          this.currentImage = this.announcement.photos[0].url;
        }

        // 🔥 Appel carte ici !
        if (this.announcement.exchange_location_address) {
          this.geocodeAddress(this.announcement.exchange_location_address);
        }
      },
      error: (err) => {
        console.error("Erreur chargement annonce :", err);
      },
    });
  }


  //function pour recuperr les articles similaires
  getSimilarAnnouncement() {
    this.annoncementService.getSimilarAnnouncements(this.articleId).subscribe(
      (res) => {
        this.similarAnnouncements = res.data;
        console.log('annonces similaires', this.similarAnnouncements);
      },
      (error) => {
        console.error('Erreur de récupération des annonces similaires', error);
      }
    );
  }


  //function pour supprimer une annonce
  deleteAnnouncement() {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));
    this.annoncementService.deleteAnnouncement(this.articleId).subscribe({
      next: (res) => {
        console.log('Announcement delete avec success');
        this.router.navigate(['/announcement-gallery']);
      },

      error: (err) => {
        console.log('Une erreur est survenue', err);
      },
    });
  }


  //function pour recuperr changer la photo principale de l'annonce
  changeMainImage(url: string) {
    this.currentImage = url;
  }


  //Vérifie si le user connecté est l'auteur
  get isAuthor(): boolean {
    const userId = JSON.parse(localStorage.getItem('userSession')!);
                this.currentUserId = userId?.id;
    return this.announcement?.created_by?.id === this.currentUserId;
  }


  //verifie si une annonce a eté modifier ou non
  get isModified(): boolean {
    if (
      !this.announcement?.created_at_raw ||
      !this.announcement?.updated_at_raw
    )
      return false;

    const created = new Date(this.announcement.created_at_raw).getTime();
    const updated = new Date(this.announcement.updated_at_raw).getTime();

    return created !== updated;
  }
  // Soumet le signalement
  submitReport() {
  if (!this.motif.trim()) {
    alert("Le motif est requis.");
    return;
  }

  const payload = {
    user_id: this.currentUserId,
    announcement_id: this.articleId,
    motif: this.motif,
    detail: this.detail,
  };

  this.annoncementService.reportAnnouncement(payload).subscribe({
    next: (res) => {
      this.isReportSent = true;
      const reportKey = `report_${this.articleId}_by_${this.currentUserId}`;
      localStorage.setItem(reportKey, 'true');
      this.hasAlreadyReported = true;
      alert('Votre signalement a été envoyé.');
      // Réinitialise les champs
      this.motif = '';
      this.detail = '';
    },
    error: (err) => {
      console.error("Erreur lors de l'envoi du signalement :", err);
      alert('Erreur lors de l\'envoi du signalement.');
    },
  });
}
  // Vérifie si l'utilisateur a déjà signalé cette annonce
  checkIfAlreadyReported() {
  const reportKey = `report_${this.articleId}_by_${this.currentUserId}`;
  this.hasAlreadyReported = localStorage.getItem(reportKey) === 'true';
}
  //Implementation partage
  get shareUrl(): string {
    //window.location.origin donne : http://localhost:4200 en local et https://urlEnLigne.com en production
    return `${window.location.origin}/single-announcement/${this.articleId}`;
  }
  //encodeURIComponent() transforme ces caractères spéciaux en un format compréhensible pour un navigateur.
  get encodedShareUrl(): string {
    return encodeURIComponent(this.shareUrl);
  }
  //copier le lien de partage
  copyLink() {
    navigator.clipboard.writeText(this.shareUrl);
    this.successMessage = 'Lien copié avec successe';
    setTimeout(() => {
      this.successMessage = '';
    }, 2000);
  }
  //function pour l'ajout en favoris
  toggleFavorite(){
    this.annoncementService.toggleFavorite(this.announcement.id).subscribe({
      next: (res: any) => {
        // Affiche le message de succès
        this.successMessageFavorite = res.message;
        this.showSuccessMessage = true;

        // Cache le message après 3 secondes
        clearTimeout(this.messageTimeout);
        this.messageTimeout = setTimeout(() => {
          this.showSuccessMessage = false;
        }, 3000);
      },
      error: (err) => {
        console.error('Erreur lors du toggle favorite:', err);
      }
    });

  }

}

