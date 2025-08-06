import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AnnouncementService } from '../../core/services/announcement/announcement.service';
import { Announcement } from '../../core/models/announcement/announcement';
import { Category } from '../../core/models/announcement/category';

@Component({
  selector: 'app-categorie-card',
  imports: [],
  templateUrl: './categorie-card.component.html',
  styleUrl: './categorie-card.component.css'
})
export class CategorieCardComponent {
  categorieId!: number;
  constructor(private categorieService: AnnouncementService) {}
  @Input() categorie!: Category;
  @Output() edit = new EventEmitter<number>();  
}
