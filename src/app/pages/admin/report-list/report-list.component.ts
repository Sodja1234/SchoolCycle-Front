import { Component } from '@angular/core';
import { SidebardComponent } from "../../../components/sidebard/sidebard.component";
import { Report } from '../../../core/models/announcement/report';
import { ReportCardComponent } from "../../../components/report-card/report-card.component";
import { ReportService } from '../../../core/services/report/report.service';

@Component({
  selector: 'app-report-list',
  imports: [SidebardComponent, ReportCardComponent],
  templateUrl: './report-list.component.html',
  styleUrl: './report-list.component.css'
})
export class ReportListComponent {
  report!:Report[]
  constructor( private reportService: ReportService ){}

  ngOnInit(){
    this.getReportList()
  }

  getReportList(){
    this.reportService.getReport().subscribe({
      next:(res)=>{
        this.report = res.data
      }
    })
  }
}
