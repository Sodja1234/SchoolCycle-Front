import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';

import { AnnouncementListComponent } from "./pages/announcement/announcement-list/announcement-list.component";
import { ProfilsComponent } from './pages/profile/profils/profils.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  ngOnInit(): void {
    //alert('Hello World!')
    initFlowbite();
  }
}
