import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserLocalService } from '../../../core/services/userlocal/userlocal.service';
import { User } from '../../../core/models/user';
import { AuthLoginResponse } from '../../../core/models/auth/auth';
import { ActionRapideComponent } from "../action-rapide/action-rapide.component";

@Component({
  selector: 'app-user-profile',
  imports: [RouterLink, ActionRapideComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
user!:AuthLoginResponse|null;
  constructor(private userLocalService:UserLocalService){

  }
  ngOnInit(){
    this.user=this.userLocalService.getUser();
}
}
