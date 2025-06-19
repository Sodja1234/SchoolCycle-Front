import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';

@Component({
  selector: 'app-announcement-profile',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcement-profile.component.html',
  styleUrl: './announcement-profile.component.css'
})
export class AnnouncementProfileComponent {
  announcements!:Announcement[]
  errorMsg!:string
constructor(private announcementService:AnnouncementService){

}
// @Input() announcement!: Announcement;
ngOnInit(){
  this.getAnnouncementUser()
}
getAnnouncementUser(){
  this.announcementService.getAnnouncementUser().subscribe({
    next:(res)=>{
      this.announcements=res.data;
      console.log('recupetation des annonces',this.announcements)
    },
    error:(err)=>{
      this.errorMsg = err.error.message
      console.log(this.errorMsg)
    }
  })
}
}
