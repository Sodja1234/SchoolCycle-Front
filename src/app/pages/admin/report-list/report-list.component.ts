import { Component } from '@angular/core';
import { SidebardComponent } from "../../../components/sidebard/sidebard.component";
import { Report } from '../../../core/models/announcement/report';
import { ReportCardComponent } from "../../../components/report-card/report-card.component";
import { ReportService } from '../../../core/services/report/report.service';
import { PaginationMeta, PaginationUrls } from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-report-list',
  imports: [SidebardComponent, ReportCardComponent,CommonModule],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent {
  report!:Report[]
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  constructor( private reportService: ReportService ){}

  ngOnInit(){
    this.getReportList()
  }

  getReportList(page:number=1){
    this.reportService.getReport(page).subscribe({
      next:(res)=>{
        this.report = res.data
        this.paginationMeta = res.meta;
        this.paginationUrls = res.links;
        console.log('metas', this.paginationMeta);
        console.log('Url', this.paginationUrls);
      }
    })
  }

    //methode utiliser lorque l'utilisateur clique un lien  de la pagination
  onPageChange(url: string | null | undefined): void {
    //si l'url n'est pas valide, on return rien
    if (typeof url !== 'string') return;

    //on extrait  le parametre page depuis l'url
    const pageParam = new URL(url).searchParams.get('page');

    //on converti la valeur page en nombre
    const page = pageParam ? +pageParam : 1;

    //on renvoit les annonces pour la page selectionné
    this.getReportList(page);
  }
}
