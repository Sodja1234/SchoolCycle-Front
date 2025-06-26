import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorieCardComponent } from './categorie-card.component';

describe('CategorieCardComponent', () => {
  let component: CategorieCardComponent;
  let fixture: ComponentFixture<CategorieCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorieCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorieCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
