import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordMangementComponent } from './change-password-mangement.component';

describe('ChangePasswordMangementComponent', () => {
  let component: ChangePasswordMangementComponent;
  let fixture: ComponentFixture<ChangePasswordMangementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePasswordMangementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordMangementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
