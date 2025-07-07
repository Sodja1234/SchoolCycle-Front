import { Component } from '@angular/core';
import { AuthLoginResponse } from '../../core/models/auth/auth';
import { UserLocalService } from '../../core/services/userlocal/userlocal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebard',
  imports: [RouterLink],
  templateUrl: './sidebard.component.html',
  styleUrl: './sidebard.component.css'
})
export class SidebardComponent {
    user!: AuthLoginResponse | null;
    constructor(
      private authservice: UserLocalService,
    ) {}
  
    ngOnInit() {
      this.user = this.authservice.getUser();
      console.log('user', this.user);
    }
}
