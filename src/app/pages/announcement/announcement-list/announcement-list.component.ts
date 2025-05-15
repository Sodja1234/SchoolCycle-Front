import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../announcement-card/announcement-card.component';


@Component({
  selector: 'app-announcement-list',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.css'
})
export class AnnouncementListComponent {

}
