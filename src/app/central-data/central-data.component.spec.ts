import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralDataComponent } from './central-data.component';

describe('CentralDataComponent', () => {
  let component: CentralDataComponent;
  let fixture: ComponentFixture<CentralDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentralDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CentralDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
