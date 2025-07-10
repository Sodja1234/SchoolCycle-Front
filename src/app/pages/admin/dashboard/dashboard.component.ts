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
import { SidebardComponent } from "../../../components/sidebard/sidebard.component";
import { ReportCardComponent } from '../../../components/report-card/report-card.component';
import { ReportService } from '../../../core/services/report/report.service';
import { Report } from '../../../core/models/announcement/report';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, SidebardComponent, RouterLink, ReportCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  user!: AuthLoginResponse | null;
  articleId: number = -1;
  report!:Report[]

  suggestions: Announcement[] = [];
  constructor(
    private announcementService: AnnouncementService,
    private authservice: UserLocalService,
    private reportService:ReportService
  ) {}

  ngOnInit() {
    this.getAnnoucements();
    this.user = this.authservice.getUser();
    this.getReportList()
    console.log('user', this.user);
  }

  // Récupère les annonces depuis l'API
   getAnnoucements(page : number = 1) {
  this.announcementService.getAnnouncements(undefined, page).subscribe({
    next: (res) => {
      this.announcements = res.data;
      console.log('Annonces:', this.announcements);
    },
    error:(err) => {
      console.error("Erreur lors du chargement des annonces :", err);
    }
  });
}

  getReportList(){
    this.reportService.getReport().subscribe({
      next:(res)=>{
        this.report = res.data
        console.log("hello", this.report)
      }
    })
  }
}
