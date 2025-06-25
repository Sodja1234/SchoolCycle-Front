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

@Component({
  selector: 'app-announcement-single',
  imports: [RouterLink, HeaderComponent, FooterComponent, CommonModule, FormsModule, AnnouncementCardComponent],
  templateUrl: './announcement-single.component.html',
  styleUrl: './announcement-single.component.css',
})
export class AnnouncementSingleComponent {
  constructor(private annoncementService: AnnouncementService, private route: ActivatedRoute, private router: Router
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

  //menu de partage
  toggleShareMenu = false;
  successMessage:string = ''

  //  Variables pour le formulaire de signalement
  motif: string = '';
  detail: string = '';
  isReportSent: boolean = false;
  hasAlreadyReported: boolean = false;


  ngOnInit() {
    // Récupère l'ID de l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('userSession')!);
    this.currentUserId = user?.id;
    //recharger la page en dunction du nouvel id
    this.route.params.subscribe((params) => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
      this.checkIfAlreadyReported();

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

  //function pour recuperr l'annonce en detail
  getSingleAnnouncement() {
    this.articleId = Number(this.route.snapshot.paramMap.get('id'));

    console.log("Id de l'annonce : ", this.articleId);

    this.annoncementService.getAnnoucement(this.articleId).subscribe({
      next: (res) => {
        this.announcement = res;
        this.currentUserId = +localStorage.getItem('id')!;
        console.log('Annonce récupérée :', this.announcement);
        console.log('ID auteur :', this.announcement.created_by);
        console.log('ID user connecté :', this.currentUserId);
        console.log(this.announcement.created_at_raw);
        console.log(this.announcement.updated_at_raw);
        // Vérifie que des photos existent, et affecte currentImage
        if (this.announcement.photos && this.announcement.photos.length > 0) {
          this.currentImage = this.announcement.photos[0].url;
        }
      },
      error: (err) => {
        console.error("Erreur lors du chargement de l'annonce :", err);
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
    return `${window.location.origin}/announcement/${this.articleId}`;
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

}
