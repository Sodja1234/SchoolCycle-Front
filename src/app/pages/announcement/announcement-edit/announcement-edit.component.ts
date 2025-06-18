import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category } from '../../../core/models/announcement/category';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { CommonModule } from '@angular/common';
import L from 'leaflet';
import { MapService } from '../../../core/services/map/map.service';
import { Announcement } from '../../../core/models/announcement/announcement';

@Component({
  selector: 'app-announcement-edit',
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './announcement-edit.component.html',
  styleUrl: './announcement-edit.component.css',
})
export class AnnouncementEditComponent {
  //declaration des variables
  announcementForm!: FormGroup;
  announcementId!: number;
  private map!: L.Map;
  private marker!: L.Marker;
  private router = inject(Router);
  address: string = '';
  addressSuggestions: any[] = [];
  showSuggestions = false;
  addresseInputFocused = false;
  isSubmited: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  categories: Category[] = [];
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';
  //injection du service map
  mapService = inject(MapService);
  //varibale pour stocker l'id de l'utilisateur courant
  currentUserId!: number;

  constructor(
    private announcementService: AnnouncementService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {}

  //recuperation des categories
  getCategories() {
    this.announcementService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
        this.loadAnnouncementData();
      },
    });
  }

  //initialisation de la carte
  initMap(): void {
    // Empêche l'erreur si la carte est déjà initialisée
    if (this.map) {
      this.map.remove(); // Supprime la carte existante proprement
    }
    this.map = L.map('map').setView([0, 0], 2);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);

    this.map.on('click', (e: any) => {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }

      // Mettre à jour les champs du formulaire
      this.announcementForm.patchValue({
        exchange_location_lng: lat,
        exchange_location_lat: lng,
      });

      // Obtenir l’adresse à partir des coordonnées
      this.mapService.reverseGeocode(lat, lng).subscribe((result) => {
        this.announcementForm.patchValue({
          exchange_location_address: result.display_name,
        });
      });
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  //on charge les donnees de l'annonce
  loadAnnouncementData(): void {
    this.announcementService.getAnnoucement(this.announcementId).subscribe({
      next: (announcement) => {
        this.announcementForm.patchValue(announcement);
      },
      error: () => {
        this.errorMessage = "Erreur lors du chargement de l'annonce";
      },
    });
  }

  // Méthode pour activer ou désactiver la validation du champ "price"
  disablePriceInput() {
    this.announcementForm
      .get('operation_type')
      ?.valueChanges.subscribe((value) => {
        const priceControl = this.announcementForm.get('price');

        // Si l'utilisateur choisit "vente", on rend "price" requis
        if (value === 'sale') {
          priceControl?.setValidators([Validators.required]);
        } else {
          // Sinon, on retire la validation
          priceControl?.clearValidators();
          priceControl?.setValue(null);
        }

        // Mise à jour de la validité du champ
        priceControl?.updateValueAndValidity();
      });
  }

  //function pour fermer le popup
  closeToast() {
    this.showToast = false;
  }

  onAddressInput(): void {
    const query = this.announcementForm.get('exchange_location_address')?.value;
    if (query && query.length > 3) {
      this.mapService.searchPlaces(query).subscribe((results) => {
        this.addressSuggestions = results;
      });
    }
  }

  //selection de l'addresse
  selectAddress(suggestion: any): void {
    this.announcementForm.patchValue({
      exchange_location_address: suggestion.display_name,
      exchange_location_lat: suggestion.lat,
      exchange_location_lng: suggestion.lon,
    });

    const latlng = L.latLng(suggestion.lat, suggestion.lon);
    this.map.setView(latlng, 15);

    if (this.marker) {
      this.marker.setLatLng(latlng);
    } else {
      this.marker = L.marker(latlng).addTo(this.map);
    }

    this.addressSuggestions = [];
  }

  ngOnInit() {
    this.getCategories();
    this.initMap();
    this.announcementForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      operation_type: ['', Validators.required],
      price: [''],
      state: ['', Validators.required],
      exchange_location_address: ['', Validators.required],
      exchange_location_lng: ['', Validators.required],
      exchange_location_lat: ['', Validators.required],
      category_id: [null, Validators.required],
      photos: [],
    });
    this.disablePriceInput();
    this.announcementId = +this.route.snapshot.paramMap.get('id')!;
    this.loadAnnouncementData();
  }

  onSubmit() {
    this.isSubmited = true;
    this.successMessage = '';

    if (this.announcementForm.invalid) {
      this.isSubmited = false;
      return;
    }else {
      console.log(this.announcementForm);

      //on active le toast pendant 3000
      this.showToast = true;
      this.toastMessage = 'Annonce modifié avec success !';
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    }

    const formData = new FormData();
    const formValue = this.announcementForm.value;

    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    }

    this.announcementService
      .updateAnnouncement(this.announcementId, this.announcementForm.value)
      .subscribe({
        next: () => {
          console.log(this.announcementForm.value);
          this.successMessage = 'Annonce modifier avec success';
          this.isSubmited = false;
          this.router.navigate(['/announcement-gallery']);
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.isSubmited = false;
        },
      });
  }
}
