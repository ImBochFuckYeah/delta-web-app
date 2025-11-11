import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { GrabacionMovimientoService } from '../services/grabacion-movimiento.service';
import { TipoMovimientoDto, CrearMovimientoVm, MovimientoCreado, SaldoResumen } from './movimiento.models';


@Component({
  selector: 'app-grabacion-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './grabacion-movimiento.component.html',
  // styleUrls: ['./grabacion-movimiento.component.css']
})
export class GrabacionMovimientoComponent implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(GrabacionMovimientoService);

  tipos: { id: number; nombre: string; operacion: number }[] = [];
  enviando = false;
  mensaje = '';
  resultado: { mov?: MovimientoCreado; saldo?: SaldoResumen } | null = null;
  cuentaActiva: boolean | null = null;

  form = this.fb.group({
    usuario: ['Administrador', [Validators.required, Validators.maxLength(100)]],
    idSaldoCuenta: [null as number | null, [Validators.required]],
    idTipoMovimientoCXC: [null as number | null, [Validators.required]],
    fechaMovimiento: [this.hoyISO(), [Validators.required]],
    valorMovimiento: [null as number | null, [Validators.required, Validators.min(0.01)]],
    documentoRef: [''],
    descripcion: ['']
  });

  ngOnInit(): void {
    this.cargarTipos();

    // Al cambiar la cuenta, verificar estado
    this.form.get('idSaldoCuenta')!.valueChanges.subscribe(v => {
      this.cuentaActiva = null;
      if (v != null) {
        const id = Number(v);               // <-- asegura número
        if (!Number.isNaN(id)) {
          this.api.cuentaActiva(id).subscribe(r => {
            this.cuentaActiva = !!r['activa'];
          });
        }
      }
    });
  }

  private hoyISO(): string {
    const d = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  cargarTipos() {
    this.api.obtenerTipos().subscribe((list: TipoMovimientoDto[]) => {
      this.tipos = list.map(x => ({
        id: x.IdTipoMovimientoCXC,
        nombre: x.Nombre,
        operacion: x.Operacion
      }));
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.cuentaActiva === false) {
      this.mensaje = 'La cuenta no está activa.';
      return;
    }

    const v = this.form.value;
    const payload: CrearMovimientoVm = {
      usuario: v.usuario!.trim(),
      idSaldoCuenta: Number(v.idSaldoCuenta),
      idTipoMovimientoCXC: Number(v.idTipoMovimientoCXC),
      fechaMovimiento: v.fechaMovimiento!,
      valorMovimiento: Number(v.valorMovimiento),
      documentoRef: v.documentoRef ? v.documentoRef.trim() : null,
      descripcion: v.descripcion ? v.descripcion.trim() : null
    };

    this.enviando = true;
    this.mensaje = '';
    this.resultado = null;

    this.api.crear(payload).subscribe({
      next: r => {
        this.enviando = false;
        if (r.resultado !== 1) {
          this.mensaje = r.mensaje || 'No se pudo registrar el movimiento.';
          return;
        }
        this.mensaje = r.mensaje || 'Movimiento registrado.';
        this.resultado = { mov: r['movimiento'], saldo: r['saldo'] };
        this.form.patchValue({ valorMovimiento: null, documentoRef: '', descripcion: '' });
      },
      error: err => {
        this.enviando = false;
        this.mensaje = (err?.error?.mensaje) || 'Error de red/servidor.';
      }
    });
  }
}
