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
  templateUrl: './cuenta-form.component.html',
  styleUrls: ['./cuenta-form.component.css']
})
export class CuentaFormComponent implements OnInit {
  model: CuentaDto = { IdPersona: 0, IdTipoSaldoCuenta: 0, IdStatusCuenta: 0, SaldoAnterior: 0 };
  isEdit = false;
  loading = false;
  usuario = 'Administrador';
  displayNombrePersona = '';

  tiposCuenta: TipoSaldoCuenta[] = [];
  statusCuentas: StatusCuenta[] = [];

  personas: PersonaDto[] = [];
  buscarTermino = '';
  mostrandoBuscador = false;
  cargandoPersonas = false;
  personaSeleccionada: PersonaDto | null = null;

  constructor(
    private api: GestionService,
    private tipoSaldoCuentaService: TipoSaldoCuentaService,
    private statusCuentaService: StatusCuentaService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!idParam;
    this.cargarTiposCuenta();
    this.cargarStatusCuenta();

    if (this.isEdit && idParam) {
      const id = parseInt(idParam, 10);
      this.cargarCuenta(id);
    }
  }

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

  seleccionarPersona(p: any): void {
    const nombre = p.Nombre || p.nombre || p.NombrePersona || '';
    const apellido = p.Apellido || p.apellido || p.ApellidoPersona || '';

    this.model.IdPersona = p.IdPersona ?? 0;
    this.personaSeleccionada = {
      IdPersona: p.IdPersona ?? 0,
      Nombre: nombre,
      Apellido: apellido,
      CorreoElectronico: p.CorreoElectronico || ''
    };

    this.buscarTermino = `${nombre} ${apellido}`.trim();
    this.displayNombrePersona = `${nombre} ${apellido}`.trim();
    this.mostrandoBuscador = false;
  }

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


  get nombreTipoCuenta(): string {
  const tipo = this.tiposCuenta.find(t => t.IdTipoSaldoCuenta === this.model.IdTipoSaldoCuenta);
  return tipo ? tipo.Nombre : '';
}


