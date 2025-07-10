import { Component } from '@angular/core';
import { User } from '../../../core/models/user';
import { SidebardComponent } from "../../../components/sidebard/sidebard.component";
import { UserNetworkService } from '../../../core/services/userNetwork/user-network.service';
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  imports: [SidebardComponent, CommonModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users!: User[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  constructor(
    private userNetworkService: UserNetworkService,
  ) {}

  ngOnInit(){
    this.getUser()
  }
  getUser(page: number = 1) {
    this.userNetworkService.getUser(page).subscribe({
      next: (res) => {
        this.users = res.data;
        console.log('all users', this.users);
        
        this.paginationMeta = res.meta;
        this.paginationUrls = res.links;
        console.log(this.users);
        console.log('metas', this.paginationMeta);
        console.log('Url', this.paginationUrls);
      },
      error: (err) => {
        console.log(err);
      },
    });
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
    this.getUser(page);
  }
}
