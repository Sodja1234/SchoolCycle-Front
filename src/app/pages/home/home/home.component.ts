import { Component } from '@angular/core';
import { AnnouncementCardComponent } from '../../announcement/announcement-card/announcement-card.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { AnnouncementListComponent } from '../../announcement/announcement-list/announcement-list.component';
import { initFlowbite } from 'flowbite';
@Component({
  selector: 'app-home',
  imports: [AnnouncementListComponent, FooterComponent,HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 ngOnInit(): void {
    //alert('Hello World!')
    initFlowbite();
    console.log('INIT')
  }
}

