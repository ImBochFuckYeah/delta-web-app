import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpcionesListComponent } from './opciones-list.component';

describe('OpcionesListComponent', () => {
  let component: OpcionesListComponent;
  let fixture: ComponentFixture<OpcionesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OpcionesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpcionesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});