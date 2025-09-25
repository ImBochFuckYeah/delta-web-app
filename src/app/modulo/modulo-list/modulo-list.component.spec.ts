import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloListComponent } from './modulo-list.component';

describe('ModuloListComponent', () => {
  let component: ModuloListComponent;
  let fixture: ComponentFixture<ModuloListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
