import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodMangementComponent } from './payment-method-mangement.component';

describe('PaymentMethodMangementComponent', () => {
  let component: PaymentMethodMangementComponent;
  let fixture: ComponentFixture<PaymentMethodMangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodMangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
