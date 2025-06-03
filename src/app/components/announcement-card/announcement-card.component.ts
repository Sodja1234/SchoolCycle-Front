import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Announcement } from '../../core/models/announcement/announcement';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-announcement-card',
  imports: [RouterModule ],
  templateUrl: './announcement-card.component.html',
  styleUrl: './announcement-card.component.css',
})
export class AnnouncementCardComponent {
  announcementId!: number;
  constructor(private announcementService: AnnouncementService) {}
  @Input() announcement!: Announcement;
  ngOnInit() {
    console.log('Photo recuperer', this.announcement.photos[0]?.url);
  }
}
