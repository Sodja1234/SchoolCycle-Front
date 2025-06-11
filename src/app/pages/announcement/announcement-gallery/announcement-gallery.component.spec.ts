import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementGalleryComponent } from './announcement-gallery.component';

describe('AnnouncementGalleryComponent', () => {
  let component: AnnouncementGalleryComponent;
  let fixture: ComponentFixture<AnnouncementGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
