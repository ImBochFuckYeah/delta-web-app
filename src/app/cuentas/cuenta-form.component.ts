import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService, CuentaDto } from '../services/gestion.service';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta-form.component.html'
})
export class CuentaFormComponent implements OnInit {
  model: CuentaDto = { IdPersona: 0, IdTipoSaldoCuenta: 0, IdStatusCuenta: 0, SaldoAnterior: 0 };
  isEdit = false;
  loading = false;
  usuario = 'Administrador';

  constructor(private api: GestionService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    if (this.isEdit) {
      // Si tu API tiene /Cuentas/Obtener?IdSaldoCuenta, reemplaza por ese endpoint:
      this.api.obtenerCuentaPorNo(this.usuario, '').subscribe({next:()=>{}, error:()=>{}});
      // O simplemente carga por /EstadoCuenta/Consultar si necesitas datos + movimientos
    }
  }

  save(){
    this.loading = true;
    const req$ = this.isEdit
      ? this.api.actualizarCuenta({ ...(this.model as any), IdSaldoCuenta: this.model.IdSaldoCuenta! }, this.usuario)
      : this.api.crearCuenta(this.model, this.usuario);

    req$.subscribe({
      next: (r)=> { this.loading=false; alert(r?.Mensaje ?? 'Guardado'); this.router.navigate(['/app/cuentas']); },
      error: (e)=> { this.loading=false; alert('Error guardando: ' + e?.message); }
    });
  }
}
