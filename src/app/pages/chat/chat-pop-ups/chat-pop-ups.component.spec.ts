import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPopUpsComponent } from './chat-pop-ups.component';

describe('ChatPopUpsComponent', () => {
  let component: ChatPopUpsComponent;
  let fixture: ComponentFixture<ChatPopUpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatPopUpsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatPopUpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
