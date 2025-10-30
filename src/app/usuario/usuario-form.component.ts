import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, UsuarioCrearRequest, UsuarioActualizarRequest } from '../services/usuario.service';
import { GenerosService } from '../services/genero.service';
import { StatusUsuariosService } from '../services/status-usuario.service';
import { RolesService } from '../services/roles.service';
import { SucursalService } from '../services/sucursal.service';

// Interfaces para el tipado
interface UsuarioFormData {
  IdUsuario: string;
  Nombre: string;
  Apellido: string;
  FechaNacimiento: string;
  IdStatusUsuario: number;
  Password: string;
  IdGenero: number;
  CorreoElectronico: string;
  TelefonoMovil: string;
  IdSucursal: number;
  Pregunta: string;
  Respuesta: string;
  IdRole: number;
  FotografiaBase64: string;
  UsuarioAccion: string;
}

interface CatalogoItem {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  // Propiedades de estado
  isEdit = false;
  loading = false;
  usuarioId = '';

  // Estados de carga
  loadingSucursales = false;
  loadingGeneros = false;
  loadingStatus = false;
  loadingRoles = false;

  // Catálogos de datos
  statusUsuarios: any[] = [];
  generos: any[] = [];
  sucursales: any[] = [];
  roles: any[] = [];

  // Datos del formulario con valores por defecto
  formData: UsuarioFormData = {
    IdUsuario: '',
    Nombre: '',
    Apellido: '',
    FechaNacimiento: '', // Formato: yyyy-MM-dd
    IdStatusUsuario: 1,
    Password: '',
    IdGenero: 0, // Valor por defecto requerido
    CorreoElectronico: '',
    TelefonoMovil: '',
    IdSucursal: 0, // Valor por defecto
    Pregunta: '¿Nombre de tu primera mascota?', // Requerido
    Respuesta: '', // Requerido
    IdRole: 0, // Valor por defecto
    FotografiaBase64: '',
    UsuarioAccion: 'admin' // Requerido para auditoría
  };

  constructor(
    private usuarioService: UsuarioService,
    private sucursalService: SucursalService,
    private rolesService: RolesService,
    private generosService: GenerosService,
    private statusUsuariosService: StatusUsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioId = this.route.snapshot.paramMap.get('id') || '';
    this.isEdit = !!this.usuarioId;
    
    // Cargar catálogos en paralelo para mejor performance
    this.cargarCatalogos();

    if (this.isEdit) {
      this.cargarUsuario();
    }
  }

  private cargarCatalogos(): void {
    // Cargar todos los catálogos en paralelo
    this.cargarSucursales();
    this.cargarRoles();
    this.cargarGeneros();
    this.cargarStatusUsuarios();
  }

  cargarStatusUsuarios(): void {
    this.loadingStatus = true;
    const request = { Pagina: 1, TamanoPagina: 100 };

    this.statusUsuariosService.listar(request).subscribe({
      next: (response) => {
        this.statusUsuarios = this.procesarRespuestaCatalogo(response, 'data');
        this.setearValorPorDefecto('IdStatusUsuario', this.statusUsuarios, 'IdStatusUsuario');
        this.loadingStatus = false;
      },
      error: (error) => {
        console.error('Error al cargar estados de usuario:', error);
        this.statusUsuarios = [];
        this.loadingStatus = false;
      }
    });
  }
  cargarGeneros(): void {
    this.loadingGeneros = true;
    this.generosService.listar({}).subscribe({
      next: (response) => {
        this.generos = this.procesarRespuestaCatalogo(response, 'Items');
        this.setearValorPorDefecto('IdGenero', this.generos, 'IdGenero');
        this.loadingGeneros = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.generos = [];
        this.loadingGeneros = false;
      }
    });
  }



  onCancel(): void {
    this.router.navigate(['/app/usuarios']);
  }

  cargarSucursales(): void {
    this.loadingSucursales = true;
    this.sucursalService.obtenerSucursales().subscribe({
      next: (response) => {
        this.sucursales = this.procesarRespuestaCatalogo(response, 'data');
        this.setearValorPorDefecto('IdSucursal', this.sucursales, 'IdSucursal');
        this.loadingSucursales = false;
      },
      error: (error) => {
        console.error('Error al cargar sucursales:', error);
        this.sucursales = [];
        this.loadingSucursales = false;
      }
    });
  }

  cargarRoles(): void {
    this.loadingRoles = true;
    this.rolesService.obtenerTodosLosRoles().subscribe({
      next: (response: any) => {
        // El servicio puede retornar un array directamente o un objeto con Items
        if (Array.isArray(response)) {
          this.roles = response;
        } else if (response && response.Items && Array.isArray(response.Items)) {
          this.roles = response.Items;
        } else {
          console.error('Los roles no tienen el formato esperado:', response);
          this.roles = [];
        }
        
        // Solo seleccionar por defecto si NO es edición
        if (!this.isEdit && this.roles.length > 0) {
          this.formData.IdRole = this.roles[0].IdRole;
        }
        this.loadingRoles = false;
      },
      error: (error) => {
        console.error('Error al cargar roles:', error);
        this.roles = [];
        this.loadingRoles = false;
      }
    });
  }


