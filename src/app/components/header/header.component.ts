import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen = false;
  constructor(private router : Router){}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isConnected: boolean = false;
  name!: string;
  email!: string;
  token!: string;
  role! : string;


  ngOnInit() {
    this.isConnectedMethode();
  }

  isConnectedMethode() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const email = localStorage.getItem('email');

    if (token && name && email) {
      this.isConnected = true;
      this.token = token;
      this.name = name;
      this.email = email;
    }
  }

  logOut() {
    console.log('Déconnexion...');
    localStorage.clear();
    this.isConnected = false;
    this.token = '';
    this.name = '';
    this.email = '';
  
    this.router.navigateByUrl('').then(() => {
      location.reload(); 
    });
  }
  
}
