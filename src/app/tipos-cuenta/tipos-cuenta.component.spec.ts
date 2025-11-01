import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TiposCuentaComponent } from './tipos-cuenta.component';
import { TipoSaldoCuentaService } from '../services/tipo-saldo-cuenta.service';

describe('TiposCuentaComponent', () => {
  let component: TiposCuentaComponent;
  let fixture: ComponentFixture<TiposCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TiposCuentaComponent],
      providers: [
        {
          provide: TipoSaldoCuentaService,
          useValue: {} // Mock del servicio
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') } // Mock del Router
        }
      ]
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
