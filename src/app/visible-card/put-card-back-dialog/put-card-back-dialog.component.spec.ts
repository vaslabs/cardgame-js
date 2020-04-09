import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PutCardBackDialogComponent } from './put-card-back-dialog.component';

describe('PutCardBackDialogComponent', () => {
  let component: PutCardBackDialogComponent;
  let fixture: ComponentFixture<PutCardBackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PutCardBackDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PutCardBackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
