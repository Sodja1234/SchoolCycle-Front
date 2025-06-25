import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileComponent } from '../user-profile/user-profile.component';
import { AnnouncementProfileComponent } from '../announcement-profile/announcement-profile.component';
import { MatTabsModule } from '@angular/material/tabs';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { AnnouncementFavoriteComponent } from '../announcemevntuser/announcement-favorite/announcement-favorite.component';
@Component({
  selector: 'app-profils',
  imports: [UserProfileComponent,
    AnnouncementProfileComponent,
    FooterComponent,HeaderComponent,
  MatTabsModule,AnnouncementFavoriteComponent
],
  templateUrl: './profils.component.html',
  styleUrl: './profils.component.css'
})
export class ProfilsComponent {
  selectedTab: string = 'tab1';
  tabIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'] || 'announcement';
      this.tabIndex = this.getTabIndex(this.selectedTab)
    });
  }


  getTabIndex(tab: string): number {
    switch (tab) {
      case 'announcement': return 0;
      case 'favoris': return 1;
      case 'avis': return 2;
      default: return 0;
    }
  }

  getTabName(index: number): string {
    switch (index) {
      case 0: return 'announcement';
      case 1: return 'favoris';
      case 2: return 'avis';
      default: return 'announcement';
    }
  }


  onTabChange(index: number) {
    this.selectedTab = this.getTabName(index);
    // Update URL query parameter here using router.navigate with queryParams
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: this.selectedTab },
      queryParamsHandling: 'merge',
    });
}
  }
