import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService, PersonaDto } from '../services/gestion.service';
import { GenerosService, GeneroDto } from '../services/genero.service';
import { EstadoCivilService, EstadoCivilDto } from '../services/estado-civil.service';
import { TipoDocumentoService, TipoDocumento } from '../services/tipo-documento.service';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-form.component.html'
})
export class PersonaFormComponent implements OnInit {
  model: PersonaDto = {
    Nombre: '',
    IdGenero: null,
    IdEstadoCivil: null,
    DocumentosJson: ''
  };

  generos: GeneroDto[] = [];
  estadosCiviles: EstadoCivilDto[] = [];
  tiposDocumento: TipoDocumento[] = [];
  documentos: { IdTipoDocumento: number | null; NoDocumento: string }[] = [];

  loading = false;
  isEdit = false;
  usuario = 'Administrador';

  constructor(
    private api: GestionService,
    private generoService: GenerosService,
    private estadoCivilService: EstadoCivilService,
    private tipoDocumentoService: TipoDocumentoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarGeneros();
    this.cargarEstadosCiviles();
    this.cargarTiposDocumento();

    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;

    if (this.isEdit) {
      this.loading = true;
      this.api.obtenerPersona(this.usuario, Number(id), undefined, true).subscribe({
        next: (r) => {
          this.loading = false;
          if (r?.Data) {
            this.model = { ...r.Data };
            try {
              this.documentos = JSON.parse(this.model.DocumentosJson || '[]');
            } catch {
              this.documentos = [];
            }
          }
        },
        error: () => (this.loading = false),
      });
    }
  }

  // 🔹 Cargar géneros
  cargarGeneros(): void {
    this.generoService.listar({ BuscarNombre: '', Pagina: 1, TamanoPagina: 50 }).subscribe({
      next: (resp: any) => {
        if (resp.Resultado === 1 && resp.Items?.length > 0) {
          this.generos = resp.Items;
        }
      },
      error: (err) => {
        console.error('Error cargando géneros:', err);
        alert('Error al obtener la lista de géneros.');
      }
    });
  }

  // 🔹 Cargar estados civiles
  cargarEstadosCiviles(): void {
    this.estadoCivilService.listar({ BuscarNombre: '', Pagina: 1, TamanoPagina: 50 }).subscribe({
      next: (resp: any) => {
        if (resp.Resultado === 1 && resp.Items?.length > 0) {
          this.estadosCiviles = resp.Items;
        }
      },
      error: (err) => {
        console.error('Error cargando estados civiles:', err);
        alert('Error al obtener los estados civiles.');
      }
    });
  }

  // 🔹 Cargar tipos de documento
  cargarTiposDocumento(): void {
    this.tipoDocumentoService.listarBusqueda('', 1, 50).subscribe({
      next: (r) => {
        if (r.Resultado === 1) this.tiposDocumento = r.Items || [];
      },
      error: (e) => console.error('Error cargando tipos de documento', e),
    });
  }

  // 🔹 Agregar o eliminar documentos
  agregarDocumento(): void {
    this.documentos.push({ IdTipoDocumento: null, NoDocumento: '' });
  }

  eliminarDocumento(i: number): void {
    this.documentos.splice(i, 1);
  }

  // 🔹 Guardar persona
  save(): void {
    // Validaciones mínimas
    if (!this.model.Nombre || !this.model.Apellido || !this.model.IdGenero || !this.model.IdEstadoCivil) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (this.documentos.length === 0 || this.documentos.some(d => !d.IdTipoDocumento || !d.NoDocumento.trim())) {
      alert('Debes agregar al menos un documento válido.');
      return;
    }

    // Convertir documentos a JSON
    this.model.DocumentosJson = JSON.stringify(this.documentos);

    this.loading = true;

    const req$ = this.isEdit
      ? this.api.actualizarPersona(
          { ...(this.model as any), IdPersona: this.model.IdPersona! },
          this.usuario,
          true
        )
      : this.api.crearPersona(this.model, this.usuario);

    req$.subscribe({
      next: (r) => {
        this.loading = false;
        alert(r?.Mensaje ?? 'Guardado correctamente.');
        this.router.navigate(['/app/personas']);
      },
      error: (e) => {
        this.loading = false;
        console.error('Error guardando:', e);
        alert('Error guardando: ' + e?.message);
      }
    });
  }

    cancel(): void {
    this.router.navigate(['/app/personas']);
  }
}
