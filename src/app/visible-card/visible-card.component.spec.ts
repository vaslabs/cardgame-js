import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibleCardComponent } from './visible-card.component';

describe('VisibleCardComponent', () => {
  let component: VisibleCardComponent;
  let fixture: ComponentFixture<VisibleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisibleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisibleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
