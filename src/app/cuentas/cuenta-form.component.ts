import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService, CuentaDto, PersonaDto } from '../services/gestion.service';
import { TipoSaldoCuentaService, TipoSaldoCuenta } from '../services/tipo-saldo-cuenta.service';
import { StatusCuentaService, StatusCuenta } from '../services/status-cuenta.service';

@Component({
  selector: 'app-cuenta-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta-form.component.html'
})
export class CuentaFormComponent implements OnInit {
  model: CuentaDto = { IdPersona: 0, IdTipoSaldoCuenta: 0, IdStatusCuenta: 0, SaldoAnterior: 0, NoCuenta: '' };
  isEdit = false;
  loading = false;
  usuario = 'Administrador';

  // 🔹 Nuevas listas
  tiposCuenta: TipoSaldoCuenta[] = [];
  statusCuentas: StatusCuenta[] = [];

  // 🔹 Buscador de persona
  personas: PersonaDto[] = [];
  buscarTermino = '';
  mostrandoBuscador = false;
  cargandoPersonas = false;

  // 🔹 Persona seleccionada (para control)
  personaSeleccionada: PersonaDto | null = null;

  constructor(
    private api: GestionService,
    private tipoSaldoCuentaService: TipoSaldoCuentaService,
    private statusCuentaService: StatusCuentaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   this.isEdit = !!id;

  //   if (this.isEdit) {
  //     // Si deseas implementar edición de cuenta
  //     this.api.obtenerCuentaPorNo(this.usuario, '').subscribe({ next: () => {}, error: () => {} });
  //   }

  //   this.cargarTiposCuenta();
  //   this.cargarStatusCuenta();
  // }

  ngOnInit(): void {
  const idParam = this.route.snapshot.paramMap.get('id');
  this.isEdit = !!idParam;

  // 🔹 Carga los combos antes (para evitar errores de binding)
  this.cargarTiposCuenta();
  this.cargarStatusCuenta();

  // 🔹 Si estamos editando, obtener los datos del backend
  if (this.isEdit && idParam) {
    const id = parseInt(idParam, 10);
    this.cargarCuenta(id);
  }
}

  // ================================
  // 🔍 Buscar personas
  // ================================
  buscarPersonas(): void {
    if (!this.buscarTermino.trim()) {
      this.mostrandoBuscador = false;
      this.personas = [];
      return;
    }

    this.cargandoPersonas = true;
    this.api.listarPersonas(this.usuario, this.buscarTermino, 1, 10).subscribe({
      next: (r) => {
        this.personas = r?.Items ?? r?.Data ?? [];
        this.cargandoPersonas = false;
        this.mostrandoBuscador = true;
      },
      error: () => {
        this.cargandoPersonas = false;
        alert('Error al buscar personas.');
      }
    });
  }

  seleccionarPersona(p: PersonaDto): void {
    this.model.IdPersona = p.IdPersona ?? 0;
    this.personaSeleccionada = p; // ✅ guardamos referencia
    this.buscarTermino = `${p.Nombre} ${p.Apellido}`;
    this.mostrandoBuscador = false;
  }

  // ================================
  // 🔹 Cargar combos
  // ================================
  cargarTiposCuenta(): void {
    this.tipoSaldoCuentaService.listarBusqueda('', 1, 50).subscribe({
      next: (r) => {
        if (r.Resultado === 1) this.tiposCuenta = r.Items || [];
      },
      error: (e) => console.error('Error cargando tipos de cuenta:', e)
    });
  }

  cargarStatusCuenta(): void {
    this.statusCuentaService.listarBusqueda('', 1, 50).subscribe({
      next: (r) => {
        if (r.Resultado === 1) this.statusCuentas = r.Items || [];
      },
      error: (e) => console.error('Error cargando status cuenta:', e)
    });
  }

  // ================================
  // 💾 Guardar / Actualizar
  // ================================
  save() {
    // 🔒 refuerzo: validamos que haya persona seleccionada
    if (!this.model.IdPersona || this.model.IdPersona === 0) {
      alert('Por favor selecciona una persona antes de guardar.');
      return;
    }
    if (!this.model.IdTipoSaldoCuenta || !this.model.IdStatusCuenta) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    this.loading = true;
    const req$ = this.isEdit
      ? this.api.actualizarCuenta({ ...(this.model as any), IdSaldoCuenta: this.model.IdSaldoCuenta! }, this.usuario)
      : this.api.crearCuenta(this.model, this.usuario);

    req$.subscribe({
      next: (r) => {
        this.loading = false;
        alert(r?.Mensaje ?? 'Cuenta guardada correctamente');
        this.router.navigate(['/app/saldo-cuentas']);
      },
      error: (e) => {
        this.loading = false;
        alert('Error guardando cuenta: ' + e?.message);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/app/saldo-cuentas']);
  }

  private cargarCuenta(id: number): void {
  this.loading = true;
  this.api.obtenerCuenta(this.usuario, id).subscribe({
    next: (r) => {
      this.loading = false;
      if (r?.Resultado !== 1 || !r?.Data) {
        alert(r?.Mensaje ?? 'No se encontró la cuenta.');
        return;
      }

      // 🔹 Asignamos los valores recibidos
      this.model = {
        IdSaldoCuenta: r.Data.IdSaldoCuenta,
        IdPersona: r.Data.IdPersona,
        IdTipoSaldoCuenta: r.Data.IdTipoSaldoCuenta,
        IdStatusCuenta: r.Data.IdStatusCuenta,
        SaldoAnterior: r.Data.SaldoAnterior,
        NoCuenta: r.Data.NoCuenta ?? ''
      };

      // 🔹 Para mostrar el nombre de la persona seleccionada
      this.personaSeleccionada = {
        IdPersona: r.Data.IdPersona,
        Nombre: r.Data.NombrePersona ?? '',
        Apellido: '',
        CorreoElectronico: ''
      };

      this.buscarTermino = this.personaSeleccionada.Nombre;
    },
    error: (err) => {
      this.loading = false;
      console.error('Error cargando cuenta:', err);
      alert('Error al obtener los datos de la cuenta.');
    }
  });
}

}
