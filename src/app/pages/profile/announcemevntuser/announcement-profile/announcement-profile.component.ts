import { Component, Input } from '@angular/core';
import { AnnouncementService } from '../../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../../components/announcement-card/announcement-card.component';
import { ActivatedRoute, Router } from '@angular/router';
import { UserLocalService } from '../../../../core/services/userlocal/userlocal.service';

@Component({
  selector: 'app-announcement-profile',
  imports: [AnnouncementCardComponent],
  templateUrl: './announcement-profile.component.html',
  styleUrl: './announcement-profile.component.css'
})
export class AnnouncementProfileComponent {
  announcements!:Announcement[]
  errorMsg!:string;

  userAnnouncement!:Announcement[];
  isOwner:boolean=false;
  @Input()userId!:number;
constructor(private announcementService:AnnouncementService,private router:Router,private userLocalService:UserLocalService,private route:ActivatedRoute){

}
// @Input() announcement!: Announcement;
ngOnInit(){

  this.loadAnnouncement();

}
getAnnouncementUser(page : number = 1){
  this.announcementService.getAnnouncementUser(page).subscribe({
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

getAnnouncementpublic(){
  this.announcementService.getAnnouncements(this.userId).subscribe({
    next:(res)=>{
      this.userAnnouncement=res.data;
      console.log('recuperer les annonces pub',res.data)
      console.log('userId', this.userId);

    },
    error:(err)=>{
      console.error('Erreur lors du chargement des annonces :', err);
    }
  })
}

loadAnnouncement(){
    this.route.params.subscribe(params=>{
      if(params["id"]){
          const user = this.userLocalService.getUser()
          const createdBy = user?.id
          if(createdBy == params["id"]){
          this.router.navigate(['/profils'])
        }else{
          this.userId= +params["id"]
          this.getAnnouncementpublic();
          this.isOwner = false
        }
    }else{
       this.getAnnouncementUser();
       this.isOwner = true
    }
 })

  }
}
