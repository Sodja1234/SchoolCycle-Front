import { Component } from '@angular/core';
import { Announcement } from '../../../core/models/announcement/announcement';
import {
  PaginationMeta,
  PaginationUrls,
} from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';
import { SidebardComponent } from '../../../components/sidebard/sidebard.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabsModule } from "@angular/material/tabs";
import { AnnouncementComponent } from "../announcement/announcement.component";

@Component({
  selector: 'app-announcement-list',
  imports: [CommonModule, SidebardComponent, MatTabsModule, AnnouncementComponent],
  templateUrl: './announcement-list.component.html',
  styleUrl: './announcement-list.component.css',
})
export class AnnouncementListComponent {
  announcements!: Announcement[];
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;
  articleId: number = -1;
  selectedTab: string = 'tab1';
  tabIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedTab = params['tab'] || 'announcement';
      this.tabIndex = this.getTabIndex(this.selectedTab)
    });

  }

  getTabIndex(tab: string): number {
    switch (tab) {
      case 'all-announcement': return 0;
      case 'announcement-active': return 1;
      default: return 0;
    }
  }

  getTabName(index: number): string {
    switch (index) {
      case 0: return 'all-announcement';
      case 1: return 'announcement-active';
      default: return 'all-announcement';
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
