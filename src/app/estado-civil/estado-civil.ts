import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoCivilService } from '../services/estado-civil.service';

@Component({
  selector: 'app-estado-civil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './estado-civil.html',
  styleUrls: ['./estado-civil.css']
})
export class EstadoCivilComponent implements OnInit {
  isEdit = false;
  loading = false;
  estadoCivilId = 0;

  formData: any = {
    Nombre: '',
    UsuarioAccion: 'admin'
  };

  constructor(
    private estadoCivilService: EstadoCivilService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.estadoCivilId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.isEdit = this.estadoCivilId > 0;
    if (this.isEdit) this.cargarEstadoCivil();
  }

  cargarEstadoCivil(): void {
    this.loading = true;
    this.estadoCivilService.obtener(this.estadoCivilId).subscribe({
      next: (response) => {
        if (response?.Mensaje === 'OK' && response?.Resultado === 1 && Array.isArray(response.Items)) {
          const item = response.Items.find((x: any) => x.IdEstadoCivil === this.estadoCivilId) ?? response.Items[0];
          if (item) this.formData = { ...this.formData, ...item };
        }
        this.loading = false;
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        alert('Error al cargar estado civil');
      }
    });
  }

  onSubmit(): void {
    if (!this.formData.Nombre?.trim()) { alert('El nombre es requerido'); return; }
    this.loading = true;

    const req$ = this.isEdit
      ? this.estadoCivilService.actualizar(this.estadoCivilId, this.formData.Nombre)
      : this.estadoCivilService.crear(this.formData.Nombre);

    req$.subscribe({
      next: (response) => this.handleResponse(response),
      error: (error) => this.handleError(error)
    });
  }

onCancel(): void {
  this.router.navigate(['/app/estado-civil']); // <- lista
}

private handleResponse(response: any): void {
  this.loading = false;
  const exito = response?.ok || response?.Exito || response?.Resultado === 1;
  const mensaje = response?.mensaje || response?.Mensaje || 'Operación completada';
  if (exito) {
    alert('Operación realizada con éxito');
    this.router.navigate(['/app/estado-civil']); // <- lista
  } else {
    alert('Error: ' + mensaje);
  }
}

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);
    alert(error?.error?.Mensaje || error?.message || 'Error en la operación');
  }
}

