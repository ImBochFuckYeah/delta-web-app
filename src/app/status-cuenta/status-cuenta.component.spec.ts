import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusCuentaComponent } from './status-cuenta.component';

describe('StatusCuentaComponent', () => {
  let component: StatusCuentaComponent;
  let fixture: ComponentFixture<StatusCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCuentaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatusCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
