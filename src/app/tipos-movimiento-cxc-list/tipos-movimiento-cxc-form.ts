import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TiposMovimientoCxcService, BackendResponse, TipoMovDto } from '../services/tipos-movimiento-cxc.service';

@Component({
  selector: 'app-tipos-movimiento-cxc-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipos-movimiento-cxc-form.html',
  styleUrls: ['./tipos-movimiento-cxc-form.css']
})
export class TiposMovCCFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  id = 0;

  // usamos 1 = Cargo, 2 = Abono para el select
  formData: { Nombre: string; Operacion: 1 | 2 } = {
    Nombre: '',
    Operacion: 1
  };

  constructor(
    private service: TiposMovimientoCxcService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.id > 0;
    if (this.isEdit) this.cargar();
  }

  cargar(): void {
    this.loading = true;
    this.service.obtener(this.id).subscribe({
      next: (res: BackendResponse<TipoMovDto>) => {
        // Adaptación para respuesta con objeto directo en Data
        const item = res.Data as any; // Usamos any para manejar la respuesta real del API
        if (item && typeof item === 'object' && !Array.isArray(item)) {
          this.formData.Nombre = item.Nombre;
          // El API devuelve número (1 o 2), lo convertimos al tipo esperado
          this.formData.Operacion = item.OperacionCuentaCorriente as 1 | 2;
        }
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        alert('Error al cargar');
      }
    });
  }

 onSubmit(): void {
  if (!this.formData.Nombre?.trim()) {
    alert('El nombre es requerido');
    return;
  }

  this.loading = true;

  // Normalización
  const nombre = this.formData.Nombre.trim();
  const operacion = Number(this.formData.Operacion); // 1 o 2

  // Elegir observable (crear/actualizar)
  const req$ = this.isEdit
    ? this.service.actualizar(this.id, nombre, operacion)
    : this.service.crear(nombre, operacion);

  console.log('[FORM] Enviando:', { isEdit: this.isEdit, nombre, operacion });

  req$.subscribe({
    next: (r: any) => {
      this.loading = false;
      console.log('[API OK]', r);

      // Soporta distintas formas de éxito
      const ok = r?.Resultado === 1 || r?.ok === true || r?.Exito === true;

      if (ok) {
        alert('Guardado correctamente');
        this.router.navigate(['/app/tipos-movimiento-cxc']);
      } else {
        // Mensaje de negocio (duplicado, validaciones, etc.)
        alert('Error: ' + (r?.Mensaje || r?.error || 'No se pudo guardar'));
      }
    },
    error: (e: any) => {
      this.loading = false;

      // Muestra el mensaje real del backend cuando es 400/500
      const serverMsg =
        e?.error?.Mensaje ||
        e?.error?.message ||
        e?.message ||
        JSON.stringify(e?.error || e);

      console.error('[API ERROR]', e);
      alert('Error al guardar: ' + serverMsg);
    }
  });
}


  onCancel(): void {
    this.router.navigate(['/app/tipos-movimiento-cxc']);
  }
}
