import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MotorradPage } from './motorrad.page';

describe('MotorradPage', () => {
  let component: MotorradPage;
  let fixture: ComponentFixture<MotorradPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MotorradPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
