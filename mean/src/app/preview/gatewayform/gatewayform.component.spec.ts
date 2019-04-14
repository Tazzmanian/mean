import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GatewayformComponent } from './gatewayform.component';

describe('GatewayformComponent', () => {
  let component: GatewayformComponent;
  let fixture: ComponentFixture<GatewayformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GatewayformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GatewayformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
