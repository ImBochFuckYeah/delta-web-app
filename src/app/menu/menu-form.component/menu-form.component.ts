import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MenuService, MenuRequest, MenuObj } from '../../services/menu.service';
import { ModuloService, ModuloRequest } from '../../services/modulo.service';

@Component({
  selector: 'app-menu-form.component',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu-form.component.html',
  styleUrl: './menu-form.component.scss'
})
export class MenuFormComponent implements OnInit {
  menu: MenuRequest = {
    Nombre: '',
    IdModulo: undefined,
    OrdenMenu: undefined,
    Usuario: ''
  };
  modulos: ModuloRequest[] = [];
  loading = false;
  error = '';
  success = '';
  editMode = false;
  menuId: number = 0;

  constructor(
    private menuService: MenuService,
    private moduloService: ModuloService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarModulos();
    
    this.menuId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.editMode = this.menuId > 0;
    
    if (this.editMode) {
      this.cargarMenu();
    }
  }

  cargarModulos(): void {
    this.moduloService.listar({ incluirAuditoria: false }).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Items) {
          // Si es un array, usarlo directamente; si es un objeto, convertirlo a array
          this.modulos = Array.isArray(resp.Items) ? resp.Items : [resp.Items];
        } else {
          this.modulos = [];
        }
      },
      error: () => {
        this.modulos = [];
        this.error = 'Error al cargar los módulos';
      }
    });
  }

  cargarMenu(): void {
    this.loading = true;
    const request: MenuRequest = {
      IdMenu: this.menuId,
      usuarioAccion: 'Administrador',
      incluirAuditoria: false
    };

    this.menuService.listar(request).subscribe({
      next: (resp) => {
        if (resp.Resultado === 1 && resp.Data) {
          const menuData = Array.isArray(resp.Data) ? resp.Data[0] : resp.Data;
          this.menu = {
            IdMenu: menuData.IdMenu,
            Nombre: menuData.Nombre,
            IdModulo: menuData.IdModulo,
            OrdenMenu: menuData.OrdenMenu,
            Usuario: ''
          };
        } else {
          this.error = resp.error || 'No se pudo cargar el menú';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar el menú';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    this.success = '';
    this.loading = true;

    // Validación básica
    if (!this.menu.Nombre || !this.menu.IdModulo || !this.menu.OrdenMenu) {
      this.error = 'Todos los campos son obligatorios';
      this.loading = false;
      return;
    }

    if (this.editMode) {
      const updateRequest: MenuRequest = {
        IdMenu: this.menuId,
        Nombre: this.menu.Nombre,
        IdModulo: this.menu.IdModulo,
        OrdenMenu: this.menu.OrdenMenu,
        Usuario: 'Administrador'
      };

      this.menuService.actualizar(updateRequest).subscribe({
        next: (resp) => {
          if (resp.Resultado === 1 && resp.Data) {
            this.success = 'Menú actualizado correctamente';
            setTimeout(() => this.router.navigate(['/app/menus']), 1500);
          } else {
            this.error = resp.error || 'Error al actualizar el menú';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al actualizar el menú';
          this.loading = false;
        }
      });
    } else {
      const createRequest: MenuRequest = {
        Nombre: this.menu.Nombre,
        IdModulo: this.menu.IdModulo,
        OrdenMenu: this.menu.OrdenMenu,
        Usuario: 'Administrador'
      };

      this.menuService.crear(createRequest).subscribe({
        next: (resp) => {
          if (resp.Resultado === 1 && resp.Data) {
            this.success = 'Menú creado correctamente';
            setTimeout(() => this.router.navigate(['/app/menus']), 1500);
          } else {
            this.error = resp.error || 'Error al crear el menú';
          }
          this.loading = false;
        },
        error: () => {
          this.error = 'Error al crear el menú';
          this.loading = false;
        }
      });
    }
  }

  isFormValid(): boolean {
    return !!(this.menu.Nombre && this.menu.IdModulo && this.menu.OrdenMenu && this.menu.OrdenMenu > 0);
  }
}
