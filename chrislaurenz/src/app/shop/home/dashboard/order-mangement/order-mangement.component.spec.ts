import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMangementComponent } from './order-mangement.component';

describe('OrderMangementComponent', () => {
  let component: OrderMangementComponent;
  let fixture: ComponentFixture<OrderMangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
