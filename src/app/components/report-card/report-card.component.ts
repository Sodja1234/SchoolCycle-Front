import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Report } from '../../core/models/announcement/report';
import { Announcement } from '../../core/models/announcement/announcement';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css',
})
export class ReportCardComponent {
  reportId!: number;
  articleId: number = -1;
  isModalOpen = false;
  isDeleteModalOpen = false;
  constructor(private announcementService: AnnouncementService) {}
  @Input() report!: Report;
  @Input() announcement!: Announcement;

  openDeleteModal(id: number) {
    this.isDeleteModalOpen = true;
    this.articleId = id;
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
  }
}
