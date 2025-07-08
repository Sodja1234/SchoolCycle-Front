import { Component} from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { FooterComponent } from '../../../components/footer/footer.component';
import { AnnouncementService } from '../../../core/services/announcement/announcement.service';
import { Announcement } from '../../../core/models/announcement/announcement';
import { AnnouncementCardComponent } from '../../../components/announcement-card/announcement-card.component';
import {
  PaginationMeta,
  PaginationUrls,
} from '../../../core/models/announcement/pagination';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-announcement-gallery',
  imports: [
    HeaderComponent,
    FooterComponent,
    AnnouncementCardComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './announcement-gallery.component.html',
  styleUrl: './announcement-gallery.component.css',
})
export class AnnouncementGalleryComponent {
  // Données des annonces
  announcements: Announcement[] = [];

  // Données de pagination
  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  // États de l’interface
  isFiltersOpen = false;
  toast : boolean = false
  errorMessage : string = ''
  successMessage: string = '';
  successMessageReset : string = ''
  isLoading = false;
  noResults = false;
  isEmpty = false;

  // Formulaire de filtres
  filterForm!: FormGroup;


  constructor(
    private announcementService: AnnouncementService,
    private fb: FormBuilder,
    private route: ActivatedRoute,  // Pour récupérer les paramètres de l’URL
    private router: Router          // Pour mettre à jour l’URL
  ) {}

  ngOnInit() {
    this.initForm();
    this.paramsFiltre(); // Appliquer les filtres dès le chargement
  }

  paramsFiltre() {
    // Écoute les changements des paramètres dans l'URL
    this.route.queryParams.subscribe(params => {

      // Vérifie si des filtres sont présents dans l'URL
      const hasFilters =
        params['search'] || params['operation_type'] || params['state'] ||
        params['min_price'] || params['max_price'];

      // Récupère les valeurs des paramètres 'operation_type' et 'state' et les transforme en tableau
      const operationTypes = params['operation_type']?.split(',') || [];
      const states = params['state']?.split(',') || [];

      // Applique les valeurs simples (hors objets imbriqués) directement dans le formulaire
      this.filterForm.patchValue({
        search: params['search'] || '',
        min_price: params['min_price'] ? +params['min_price'] : null,
        max_price: params['max_price'] ? +params['max_price'] : null,
      });

      // Applique les valeurs cochées des types d’opération dans le sous-formulaire
      this.filterForm.get('operation_type')?.patchValue(
        this.mapToCheckboxObject(operationTypes)
      );

      // Applique les valeurs cochées des états dans le sous-formulaire
      this.filterForm.get('state')?.patchValue(
        this.mapToCheckboxObject(states)
      );

      // Si des filtres sont présents, on affiche le panneau de filtres
      if (hasFilters) {
        this.isFiltersOpen = true;
      }

      // Appel de la récupération des annonces à partir des filtres présents
      this.getAnnouncements(+params['page'] || 1);
    });
  }

  // Initialisation des champs du formulaire
  initForm() {
    this.filterForm = this.fb.group({
      search: [''],
      operation_type: this.fb.group({
        sale: [false],
        exchange: [false],
        don: [false],
      }),
      state: this.fb.group({
        new: [false],
        like_new: [false],
        used: [false],
      }),
      min_price: [null],
      max_price: [null],
    }, {
      validators: [this.priceRangeValidator] // 👈 Ajout du validateur ici
    });
  }

  priceRangeValidator(formGroup: FormGroup) {
    const min = formGroup.get('min_price')?.value;
    const max = formGroup.get('max_price')?.value;

    if (min != null && max != null && max < min) {
      return { priceRangeInvalid: true };
    }
    return null;
  }

  // Récupération des annonces avec filtres
  getAnnouncements(page: number = 1) {
    // Active l’indicateur de chargement
    this.isLoading = true;

    // Récupère les valeurs du formulaire
    const formValue = this.filterForm.value;

    // Extrait les types d’opération cochés
    const operationType = Object.entries(formValue.operation_type)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Extrait les états cochés
    const state = Object.entries(formValue.state)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    // Construit les filtres à envoyer à l'API
    const filters: any = {};
    if (formValue.search) filters.search = formValue.search;
    if (operationType.length > 0) filters.operation_type = operationType;
    if (state.length > 0) filters.state = state;

    if (formValue.min_price !== null) {
      filters.min_price = formValue.min_price;
    }
    if (formValue.max_price !== null) {
      filters.max_price = formValue.max_price;
    }

    // Met à jour les paramètres d'URL avec les filtres
    const queryParams: any = {
      page,
      ...(filters.search && { search: filters.search }),
      ...(operationType.length > 0 && { operation_type: operationType.join(',') }),
      ...(state.length > 0 && { state: state.join(',') }),
      ...(filters.min_price != null && { min_price: filters.min_price }),
      ...(filters.max_price != null && { max_price: filters.max_price }),
    };

    // Met à jour l'URL sans conserver les anciens paramètres
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });

    // Affiche les filtres dans la console (debug)
    console.log('Filtres envoyés:', filters);

    // Appel au service pour récupérer les annonces filtrées
    this.announcementService.getAnnouncements(undefined, page, filters).subscribe({
      next: (res) => {
        this.announcements = res.data;
        this.paginationMeta = res.meta;
        this.paginationUrls = res.links;
        this.noResults = this.announcements.length === 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des annonces :', err);
        this.isLoading = false;
        this.noResults = true;
      },
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid) {
      this.errorMessage = "le prix maximum ne peut pas être inférieur au prix minimum"
      console.error('Erreur : max_price ne peut pas être inférieur à min_price');
      setTimeout(() =>{
        this.errorMessage = ''
      }, 5000)
      return;
    }
    else{
      this.successMessage = 'Filtre(s) appliqué(s)'
      setTimeout(() =>{
        this.successMessage = ''
      }, 2000)
      this.getAnnouncements();
    }
  }

  onPageChange(url: string | null | undefined): void {
    // Si pas d’URL fournie, on sort
    if (!url) return;

    // Extrait la valeur de la page depuis l’URL
    const pageParam = new URL(url).searchParams.get('page');
    const page = pageParam ? +pageParam : 1;

    // Recharge les annonces pour cette page
    this.getAnnouncements(page);
  }

  toggleFilters(): void {
    // Inverse l’état d’ouverture des filtres
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  private mapToCheckboxObject(values: string[]): any {
    // Retourne un objet avec true/false selon les éléments présents dans le tableau
    return {
      sale: values.includes('sale'),
      exchange: values.includes('exchange'),
      don: values.includes('don'),
      new: values.includes('new'),
      like_new: values.includes('like_new'),
      used: values.includes('used'),
    };
  }

  onResetFilters(): void {
    // Réinitialise complètement le formulaire avec les valeurs par défaut
    this.filterForm.reset({
      search: '',
      operation_type: {
        sale: false,
        exchange: false,
        don: false,
      },
      state: {
        new: false,
        like_new: false,
        used: false,
      },
      min_price: null,
      max_price: null,
    });

    // Réinitialise complètement l'URL, ne garde que page=1
    this.router.navigate(
      ['/annoncement-gallery'],
      {
        queryParams: { page: 1 },
        queryParamsHandling: '',
        replaceUrl: true,
      }
    ).then(() => {
      // Recharge les annonces après nettoyage de l’URL
      this.getAnnouncements(1);
    });

    // Ferme le menu des filtres
    this.isFiltersOpen = false;
    this.successMessageReset = 'Filtre(s) renitialiser'
    setTimeout(()=>{
      this.successMessageReset = ''
    }, 2000)
  }
}
