import { Component } from '@angular/core';
import { UserPreferencesComponent } from '../user-preferences/user-preferences.component';
import { UserProfileInfoComponent } from '../user-profile-info/user-profile-info.component';
import { SecurityComponent } from '../security/security.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-user-setting',
  imports: [UserPreferencesComponent,UserProfileInfoComponent,SecurityComponent,MatTabsModule],
  templateUrl: './user-setting.component.html',
  styleUrl: './user-setting.component.css'
})
export class UserSettingComponent {
     selectedTab: string = 'tab1';
  tabIndex: number = 0;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'] || 'user-profile-info';
      this.tabIndex = this.getTabIndex(this.selectedTab) 
    });
  }


  getTabIndex(tab: string): number {
    switch (tab) {
      case 'user-profile-info': return 0;
      case 'preferences': return 1;
      case 'security': return 2;
      default: return 0;
    }
  }

  getTabName(index: number): string {
    switch (index) {
      case 0: return 'user-profile-info';
      case 1: return 'preferences';
      case 2: return 'security';
      default: return 'user-profile-info';
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
