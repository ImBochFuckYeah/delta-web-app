// src/app/movimientos/grabacion-movimiento.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GrabacionMovimientoService } from '../services/grabacion-movimiento.service';

@Component({
  selector: 'app-grabacion-movimiento',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './grabacion-movimiento.component.html',
  styleUrls: ['./grabacion-movimiento.component.css']
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

  tipos: TipoMovimientoDto[] = [];
  enviando = false;
  mensaje = '';
  resultado: { mov?: MovimientoCreado; saldo?: SaldoResumen } | null = null;
  cuentaActiva: boolean | null = null;
  verificandoCuenta = false;
  movimientoCreado: any = null;
  saldoActualizado: any = null;

  // 🔒 Usuario quemado
  private usuario = 'Administrador';

  form = this.fb.group({
    idSaldoCuenta: [null as number | null, [Validators.required]],
    idTipoMovimientoCXC: [null as number | null, [Validators.required]],
    fechaMovimiento: [this.hoyISO(), [Validators.required]],
    valorMovimiento: [null as number | null, [Validators.required, Validators.min(0.01)]],
    documentoRef: [''],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargarUsuarioActual();
    this.cargarTipos();
    this.movimiento.fechaMovimiento = this.obtenerFechaActual();
  }

    // Al cambiar cuenta, verifica si está activa
    this.form.get('idSaldoCuenta')!.valueChanges.subscribe((v) => {
      this.cuentaActiva = null;
      if (v != null) {
        const id = Number(v);
        if (!Number.isNaN(id)) {
          this.api.cuentaActiva(id).subscribe({
            next: (r) => (this.cuentaActiva = !!r['activa']),
            error: () => (this.cuentaActiva = null)
          });
        }
      }
    } else {
      this.movimiento.usuario = 'Desconocido';
    }
  }

  private obtenerFechaActual(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}:00`;
  }

  cargarTipos(): void {
    this.api.obtenerTipos().subscribe({
      next: (list: TipoMovimientoDto[]) => {
        this.tipos = list;
      },
      error: (e) => {
        console.error('Error al cargar tipos de movimiento:', e);
        alert('Error al cargar los tipos de movimiento.');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.cuentaActiva === false) {
      this.error = 'No se puede crear el movimiento. La cuenta no está activa.';
      return;
    }

    if (!this.movimiento.idSaldoCuenta || !this.movimiento.idTipoMovimientoCXC ||
        !this.movimiento.valorMovimiento || this.movimiento.valorMovimiento <= 0) {
      this.error = 'Por favor complete todos los campos requeridos correctamente';
      return;
    }

    const v = this.form.value;
    const payload: CrearMovimientoVm = {
      usuario: this.usuario,
      idSaldoCuenta: Number(v.idSaldoCuenta),
      idTipoMovimientoCXC: Number(v.idTipoMovimientoCXC),
      fechaMovimiento: v.fechaMovimiento!,
      valorMovimiento: Number(v.valorMovimiento),
      documentoRef: v.documentoRef ? v.documentoRef.trim() : null,
      descripcion: v.descripcion ? v.descripcion.trim() : null
    };

    this.grabacionService.crear(payload).subscribe({
      next: (resp) => {
        if (resp.resultado === 1) {
          this.success = resp.mensaje || 'Movimiento registrado correctamente';
          this.movimientoCreado = resp['movimiento'];
          this.saldoActualizado = resp['saldo'];

    this.api.crear(payload).subscribe({
      next: (r) => {
        this.enviando = false;
        if (r.resultado !== 1) {
          this.mensaje = r.mensaje || 'No se pudo registrar el movimiento.';
          return;
        }
        this.mensaje = r.mensaje || 'Movimiento registrado exitosamente.';
        this.resultado = { mov: r['movimiento'], saldo: r['saldo'] };
        this.form.patchValue({ valorMovimiento: null, documentoRef: '', descripcion: '' });
      },
      error: (err) => {
        this.enviando = false;
        this.mensaje = (err?.error?.mensaje) || 'Error de red o servidor.';
      }
    });
  }

  getTipoNombre(id: number): string {
    const tipo = this.tipos.find(t => t.id === id);
    return tipo ? `${tipo.nombre} (${tipo.operacion === 1 ? 'Cargo' : 'Abono'})` : '';
  }
}
