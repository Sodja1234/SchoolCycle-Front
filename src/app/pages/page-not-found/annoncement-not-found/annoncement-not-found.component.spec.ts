import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoncementNotFoundComponent } from './annoncement-not-found.component';

describe('AnnoncementNotFoundComponent', () => {
  let component: AnnoncementNotFoundComponent;
  let fixture: ComponentFixture<AnnoncementNotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnoncementNotFoundComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnoncementNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
