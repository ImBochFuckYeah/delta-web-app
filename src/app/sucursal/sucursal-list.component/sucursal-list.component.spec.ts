import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SucursalListComponent } from './sucursal-list.component';

describe('SucursalListComponent', () => {
  let component: SucursalListComponent;
  let fixture: ComponentFixture<SucursalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SucursalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SucursalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
