import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../../announcement/announcement-card/announcement-card.component';
import { AnnouncementListComponent } from '../../announcement/announcement-list/announcement-list.component';
import { initFlowbite } from 'flowbite';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
@Component({
  selector: 'app-home',
  imports: [AnnouncementListComponent, FooterComponent,HeaderComponent,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 ngOnInit(): void {
    initFlowbite();
    console.log('INIT')
  }
}