  save() {
  if (!this.model.IdPersona || this.model.IdPersona === 0) {
    alert('Por favor selecciona una persona antes de guardar.');
    return;
  }

  if (!this.model.IdTipoSaldoCuenta || !this.model.IdStatusCuenta) {
    alert('Por favor completa los campos obligatorios.');
    return;
  }

  this.model.SaldoAnterior = 0;
  delete (this.model as any).NoCuenta;
  this.loading = true;

  // ✳️ Separar nombre y apellido automáticamente
  let partes = this.displayNombrePersona.trim().split(' ');
  let nombre = partes.shift() ?? '';
  let apellido = partes.join(' ').trim();

  const actualizarPersona$ = this.isEdit && this.displayNombrePersona.trim()
    ? this.api.actualizarPersona(
        {
          IdPersona: this.model.IdPersona,
          Nombre: nombre, // ✅ solo el primer nombre
          Apellido: apellido || this.personaSeleccionada?.Apellido || '',
          CorreoElectronico: this.personaSeleccionada?.CorreoElectronico ?? ''
        },
        this.usuario
      )
    : null;

  const actualizarCuenta$ = this.isEdit
    ? this.api.actualizarCuenta({ ...(this.model as any), IdSaldoCuenta: this.model.IdSaldoCuenta! }, this.usuario)
    : this.api.crearCuenta(this.model, this.usuario);

  if (actualizarPersona$) {
    actualizarPersona$.subscribe({
      next: (res) => {
        if (res?.Resultado === 1) {
          actualizarCuenta$.subscribe({
            next: (r) => {
              this.loading = false;
              alert(r?.Mensaje ?? 'Cuenta actualizada correctamente');
              this.router.navigate(['/app/saldo-cuentas']);
            },
            error: (e) => {
              this.loading = false;
              alert('Error al actualizar cuenta: ' + e?.message);
            }
          });
        } else {
          this.loading = false;
          alert(res?.Mensaje ?? 'Error al actualizar persona');
        }
      },
      error: (e) => {
        this.loading = false;
        alert('Error al actualizar persona: ' + e?.message);
      }
    });
  } else {
    actualizarCuenta$.subscribe({
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
}


  cancel(): void {
    this.router.navigate(['/app/saldo-cuentas']);
  }

  // private cargarCuenta(id: number): void {
  //   this.loading = true;
  //   this.api.obtenerCuenta(this.usuario, id).subscribe({
  //     next: (r) => {
  //       this.loading = false;
  //       if (r?.Resultado !== 1 || !r?.Data) {
  //         alert(r?.Mensaje ?? 'No se encontró la cuenta.');
  //         return;
  //       }

  //       this.model = {
  //         IdSaldoCuenta: r.Data.IdSaldoCuenta,
  //         IdPersona: r.Data.IdPersona,
  //         IdTipoSaldoCuenta: r.Data.IdTipoSaldoCuenta,
  //         IdStatusCuenta: r.Data.IdStatusCuenta,
  //         SaldoAnterior: 0
  //       };

  //       // ⚡ Si no viene NombrePersona, hacemos una llamada extra
  //       if (!r.Data.NombrePersona && this.model.IdPersona) {
  //         this.api.obtenerPersona(this.usuario, this.model.IdPersona).subscribe({
  //           next: (res) => {
  //             if (res?.Resultado === 1 && res?.Data) {
  //               this.personaSeleccionada = res.Data;
  //               const nombreCompleto = `${res.Data.Nombre ?? ''} ${res.Data.Apellido ?? ''}`.trim();
  //               this.buscarTermino = nombreCompleto;
  //               this.displayNombrePersona = nombreCompleto;
  //             }
  //           },
  //           error: () => console.error('Error obteniendo nombre de persona')
  //         });
  //       } else {
  //         const nombre = r.Data.NombrePersona ?? '';
  //         this.personaSeleccionada = {
  //           IdPersona: r.Data.IdPersona,
  //           Nombre: nombre,
  //           Apellido: '',
  //           CorreoElectronico: ''
  //         };
  //         this.buscarTermino = nombre;
  //         this.displayNombrePersona = nombre;
  //       }
  //     },
  //     error: (err) => {
  //       this.loading = false;
  //       console.error('Error cargando cuenta:', err);
  //       alert('Error al obtener los datos de la cuenta.');
  //     }
  //   });
  // }

private cargarCuenta(id: number): void {
  this.loading = true;
  this.api.obtenerCuenta(this.usuario, id).subscribe({
    next: (r) => {
      this.loading = false;
      if (r?.Resultado !== 1 || !r?.Data) {
        alert(r?.Mensaje ?? 'No se encontró la cuenta.');
        return;
      }

      this.model = {
        IdSaldoCuenta: r.Data.IdSaldoCuenta,
        IdPersona: r.Data.IdPersona,
        IdTipoSaldoCuenta: r.Data.IdTipoSaldoCuenta,
        IdStatusCuenta: r.Data.IdStatusCuenta,
        SaldoAnterior: 0
      };

      // ⚡ Si NO viene NombrePersona, consulta Personas/Obtener
      if (!r.Data.NombrePersona && this.model.IdPersona) {
        this.api.obtenerPersona(this.usuario, this.model.IdPersona).subscribe({
          next: (res) => {
            if (res?.Resultado === 1 && res?.Data) {
              this.personaSeleccionada = res.Data;
              const nombreCompleto = `${res.Data.Nombre ?? ''} ${res.Data.Apellido ?? ''}`.trim();
              this.buscarTermino = nombreCompleto;
              this.displayNombrePersona = nombreCompleto;        // <-- ✅ AQUÍ
            }
          },
          error: () => console.error('Error obteniendo nombre de persona')
        });
      } else {
        // Si SÍ viene el nombre desde Cuentas/Obtener
        const nombre = r.Data.NombrePersona ?? '';
        this.personaSeleccionada = {
          IdPersona: r.Data.IdPersona,
          Nombre: nombre,
          Apellido: '',
          CorreoElectronico: ''
        };
        this.buscarTermino = nombre;
        this.displayNombrePersona = nombre;                     // <-- ✅ Y AQUÍ
      }
    },
    error: (err) => {
      this.loading = false;
      console.error('Error cargando cuenta:', err);
      alert('Error al obtener los datos de la cuenta.');
    }
  });
}


}
