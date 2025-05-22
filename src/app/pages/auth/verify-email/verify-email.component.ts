import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http'; // 
import { NgIf } from '@angular/common';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  standalone: true,
  imports: [NgIf, RouterLink],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  successMessage = '';
  errorMessage = '';
  verified = false; 

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const hash = this.route.snapshot.paramMap.get('hash');

    this.route.queryParams.subscribe(params => {
      const expires = params['expires'];
      const signature = params['signature'];

      if (!id || !hash || !expires || !signature) {
        this.errorMessage = "❌ Lien de vérification invalide ou incomplet.";
        this.loading = false;
        return;
      }

      const url = environment.apiUrl + `verify-email/${id}/${hash}`;

      const httpParams = new HttpParams()
        .set('expires', expires)
        .set('signature', signature);

      this.http.get(url, { params: httpParams }).subscribe({
        next: (res: any) => {
          if (res.status === 'verification-link-success') {
            this.successMessage = "✅ Votre adresse e-mail a été vérifiée avec succès.";
            this.verified = true;
            setTimeout(() => this.router.navigate(['login']), 5000);
          } else if (res.status === 'verification-link-already') {
            this.successMessage = "ℹ️ Votre adresse e-mail a déjà été vérifiée.";
            setTimeout(() => this.router.navigate(['login']), 3000);
          } else {
            this.errorMessage = "❌ Une erreur est survenue.";
          }
          this.loading = false;
        },
        error: () => {
          this.errorMessage = "❌ Lien de vérification invalide ou expiré.";
          this.loading = false;
        }
      });
    });
  }
}
