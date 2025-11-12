import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GrabacionMovimientoService } from '../services/grabacion-movimiento.service';

interface TipoMovimiento {
  id: number;
  nombre: string;
  operacion: number;
}

interface MovimientoForm {
  usuario: string;
  idSaldoCuenta: number | null;
  idTipoMovimientoCXC: number | null;
  fechaMovimiento: string;
  valorMovimiento: number | null;
  documentoRef: string;
  descripcion: string;
}

@Component({
  selector: 'app-grabacion-movimiento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './grabacion-movimiento.component.html',
  styleUrl: './grabacion-movimiento.component.scss'
})
export class GrabacionMovimientoComponent implements OnInit {
  movimiento: MovimientoForm = {
    usuario: '',
    idSaldoCuenta: null,
    idTipoMovimientoCXC: null,
    fechaMovimiento: '',
    valorMovimiento: null,
    documentoRef: '',
    descripcion: ''
  };

  tipos: TipoMovimiento[] = [];
  loading = false;
  error = '';
  success = '';
  cuentaActiva: boolean | null = null;
  verificandoCuenta = false;
  movimientoCreado: any = null;
  saldoActualizado: any = null;

  constructor(
    private grabacionService: GrabacionMovimientoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarUsuarioActual();
    this.cargarTipos();
    this.movimiento.fechaMovimiento = this.obtenerFechaActual();
  }

  private cargarUsuarioActual(): void {
    const sessionStr = localStorage.getItem('currentUser');
    if (sessionStr) {
      try {
        const sessionObj = JSON.parse(sessionStr);
        this.movimiento.usuario = sessionObj.IdUsuario || 'Desconocido';
      } catch {
        this.movimiento.usuario = 'Desconocido';
      }
    } else {
      this.movimiento.usuario = 'Desconocido';
    }
  }

  private obtenerFechaActual(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  cargarTipos(): void {
    this.grabacionService.obtenerTipos().subscribe({
      next: (tipos) => {
        this.tipos = tipos.map(t => ({
          id: t.IdTipoMovimientoCXC,
          nombre: t.Nombre,
          operacion: t.Operacion
        }));
      },
      error: () => {
        this.error = 'Error al cargar los tipos de movimiento';
      }
    });
  }

  onCuentaChange(): void {
    this.cuentaActiva = null;
    this.error = '';

    if (this.movimiento.idSaldoCuenta && this.movimiento.idSaldoCuenta > 0) {
      this.verificandoCuenta = true;
      this.grabacionService.cuentaActiva(this.movimiento.idSaldoCuenta).subscribe({
        next: (resp) => {
          this.cuentaActiva = !!resp['activa'];
          this.verificandoCuenta = false;
          if (!this.cuentaActiva) {
            this.error = 'La cuenta seleccionada no está activa';
          }
        },
        error: () => {
          this.cuentaActiva = false;
          this.verificandoCuenta = false;
          this.error = 'Error al verificar el estado de la cuenta';
        }
      });
    }
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.movimientoCreado = null;
    this.saldoActualizado = null;

    if (this.cuentaActiva === false) {
      this.error = 'No se puede crear el movimiento. La cuenta no está activa.';
      return;
    }

    if (!this.movimiento.idSaldoCuenta || !this.movimiento.idTipoMovimientoCXC ||
        !this.movimiento.valorMovimiento || this.movimiento.valorMovimiento <= 0) {
      this.error = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    this.loading = true;

    const payload = {
      usuario: this.movimiento.usuario.trim(),
      idSaldoCuenta: this.movimiento.idSaldoCuenta,
      idTipoMovimientoCXC: this.movimiento.idTipoMovimientoCXC,
      fechaMovimiento: this.movimiento.fechaMovimiento,
      valorMovimiento: this.movimiento.valorMovimiento,
      documentoRef: this.movimiento.documentoRef?.trim() || null,
      descripcion: this.movimiento.descripcion?.trim() || null
    };

    this.grabacionService.crear(payload).subscribe({
      next: (resp) => {
        if (resp.resultado === 1) {
          this.success = resp.mensaje || 'Movimiento registrado correctamente';
          this.movimientoCreado = resp['movimiento'];
          this.saldoActualizado = resp['saldo'];

          // Limpiar campos después de crear
          this.movimiento.valorMovimiento = null;
          this.movimiento.documentoRef = '';
          this.movimiento.descripcion = '';
          this.movimiento.fechaMovimiento = this.obtenerFechaActual();
        } else {
          this.error = resp.mensaje || 'Error al registrar el movimiento';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.mensaje || 'Error al registrar el movimiento';
        this.loading = false;
      }
    });
  }

  getTipoNombre(id: number): string {
    const tipo = this.tipos.find(t => t.id === id);
    return tipo ? `${tipo.nombre} (${tipo.operacion === 1 ? 'Cargo' : 'Abono'})` : '';
  }
}
