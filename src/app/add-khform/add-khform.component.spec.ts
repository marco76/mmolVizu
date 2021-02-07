import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKHFormComponent } from './add-khform.component';

describe('AddKHFormComponent', () => {
  let component: AddKHFormComponent;
  let fixture: ComponentFixture<AddKHFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKHFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKHFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
