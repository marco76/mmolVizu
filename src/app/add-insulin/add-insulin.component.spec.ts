import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInsulinComponent } from './add-insulin.component';

describe('AddInsulinComponent', () => {
  let component: AddInsulinComponent;
  let fixture: ComponentFixture<AddInsulinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddInsulinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInsulinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
