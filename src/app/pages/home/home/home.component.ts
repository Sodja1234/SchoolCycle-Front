import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../../announcement/announcement-card/announcement-card.component';
import { AnnouncementListComponent } from '../../announcement/announcement-list/announcement-list.component';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { FooterComponent } from "../../../components/footer/footer.component";
import { HeaderComponent } from "../../../components/header/header.component";
@Component({
  selector: 'app-home',
  imports: [AnnouncementListComponent, RouterLink, FooterComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isConnected: boolean = false;
  name!: string;
  email!: string;
  token!: string;
  role! : string;

 ngOnInit(): void {
  this.isConnectedMethode();
    initFlowbite();
    console.log('INIT')
  }

  isConnectedMethode() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');
    const role  = localStorage.getItem('role');

    if (token && name && email) {
      this.isConnected = true;
      this.token = token;
      this.name = name;
      this.email = email;
    }
  }
}