  cargarUsuario(): void {
    this.loading = true;
    
    this.usuarioService.obtener(this.usuarioId).subscribe({
      next: (response) => {
        if (response.Resultado === 1 && response.Data) {
          const usuario = response.Data;
          this.formData = {
            ...this.formData,
            ...usuario,
            UsuarioAccion: 'admin'
          };
          
          // Formatear fecha para input type="date"
          if (this.formData.FechaNacimiento) {
            this.formData.FechaNacimiento = this.formatearFecha(this.formData.FechaNacimiento);
          }
        } else {
          this.mostrarError('Usuario no encontrado');
          this.onCancel();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener usuario:', error);
        this.mostrarError('Error al cargar los datos del usuario');
        this.loading = false;
      }
    });
  }

  // Métodos de utilidad
  private mostrarError(mensaje: string): void {
    // TODO: Implementar toast notifications en lugar de alert
    alert(mensaje);
  }

  private mostrarExito(mensaje: string): void {
    // TODO: Implementar toast notifications en lugar de alert
    alert(mensaje);
  }

  private formatearFecha(fecha: any): string {
    if (!fecha) return '';
    if (typeof fecha === 'string' && fecha.includes('T')) {
      return fecha.split('T')[0];
    }
    if (fecha instanceof Date) {
      return fecha.toISOString().split('T')[0];
    }
    return fecha;
  }

  onSubmit(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.loading = true;
    const request = this.prepararRequest();

    const operacion$ = this.isEdit 
      ? this.usuarioService.actualizar(request)
      : this.usuarioService.crear(request as UsuarioCrearRequest);

    operacion$.subscribe({
      next: (response) => this.handleResponse(response),
      error: (error) => this.handleError(error)
    });
  }

  private validarFormulario(): boolean {
    const errores: string[] = [];

    // Validaciones básicas
    if (!this.formData.Nombre?.trim()) errores.push('El nombre es requerido');
    if (!this.formData.Apellido?.trim()) errores.push('El apellido es requerido');
    if (!this.formData.CorreoElectronico?.trim()) errores.push('El correo electrónico es requerido');
    if (!this.validarEmail(this.formData.CorreoElectronico)) errores.push('Ingrese un correo electrónico válido');
    
    // Validaciones específicas para creación
    if (!this.isEdit) {
      if (!this.formData.IdUsuario?.trim()) errores.push('El ID de usuario es requerido');
      if (!this.formData.Password?.trim()) errores.push('La contraseña es requerida');
      if (!this.formData.Respuesta?.trim()) errores.push('La respuesta de seguridad es requerida');
      if (!this.formData.IdGenero || this.formData.IdGenero === 0) errores.push('Seleccione un género');
      if (!this.formData.IdSucursal || this.formData.IdSucursal === 0) errores.push('Seleccione una sucursal');
      if (!this.formData.IdRole || this.formData.IdRole === 0) errores.push('Seleccione un rol');
      if (!this.formData.IdStatusUsuario || this.formData.IdStatusUsuario === 0) errores.push('Seleccione un estado');
    }

    if (errores.length > 0) {
      this.mostrarError('Por favor corrija los siguientes errores:\n• ' + errores.join('\n• '));
      return false;
    }

    return true;
  }

  private prepararRequest(): any {
    const request = {
      ...this.formData,
      UsuarioAccion: 'admin'
    };

    // Para edición, manejar el password opcional
    if (this.isEdit && !this.formData.Password?.trim()) {
      const { Password, ...updateRequest } = request;
      return updateRequest;
    }

    return request;
  }

  private handleResponse(response: any): void {
    this.loading = false;
    const exito = response?.Exito || response?.Resultado === 1;
    const mensaje = response?.Mensaje || 'Operación completada';

    if (exito) {
      this.mostrarExito(`Usuario ${this.isEdit ? 'actualizado' : 'creado'} correctamente`);
      this.router.navigate(['/app/usuarios']);
    } else {
      this.mostrarError(`Error: ${mensaje}`);
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error en operación de usuario:', error);
    
    const errorMessage = error?.error?.Mensaje || error?.message || 'Error en la operación';
    this.mostrarError(errorMessage);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      this.mostrarError('Solo se permiten archivos de imagen');
      input.value = '';
      return;
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.mostrarError('La imagen debe ser menor a 2MB');
      input.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.formData.FotografiaBase64 = e.target.result;
    };
    reader.onerror = () => {
      this.mostrarError('Error al cargar la imagen');
      input.value = '';
    };
    reader.readAsDataURL(file);
  }

  private validarEmail(correo: string): boolean {
    if (!correo) return false;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(correo.trim());
  }

  // Métodos de utilidad para manejo de catálogos
  private procesarRespuestaCatalogo(response: any, dataProperty: string): any[] {
    if (response && response.ok && response[dataProperty]) {
      return response[dataProperty];
    }
    if (response && response.Mensaje === "OK" && response.Items) {
      return response.Items;
    }
    return [];
  }

  private setearValorPorDefecto(campo: keyof UsuarioFormData, catalogo: any[], idProperty: string): void {
    if (!this.isEdit && catalogo.length > 0) {
      (this.formData as any)[campo] = catalogo[0][idProperty];
    }
  }

}
