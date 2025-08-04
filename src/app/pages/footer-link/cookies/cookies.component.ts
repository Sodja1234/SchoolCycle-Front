import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../../../components/header/header.component";
import { FooterComponent } from "../../../components/footer/footer.component";
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterLink,
    CommonModule,
    FormsModule
  ],
  templateUrl: './cookies.component.html',
})
export class CookiesComponent {

}