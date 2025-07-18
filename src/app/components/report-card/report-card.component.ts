import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Report } from '../../core/models/announcement/report';
import { Announcement } from '../../core/models/announcement/announcement';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../core/services/report/report.service';

@Component({
  selector: 'app-report-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css',
})
export class ReportCardComponent {
  reportId: number =-1;
  articleId: number = -1;
  isModalOpen = false;
  isDeleteModalOpen = false;
  isReportModalOpen:boolean = false;
  constructor(private announcementService: AnnouncementService, private reportService:ReportService) {}
  @Input() report!: Report;
  @Input() announcement!: Announcement;

  openDeleteModal(id: number,idReport:number) {
    this.isDeleteModalOpen = true;
    this.articleId = id;
    this.reportId=idReport;

  }

  closeDeleteModal() {
    this.isDeleteModalOpen = false;
  }

  confirmDelete() {
    this.deleteAnnouncement();
    this.closeDeleteModal();
  }

  deleteAnnouncement() {
    this.announcementService.deleteAnnouncement(this.articleId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur suppression annonce', err);
      },
    });
    this.reportService.ignoreReport(this.reportId).subscribe({
      next:()=>{
        console.log('report désactivé',this.report)
      },
      error:(err)=>{
        console.error('erreur de désactivation', err)
      }
    })
  }


  openIgnoreModal(id: number) {
    console.log("click",id)
    this.isReportModalOpen = true;
    this.reportId = id;
  }

  closeIgnoreModal() {
    this.isReportModalOpen = false;
  }

  confirmIgnore() {
    this.ignoreReport();
    this.closeIgnoreModal();
  }

  ignoreReport() {
    this.reportService.ignoreReport(this.reportId).subscribe({
      next: () => {
        window.location.reload();
      },
      error: (err) => {
        console.error('Erreur suppression report', err);
      },
    });
  }
}
