import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GestionService } from '../services/gestion.service';

@Component({
  selector: 'app-saldo-consulta',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './saldo-consulta.component.html',
  styleUrls: ['./saldo-consulta.component.css']
})
export class SaldoConsultaComponent {
  usuarioAccion = 'Administrador';
  idSaldoCuenta?: number;
  noCuenta?: string;
  buscarCliente = '';
  saldo: any = null;
  cuentas: any[] = [];
  movs: any[] = [];
  loading = false;

  constructor(private api: GestionService) {}

  consultarPorIdSaldo(){
    if(!this.idSaldoCuenta) return;
    this.loading = true;
    this.api.consultarSaldo(this.usuarioAccion, this.idSaldoCuenta).subscribe({
      next: (r)=> { this.saldo = r; this.cargarMovs(this.idSaldoCuenta!); this.loading=false; },
      error: ()=> this.loading=false
    });
  }

  consultarPorNoCuenta(){
    if(!this.noCuenta) return;
    this.loading = true;
    this.api.obtenerCuentaPorNo(this.usuarioAccion, this.noCuenta!).subscribe({
      next: (r)=> {
        const id = r?.Data?.IdSaldoCuenta ?? r?.IdSaldoCuenta;
        if (id) { this.idSaldoCuenta = id; this.consultarPorIdSaldo(); }
        else this.loading=false;
      }, error: ()=> this.loading=false
    });
  }

  buscarPorCliente(){
    this.loading = true;
    this.api.listarCuentas(this.usuarioAccion, { Buscar: this.buscarCliente, Pagina:1, TamanoPagina:50 }).subscribe({
      next: (r)=> { this.cuentas = r?.Items ?? r?.Data ?? []; this.loading=false; },
      error: ()=> this.loading=false
    });
  }

  cargarMovs(idSaldo: number){
    // EstadoCuenta/Consultar con IdSaldoCuenta (paginación simple)
    this.api.listarMovimientos(this.usuarioAccion, idSaldo, undefined, undefined, 1, 100).subscribe({
      next: (r)=> { this.movs = r?.Items ?? r?.Movimientos ?? r?.Data ?? []; },
      error: ()=> {}
    });
  }
}
