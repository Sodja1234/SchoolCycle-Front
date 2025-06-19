// Importation des éléments nécessaires à Angular et au formulaire
import { Component, inject, OnInit } from '@angular/core';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import * as L from 'leaflet';

import { Category } from '../../../core/models/announcement/category';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Announcement } from '../../../core/models/announcement/announcement';
import { Router, RouterLink } from '@angular/router';
import { ChatHeaderComponent } from '../../chat/chat-header/chat-header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { MapService } from '../../../core/services/map/map.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-create', // Sélecteur utilisé dans le HTML parent
  standalone: true, // Composant autonome (pas besoin d’être déclaré dans un module)
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgFor,
    RouterLink,
    NgClass,
    FooterComponent,
    HeaderComponent,
  ], // Importation des modules utilisés dans le template HTML
  templateUrl: './announcement-create.component.html', // Chemin vers le fichier HTML du composant
  styleUrls: ['./announcement-create.component.css'], // Chemin vers le fichier CSS du composant
})
export class AnnouncementCreateComponent implements OnInit {
  // Déclaration du formulaire de création d’annonce
  createAnnoucmentForm!: FormGroup;
  private map!: L.Map;
  private marker!: L.Marker;
  private router = inject(Router);
  address: string = '';
  addressSuggestions: any[] = [];
  showSuggestions = false;
  addressInputFocused = false;

  //injection du service Map
  mapService = inject(MapService);

  // Indique si le formulaire a été soumis
  isSubmited: boolean = false;

  // Messages de succès ou d'erreur à afficher à l'utilisateur
  errorMsg: string = '';
  successMsg: string = '';

  // Liste des catégories récupérées depuis le backend
  categories: Category[] = [];

  // Liste des annonces existantes (potentiellement pour une vérification ou autre logique)
  announcements!: Announcement[];

  // Fichiers sélectionnés par l’utilisateur
  selectedFiles: File[] = [];

  // URLs des images pour la prévisualisation avant envoi
  previewImages: string[] = [];

  //affichage d'un pop up contenant un message d'erreur ou de success
  showToast = false;
  toastType: 'success' | 'error' = 'success';
  toastMessage = '';

  // Injection du service des annonces et du FormBuilder
  constructor(
    private annoucementService: AnnouncementService,
    private fb: FormBuilder
  ) {}

  // Initialisation du composant
  ngOnInit() {
    // Récupération des catégories
    this.getCategories();
    this.initMap();

    // Initialisation du formulaire avec validation
    this.createAnnoucmentForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      operation_type: ['', Validators.required], // achat ou vente
      price: [''], // Requis uniquement si operation_type est "sale"
      state: ['', Validators.required],
      exchange_location_address: ['', Validators.required],
      exchange_location_lng: ['', Validators.required],
      exchange_location_lat: ['', Validators.required],
      category_id: [null, Validators.required],
      photos: [], // Champ pour les fichiers (optionnel)
    });

    // Gestion dynamique de la validation du champ "price"j
    this.disablePriceInput();
    this.initMap();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  // Méthode pour activer ou désactiver la validation du champ "price"
  disablePriceInput() {
    this.createAnnoucmentForm
      .get('operation_type')
      ?.valueChanges.subscribe((value) => {
        const priceControl = this.createAnnoucmentForm.get('price');

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

  // Récupère les catégories depuis l'API
  getCategories() {
    this.annoucementService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data; // Stocke les catégories dans la propriété du composant
        console.log('Catégories:', this.categories); // Debug
      },
    });
  }

  // Gère le changement de fichiers dans l’input type="file"
  onFileChange(event: any) {
    // Nettoyer les anciennes images sélectionnées
    this.selectedFiles = [];
    this.previewImages = [];
    if (event.target.files && event.target.files.length > 0) {
      // Convertit la FileList en tableau
      this.selectedFiles = Array.from(event.target.files);
      this.previewImages = [];

      // Pour chaque fichier, on lit son contenu pour afficher l’aperçu
      this.selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result); // Ajoute l’aperçu (base64)
        };
        reader.readAsDataURL(file);
      });
    }
  }

  // Supprime un fichier de la sélection (et son aperçu)
  removeImage(index: number) {
    this.selectedFiles.splice(index, 1); // Supprime le fichier
    this.previewImages.splice(index, 1); // Supprime l’aperçu
  }

  //function pour fermer le popup
  closeToast() {
    this.showToast = false;
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
      this.createAnnoucmentForm.patchValue({
        exchange_location_lng: lat,
        exchange_location_lat: lng,
      });

      // Obtenir l’adresse à partir des coordonnées
      this.mapService.reverseGeocode(lat, lng).subscribe((result) => {
        this.createAnnoucmentForm.patchValue({
          exchange_location_address: result.display_name,
        });
      });
    });
  }

  onAddressInput(): void {
    const query = this.createAnnoucmentForm.get(
      'exchange_location_address'
    )?.value;
    if (query && query.length > 3) {
      this.mapService.searchPlaces(query).subscribe((results) => {
        this.addressSuggestions = results;
      });
    }
  }

  //selection de l'addresse
  selectAddress(suggestion: any): void {
    this.createAnnoucmentForm.patchValue({
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

  // Soumission du formulaire
  onSubmit() {
    this.isSubmited = true; // Indique que le formulaire a été soumis
    this.errorMsg = '';
    this.successMsg = '';

    // Vérifie la validité du formulaire
    if (this.createAnnoucmentForm.invalid) {
      //on active le toast avec message d'erreur
      this.showToast = true;
      this.toastType = 'error';
      this.toastMessage = 'Veuillez remplir correctement le formulaire';
      setTimeout(() => {
        this.showToast = false;
      }, 2000);
      return;
    }

    // Prépare les données sous forme de FormData (pour inclure les fichiers)
    const formData = new FormData();
    const formValue = this.createAnnoucmentForm.value;

    // Ajoute tous les champs du formulaire dans le FormData
    for (const key in formValue) {
      if (formValue[key] !== null && formValue[key] !== undefined) {
        formData.append(key, formValue[key]);
      }
    }

    // Ajoute les fichiers dans le FormData
    this.selectedFiles.forEach((file) => {
      formData.append('photos[]', file);
    });

    // Envoie des données au backend via le service
    this.annoucementService.createAnnouncement(formData).subscribe({
      next: (res) => {
        // Si succès : affiche message, reset formulaire et fichiers
        this.successMsg = 'Annonce créée avec succès !';
        this.isSubmited = false;
        this.createAnnoucmentForm.reset();
        this.selectedFiles = [];
        this.previewImages = [];
        this.showToast = true;
        this.toastType = 'success';
        this.toastMessage = 'Annonce creer avec success';
        setTimeout(() => {
          this.showToast = false;
          this.router.navigate(['/announcement-gallery']);
        }, 2000);
        console.log(res);
      },
      error: (err) => {
        // Si erreur : message d’erreur
        this.errorMsg = err.error.message || 'Une erreur est survenue.';
        this.isSubmited = false;
        this.toastType = 'error';
        this.toastMessage = 'Une erreur est survenue.';
        this.showToast = true;
      },
    });
  }
}
