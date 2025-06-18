import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {UserLocalService} from '../../core/services/userlocal/userlocal.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen = false;
  constructor(private router : Router, private userLocalService : UserLocalService){}

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  isConnected: boolean = false;
  name!: string | undefined;
  email!: string | undefined;
  token!: string;


  ngOnInit() {
    this.userConnected();
  }

  userConnected(){
    const user = this.userLocalService.getToken();
    this.name = user?.name;
    this.email = user?.email;
    const token = user?.token;
    if (token){
      this.isConnected = true;
    }else {
      this.isConnected = false;
    }
  }

  logOut(){
    console.log('Clique que sur le button')
    localStorage.clear();
    this.isConnected = false ;
    this.router.navigate(['/']).then(()=>{
      location.reload();
    });
  }

}
