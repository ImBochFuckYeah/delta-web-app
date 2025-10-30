import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesFormComponent } from './opciones-form.component';

describe('OpcionesFormComponent', () => {
  let component: OpcionesFormComponent;
  let fixture: ComponentFixture<OpcionesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});