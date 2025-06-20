import { Component } from '@angular/core';
import { AnnouncementListComponent } from '../../announcement/announcement-list/announcement-list.component';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
import {UserLocalService} from '../../../core/services/userlocal/userlocal.service';
@Component({
  selector: 'app-home',
  imports: [AnnouncementListComponent, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private userlocalService : UserLocalService ) {
  }
  isConnected: boolean = false;
  name!: string | undefined;
  email!: string | undefined;
  token!: string;


  ngOnInit() {
      initFlowbite();
    this.userConnected();
  }

  userConnected(){
    const user = this.userlocalService.getUser();
    this.name = user?.name;
    this.email = user?.email;
    const token = user?.token;
    if (token){
      this.isConnected = true;
    }else {
      this.isConnected = false;
    }
  }

}

