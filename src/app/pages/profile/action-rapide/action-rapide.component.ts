import { Component } from '@angular/core';
import {  Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-action-rapide',
  imports: [RouterLink],
  templateUrl: './action-rapide.component.html',
  styleUrl: './action-rapide.component.css'
})
export class ActionRapideComponent {
  isConnected:boolean=false;
  constructor(private router:Router){}

logOut() {
console.log('Clique que sur le button')
    localStorage.clear();
    this.isConnected = false ;
    this.router.navigate(['/']).then(()=>{
      location.reload();
    });
}

}
