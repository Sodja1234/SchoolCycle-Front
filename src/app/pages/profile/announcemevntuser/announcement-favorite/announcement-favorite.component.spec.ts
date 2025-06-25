import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementFavoriteComponent } from './announcement-favorite.component';

describe('AnnouncementFavoriteComponent', () => {
  let component: AnnouncementFavoriteComponent;
  let fixture: ComponentFixture<AnnouncementFavoriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementFavoriteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
