import { Component } from '@angular/core';
import { AuthLoginResponse } from '../../core/models/auth/auth';
import { UserLocalService } from '../../core/services/userlocal/userlocal.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebard',
  imports: [RouterLink],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.css'
})
export class SidebardComponent {
    user!: AuthLoginResponse | null;
    constructor(
      private authservice: UserLocalService,private router : Router
    ) {}
  
    ngOnInit() {
      this.user = this.authservice.getUser();
      console.log('user', this.user);
    }

    logOut(){
      console.log('Clique que sur le button')
      localStorage.clear();
      this.router.navigate(['/']).then(()=>{
        location.reload();
      });
  }
}
