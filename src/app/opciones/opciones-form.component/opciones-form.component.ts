import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OpcionesService, OpcionesRequest, OpcionesObj } from '../../services/opciones.service';
import { MenuService, MenuObj } from '../../services/menu.service';

@Component({
  selector: 'app-opciones-form.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './opciones-form.component.html',
  styleUrl: './opciones-form.component.scss'
})
export class OpcionesFormComponent implements OnInit {
  opcion: OpcionesRequest = {
    Nombre: '',
    IdMenu: undefined,
    Pagina: '',
    OrdenMenu: undefined,
    Usuario: ''
  };
  menus: MenuObj[] = [];
  loading = false;
  error = '';
  success = '';
  editMode = false;
  opcionId: number = 0;

  constructor(
    private opcionesService: OpcionesService,
    private menuService: MenuService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarMenus();
    
    this.opcionId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editMode = this.opcionId > 0;
    
    if (this.editMode) {
      this.cargarOpcion();
    }
  }

  cargarMenus(): void {
    this.menuService.listarBusqueda({
      usuarioAccion: 'Administrador',
      Pagina: 1,
      TamanoPagina: 100,
      OrdenPor: 'Nombre',
      OrdenDir: 'ASC'
    }).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          this.menus = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
        } else {
          this.menus = [];
        }
      },
      error: () => {
        this.menus = [];
        this.error = 'Error al cargar los menús';
      }
    });
  }

  cargarOpcion(): void {
    this.loading = true;
    const request: OpcionesRequest = {
      IdOpcion: this.opcionId,
      usuarioAccion: 'Administrador',
      incluirAuditoria: false
    };

    this.opcionesService.listar(request).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Data) {
          const opcionData =  Array.isArray(resp.Data) ? resp.Data[0] : resp.Data;
          this.opcion = {
            IdOpcion: opcionData.IdOpcion,
            Nombre: opcionData.Nombre,
            IdMenu: opcionData.IdMenu,
            Pagina: opcionData.Pagina,
            OrdenMenu: opcionData.OrdenMenu,
            Usuario: ''
          };
        } else {
          this.error = resp.error || 'No se pudo cargar la opción';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar la opción';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    // Validación básica
    if (!this.opcion.Nombre || !this.opcion.IdMenu || !this.opcion.Pagina || !this.opcion.OrdenMenu) {
      this.error = 'Todos los campos son obligatorios';
      this.loading = false;
      return;
    }

    if (this.editMode) {
      const updateRequest: OpcionesRequest = {
        IdOpcion: this.opcionId,
        Nombre: this.opcion.Nombre,
        IdMenu: this.opcion.IdMenu,
        Pagina: this.opcion.Pagina,
        OrdenMenu: this.opcion.OrdenMenu,
        Usuario: 'Administrador'
      };

      this.opcionesService.actualizar(updateRequest).subscribe({
        next: (resp) => {
          if (resp.ok || resp.Resultado === 1) {
            this.success = 'Opción actualizada correctamente';
            setTimeout(() => this.router.navigate(['/app/opciones']), 1500);
          } else {
            this.error = resp.error || resp.Mensaje || 'Error al actualizar la opción';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al actualizar la opción';
          this.loading = false;
        }
      });
    } else {
      const createRequest: OpcionesRequest = {
        Nombre: this.opcion.Nombre,
        IdMenu: this.opcion.IdMenu,
        Pagina: this.opcion.Pagina,
        OrdenMenu: this.opcion.OrdenMenu,
        Usuario: 'Administrador'
      };

      this.opcionesService.crear(createRequest).subscribe({
        next: (resp) => {
          if (resp.ok || resp.Resultado === 1) {
            this.success = 'Opción creada correctamente';
            setTimeout(() => this.router.navigate(['/app/opciones']), 1500);
          } else {
            this.error = resp.error || resp.Mensaje || 'Error al crear la opción';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear la opción';
          this.loading = false;
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.opcion.Nombre && this.opcion.IdMenu && this.opcion.Pagina && this.opcion.OrdenMenu && this.opcion.OrdenMenu > 0);
  }
}