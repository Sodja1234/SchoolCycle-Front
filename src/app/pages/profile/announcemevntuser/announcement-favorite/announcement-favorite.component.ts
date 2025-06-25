import { Component } from '@angular/core';
import { AnnouncementService } from '../../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../../components/announcement-card/announcement-card.component';

@Component({
  selector: 'app-announcement-favorite',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcement-favorite.component.html',
  styleUrl: './announcement-favorite.component.css'
})
export class AnnouncementFavoriteComponent {
  favorites!:Announcement[];
constructor(private announcementService:AnnouncementService){

}
ngOnInit(){
  this.getAnnouncementFavorite();
}
getAnnouncementFavorite(){
  this.announcementService.getAnnouncementFavorite().subscribe({
    next:(res)=>{
      this.favorites=res.data;
      console.log('recuperé les favories',this.favorites)
    },
    error:(err)=>{
      console.error('error:',err)
    }
  })



}
}
