import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementSingleComponent } from './announcement-single.component';

describe('AnnouncementSingleComponent', () => {
  let component: AnnouncementSingleComponent;
  let fixture: ComponentFixture<AnnouncementSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementSingleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
