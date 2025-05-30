import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRapideComponent } from './action-rapide.component';

describe('ActionRapideComponent', () => {
  let component: ActionRapideComponent;
  let fixture: ComponentFixture<ActionRapideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionRapideComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionRapideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
