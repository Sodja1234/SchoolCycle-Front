import { Component } from '@angular/core';
import { User } from '../../../core/models/user';
import { SidebardComponent } from "../../../components/sidebard/sidebard.component";
import { UserNetworkService } from '../../../core/services/userNetwork/user-network.service';

@Component({
  selector: 'app-user-list',
  imports: [SidebardComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css',
})
export class UserListComponent {
  users!: User[];

  constructor(
    private userNetworkService: UserNetworkService,
  ) {}

  ngOnInit(){
    this.getUser()
  }
  getUser() {
    this.userNetworkService.getUser().subscribe({
      next: (res) => {
        this.users = res.data;
        console.log(this.users);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
