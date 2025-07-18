import { Component } from '@angular/core';
import { AnnouncementService } from '../../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../../components/announcement-card/announcement-card.component';
import { PaginationMeta, PaginationUrls } from '../../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-announcement-favorite',
  imports: [AnnouncementCardComponent, CommonModule],
  templateUrl: './announcement-favorite.component.html',
  styleUrl: './announcement-favorite.component.css'
})
export class AnnouncementFavoriteComponent {
  favorites!:Announcement[];
   paginationMeta!: PaginationMeta;
      paginationUrls!: PaginationUrls;
constructor(private announcementService:AnnouncementService){

}
ngOnInit(){
  this.getAnnouncementFavorite();
}
getAnnouncementFavorite(page:number =1){
  this.announcementService.getAnnouncementFavorite(page).subscribe({
    next:(res)=>{
      this.favorites=res.data;
      console.log('recuperé les favories',this.favorites)
      this.paginationMeta = res.meta;

        //on stocke les annonces recus dans la varible links de PaginatedAnnouncements !!
      this.paginationUrls = res.links;

    },
    error:(err)=>{
      console.error('error:',err)
    }
  })



}

//methode utiliser lorque l'utilisateur clique un lien  de la pagination
  onPageChange(url: string | null | undefined): void {
    //si l'url n'est pas valide, on return rien
    if (typeof url !== 'string') return;

    //on extrait  le parametre page depuis l'url
    const pageParam = new URL(url).searchParams.get('page');

    //on converti la valeur page en nombre
    const page = pageParam ? +pageParam : 1;

    //on renvoit les annonces pour la page selectionné
    this.getAnnouncementFavorite(page);
  }
}
