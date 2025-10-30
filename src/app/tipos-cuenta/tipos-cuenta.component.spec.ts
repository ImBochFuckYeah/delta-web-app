import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposCuentaComponent } from './tipos-cuenta.component';

describe('TiposCuentaComponent', () => {
  let component: TiposCuentaComponent;
  let fixture: ComponentFixture<TiposCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposCuentaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TiposCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
