import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { User } from '../../../core/models/user';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { ActionRapideComponent } from "../action-rapide/action-rapide.component";
import { CommonModule } from '@angular/common';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, ActionRapideComponent,CommonModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
 @Input() user!: AuthLoginResponse | null;
  @Input() userId!: number;

  userInfo: Announcement[] = [];
  isOwner: boolean = false;
  currentUserId!:number
  announcement!:Announcement

  constructor(
    private userLocalService: UserLocalService,
    private announcementService: AnnouncementService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    if (!this.userId) {
      this.loadAnnouncement();
    } else {

      this.getInfoUser();
    }

    this.user = this.userLocalService.getUser();
  }


  getInfoUser(): void {
    if (!this.userId) {
      console.warn('userId est manquant pour récupérer les infos utilisateur.');
      return;
    }

    this.announcementService.getAnnouncements(this.userId).subscribe({
      next: (res) => {
        this.userInfo = res.data;
        console.log('Annonces récupérées jyfg :', this.userInfo);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des infos utilisateur :', err);
      }
    });
  }

  loadAnnouncement(): void {
    this.route.params.subscribe((params) => {
      const paramId = +params['id'];

      const currentUser = this.userLocalService.getUser();
      const currentUserId = currentUser?.id;



      if (paramId) {
        this.userId = paramId;

        if (currentUserId === paramId) {

          this.isOwner = true;
          this.router.navigate(['/profils']);
        } else {

          this.isOwner = false;
          this.getInfoUser();
        }
      } else {

        this.userId = currentUserId!;
        this.isOwner = true;
        this.getInfoUser();
      }
    });
  }

  isAuthor(){
this.route.params.subscribe((params) => {
      const paramId = +params['id'];

      const currentUser = this.userLocalService.getUser();
      const currentUserId = currentUser?.id;



      if (paramId) {
        this.userId = paramId;

        if (currentUserId === paramId) {

          this.isOwner = true;

        } else {

          this.isOwner = false;
        }
      }
    });
  }

}
