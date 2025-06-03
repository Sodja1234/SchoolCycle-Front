import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';


@Component({
  selector: 'app-announcement-list',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.css'
})
export class AnnouncementListComponent {
  announcements!: Announcement[]

  constructor(private announcementService:AnnouncementService){}


  ngOnInit(){
    this.getAnnouncements();
  }

  getAnnouncements(){
    this.announcementService.getAnnouncements().subscribe({
      next:(res)=>{
        this.announcements = res.data;
        console.log("Annonces", this.announcements)
      }
    });
  }
  

  
} 
