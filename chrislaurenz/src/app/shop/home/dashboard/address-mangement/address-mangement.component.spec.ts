import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressMangementComponent } from './address-mangement.component';

describe('AddressMangementComponent', () => {
  let component: AddressMangementComponent;
  let fixture: ComponentFixture<AddressMangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressMangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
