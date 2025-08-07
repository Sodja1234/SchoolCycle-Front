import { Component } from '@angular/core';
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
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '../../../core/models/announcement/category';
import { CategoriesService } from '../../../core/services/categories/categories.service';

@Component({
  selector: 'app-announcement-gallery',
  standalone: true,
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
  announcements: Announcement[] = [];
  categories: Category[] = [];

  paginationMeta!: PaginationMeta;
  paginationUrls!: PaginationUrls;

  isFiltersOpen = false;
  toast = false;
  errorMessage = '';
  successMessage = '';
  successMessageReset = '';
  isLoading = false;
  noResults = false;

  filterForm!: FormGroup;

  constructor(
    private announcementService: AnnouncementService,
    private categoryService: CategoriesService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.filtersCategories(); // Charge aussi les catégories et applique les filtres
  }

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
      category: this.fb.group({}),
      min_price: [null],
      max_price: [null],
    }, {
      validators: [this.priceRangeValidator]
    });
  }

  priceRangeValidator(formGroup: FormGroup) {
    const min = formGroup.get('min_price')?.value;
    const max = formGroup.get('max_price')?.value;
    return (min != null && max != null && max < min) ? { priceRangeInvalid: true } : null;
  }

  paramsFiltre() {
    this.route.queryParams.subscribe(params => {
      const hasFilters =
        params['search'] || params['operation_type'] || params['state'] ||
        params['min_price'] || params['max_price'] || params['categories'];

      const operationTypes = params['operation_type']?.split(',') || [];
      const states = params['state']?.split(',') || [];
      const selectedCategories = params['categories']?.split(',') || [];

      // Patch simple (sans catégories pour l'instant)
      this.filterForm.patchValue({
        search: params['search'] || '',
        min_price: params['min_price'] ? +params['min_price'] : null,
        max_price: params['max_price'] ? +params['max_price'] : null,
      });

      this.filterForm.get('operation_type')?.patchValue(this.mapToCheckboxObject(operationTypes));
      this.filterForm.get('state')?.patchValue(this.mapToCheckboxObject(states));

      // Ici, on patch LES catégories SEULEMENT si le formulaire 'category' est prêt
      const categoryGroup = this.filterForm.get('category') as FormGroup;
      if (categoryGroup) {
        const updated: any = {};
        Object.keys(categoryGroup.controls).forEach(name => {
          updated[name] = selectedCategories.includes(name);
        });
        categoryGroup.patchValue(updated);
      }

      if (hasFilters) this.isFiltersOpen = true;

      this.getAnnouncements(+params['page'] || 1);
    });
  }

  filtersCategories(){
    this.categoryService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data;

        // Initialise dynamiquement le sous-groupe 'category' dans le formulaire
        const categoryControls: { [key: string]: any } = {};
        this.categories.forEach(cat => {
          categoryControls[cat.name] = [false];
        });
        this.filterForm.setControl('category', this.fb.group(categoryControls));

        // Maintenant que tout est prêt, on applique les filtres URL
        this.paramsFiltre();
      },
      error: (err) => {
        console.error(err);
        // Même si erreur, on appelle paramsFiltre pour ne pas bloquer le chargement
        this.paramsFiltre();
      }
    });
  }
  applyCategoryFilter(selectedCategories: string[]) {
    const categoryGroup = this.filterForm.get('category') as FormGroup;
    if (!categoryGroup) return;

    const updated: any = {};
    Object.keys(categoryGroup.controls).forEach(name => {
      updated[name] = selectedCategories.includes(name);
    });
    categoryGroup.patchValue(updated);
  }

  getAnnouncements(page: number = 1) {
    this.isLoading = true;
    const formValue = this.filterForm.value;

    const operationType = Object.entries(formValue.operation_type)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const state = Object.entries(formValue.state)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const category = Object.entries(formValue.category || {})
      .filter(([_, value]) => value)
      .map(([key]) => key);

    const filters: any = {};
    if (formValue.search) filters.search = formValue.search;
    if (operationType.length > 0) filters.operation_type = operationType;
    if (state.length > 0) filters.state = state;
    if (category.length > 0) filters.categories = category;
    if (formValue.min_price !== null) filters.min_price = formValue.min_price;
    if (formValue.max_price !== null) filters.max_price = formValue.max_price;

    const queryParams: any = {
      page,
      ...(filters.search && { search: filters.search }),
      ...(operationType.length > 0 && { operation_type: operationType.join(',') }),
      ...(state.length > 0 && { state: state.join(',') }),
      ...(category.length > 0 && { categories: category.join(',') }),
      ...(filters.min_price != null && { min_price: filters.min_price }),
      ...(filters.max_price != null && { max_price: filters.max_price }),
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: '',
    });

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
      }
    });
  }

  onSubmit(): void {
    if (this.filterForm.invalid) {
      this.errorMessage = "Le prix maximum ne peut pas être inférieur au prix minimum.";
      setTimeout(() => this.errorMessage = '', 5000);
      return;
    }
    this.successMessage = 'Filtre(s) appliqué(s)';
    setTimeout(() => this.successMessage = '', 2000);
    this.getAnnouncements();
  }

  onPageChange(url: string | null | undefined): void {
    if (!url) return;
    const pageParam = new URL(url).searchParams.get('page');
    const page = pageParam ? +pageParam : 1;
    this.getAnnouncements(page);
  }

  toggleFilters(): void {
    this.isFiltersOpen = !this.isFiltersOpen;
  }

  onResetFilters(): void {
    this.filterForm.reset({
      search: '',
      operation_type: { sale: false, exchange: false, don: false },
      state: { new: false, like_new: false, used: false },
      min_price: null,
      max_price: null,
      category: this.fb.group({})
    });

    if (this.categories.length > 0) {
      const categoryGroup: any = {};
      this.categories.forEach(cat => categoryGroup[cat.name] = false);
      this.filterForm.get('category')?.patchValue(categoryGroup);
    }

    this.router.navigate(['/annoncement-gallery'], {
      queryParams: { page: 1 },
      queryParamsHandling: '',
      replaceUrl: true,
    }).then(() => {
      this.getAnnouncements(1);
    });

    this.isFiltersOpen = false;
    this.successMessageReset = 'Filtre(s) réinitialisé(s)';
    setTimeout(() => this.successMessageReset = '', 2000);
  }

  private mapToCheckboxObject(values: string[]): any {
    const result: any = {};
    ['sale', 'exchange', 'don', 'new', 'like_new', 'used'].forEach(key => {
      result[key] = values.includes(key);
    });
    return result;
  }
}
