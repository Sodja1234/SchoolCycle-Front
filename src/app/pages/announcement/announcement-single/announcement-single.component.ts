import { Component } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { environment } from '../../../../environments/environment';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { CommonModule } from '@angular/common';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

@Component({
  selector: 'app-announcement-single',
  imports: [RouterLink, HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './announcement-single.component.html',
  styleUrl: './announcement-single.component.css',
})
export class AnnouncementSingleComponent {
  constructor(
    private annoncementService: AnnouncementService,
    private route: ActivatedRoute
  ) {}
  storageUrl = environment.storageUrl;
  currentImage: string = '';
  announcement!: Announcement;
  similarAnnouncements: Announcement[] = [];
  articleId: number = -1;
  announcementData!: Announcement;
  currentUserId: number = -1;

  ngOnInit() {
    // Récupère l'ID de l'utilisateur connecté une seule fois
    const user = JSON.parse(localStorage.getItem('user')!);
    this.currentUserId = user?.id;
    //recharger la page en dunction du nouvel id
    this.route.params.subscribe((params) => {
      this.articleId = +params['id'];
      this.getSingleAnnouncement();
      this.getSimilarAnnouncement();
    });
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

  //function pour recuperr changer la photo principale de l'annonce
  changeMainImage(url: string) {
    this.currentImage = url;
  }

  //Vérifie si le user connecté est l'auteur
  get isAuthor(): boolean {
    const userId = +localStorage.getItem('id')!;
    return this.announcement?.created_by?.id === userId;
  }

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
}
