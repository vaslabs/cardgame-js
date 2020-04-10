import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCardsViewComponent } from './all-cards-view.component';

describe('AllCardsViewComponent', () => {
  let component: AllCardsViewComponent;
  let fixture: ComponentFixture<AllCardsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCardsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCardsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
