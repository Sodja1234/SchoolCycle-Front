import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Report } from '../../core/models/announcement/report';

@Component({
  selector: 'app-report-card',
  imports: [],
  templateUrl: './report-card.component.html',
  styleUrl: './report-card.component.css'
})
export class ReportCardComponent {
    reportId!: number;
  constructor(private reportService: AnnouncementService) {}
  @Input() report!: Report;
}
