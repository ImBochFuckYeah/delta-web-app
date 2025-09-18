import { RolesService } from './../services/roles.service';
import { SucursalService } from './../services/sucursal.service';
import { SucursalNamePipe } from './../pipes/sucursal-name.pipe';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService, UsuarioCrearRequest, UsuarioActualizarRequest } from '../services/usuario.service';
import { GenerosService } from '../services/genero.service';
import { StatusUsuariosService } from '../services/status-usuario.service';
//import { SucursalService } from '../services/sucursal.service';
//import { RolesService } from '../services/roles.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {
  isEdit = false;
  loading = false;
  loadingSucursales = false;
  loadingGeneros = false;
  loadingStatus = false;
statusUsuarios: any[] = [];
   generos: any[] = [];
  usuarioId: string = '';
  sucursales: any[] = [];
  roles: any [] = [];
  loadingRoles = false;
  formData: any = {
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
    this.cargarSucursales();
    this.cargarRoles();
    this.cargarGeneros();
    this.cargarStatusUsuarios();

    if (this.isEdit) {
      this.cargarUsuario();
    }
  }

  cargarStatusUsuarios(): void {
  this.loadingStatus = true;

  const request: any = {
    Pagina: 1,
    TamanoPagina: 100
  };

  this.statusUsuariosService.listar(request).subscribe({
    next: (response) => {
      if (response.ok && response.data) {
        this.statusUsuarios = response.data;
        // Solo seleccionar por defecto si NO es edición
        if (!this.isEdit && this.statusUsuarios.length > 0) {
          this.formData.IdStatusUsuario = this.statusUsuarios[0].IdStatusUsuario;
        }
      } else {
        console.error('❌ Error al cargar status:', response.error);
        this.statusUsuarios = [];
      }
      this.loadingStatus = false;
    },
    error: (error) => {
      console.error('❌ Error al cargar status:', error);
      this.loadingStatus = false;
      this.statusUsuarios = [];
    }
  });
}
    cargarGeneros(): void {
    this.loadingGeneros = true;
    this.generosService.listar({}).subscribe({
      next: (response) => {
        if (response.ok && response.data) {
          this.generos = response.data;
          // Solo seleccionar por defecto si NO es edición
          if (!this.isEdit && this.generos.length > 0) {
            this.formData.IdGenero = this.generos[0].IdGenero;
          }
        }
        this.loadingGeneros = false;
      },
      error: (error) => {
        console.error('Error al cargar géneros:', error);
        this.loadingGeneros = false;
      }
    });
  }



  //   cargarRoles(): void {
  //   this.loadingRoles = true;
  //   this.rolesService.obtenerTodosLosRoles().subscribe({
  //     next: (roles) => {
  //       console.log('Roles recibidos:', roles);
  //       if (Array.isArray(roles)) {
  //         this.roles = roles;
  //         if (!this.isEdit && this.roles.length > 0) {
  //           this.formData.IdRole = this.roles[0].IdRole; // ✅ Seleccionar primer rol por defecto
  //         }
  //       } else {
  //         console.error('Los roles no son un array:', roles);
  //         this.roles = [];
  //       }
  //       this.loadingRoles = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar roles:', error);
  //       this.loadingRoles = false;
  //     }
  //   });
  // }


    onCancel(): void {
    this.router.navigate(['app/usuarios']);
  }


  //   cargarSucursales(): void {
  //   this.loadingSucursales = true;
  //   this.sucursalService.obtenerSucursales().subscribe({
  //     next: (response) => {
  //       if (response.ok) {
  //         this.sucursales = response.data;
  //         // Si no es edición, seleccionar la primera sucursal por defecto
  //         if (!this.isEdit && this.sucursales.length > 0) {
  //           this.formData.IdSucursal = this.sucursales[0].IdSucursal;
  //         }
  //       }
  //       this.loadingSucursales = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar sucursales:', error);
  //       this.loadingSucursales = false;
  //     }
  //   });
  // }

  // Modificar cargarSucursales() y cargarRoles() para manejar mejor la edición
cargarSucursales(): void {
  this.loadingSucursales = true;
  this.sucursalService.obtenerSucursales().subscribe({
    next: (response) => {
      if (response.ok) {
        this.sucursales = response.data;
        // Solo seleccionar por defecto si NO es edición
        if (!this.isEdit && this.sucursales.length > 0) {
          this.formData.IdSucursal = this.sucursales[0].IdSucursal;
        }
      }
      this.loadingSucursales = false;
    },
    error: (error) => {
      console.error('Error al cargar sucursales:', error);
      this.loadingSucursales = false;
    }
  });
}

cargarRoles(): void {
  this.loadingRoles = true;
  this.rolesService.obtenerTodosLosRoles().subscribe({
    next: (roles) => {
      console.log('Roles recibidos:', roles);
      if (Array.isArray(roles)) {
        this.roles = roles;
        // Solo seleccionar por defecto si NO es edición
        if (!this.isEdit && this.roles.length > 0) {
          this.formData.IdRole = this.roles[0].IdRole;
        }
      } else {
        console.error('Los roles no son un array:', roles);
        this.roles = [];
      }
      this.loadingRoles = false;
    },
    error: (error) => {
      console.error('Error al cargar roles:', error);
      this.loadingRoles = false;
    }
  });
}

  // cargarUsuario(): void {
  //   this.loading = true;
  //   this.usuarioService.obtener(this.usuarioId).subscribe({
  //     next: (response) => {
  //       if (response.Exito && response.Datos) {
  //         // Asegurar que todos los campos requeridos tengan valores
  //         this.formData = {
  //           ...this.formData, // Mantener valores por defecto
  //           ...response.Datos, // Sobrescribir con datos del servidor
  //           UsuarioAccion: 'admin' // Siempre incluir para auditoría
  //         };

  //         // Convertir fecha si es necesario
  //         if (this.formData.FechaNacimiento && typeof this.formData.FechaNacimiento === 'string') {
  //           this.formData.FechaNacimiento = this.formData.FechaNacimiento.split('T')[0];
  //         }
  //       }
  //       this.loading = false;
  //     },
  //     error: (error) => {
  //       console.error('Error al cargar usuario:', error);
  //       this.loading = false;
  //       alert('Error al cargar usuario');
  //     }
  //   });
  // }

// En usuario-form.component.ts
cargarUsuario(): void {
  this.loading = true;
  console.log('🔍 Buscando usuario:', this.usuarioId);

  // ✅ SOLUCIÓN TEMPORAL: Buscar en la lista existente
  this.usuarioService.listar({ Buscar: this.usuarioId, TamanoPagina: 1 }).subscribe({
    next: (response) => {
      if (response.Resultado === 1 && response.Items.length > 0) {
        const usuario = response.Items[0];
        console.log('✅ Usuario encontrado en lista:', usuario);


        this.formData = {
          ...this.formData,
          ...usuario,
          UsuarioAccion: 'admin'
        };

        console.log('✅ Formulario lleno:', this.formData);
      } else {
        console.log('❌ Usuario no encontrado en lista');
        alert('Usuario no encontrado');
      }
      this.loading = false;
    },
    error: (error) => {
      console.error('💥 Error al buscar usuario:', error);
      this.loading = false;
    }
  });
}

  onSubmit(): void {
    // Validar campos requeridos para creación
      if (!this.validarEmail(this.formData.CorreoElectronico)) {
    alert('Por favor ingrese un correo electrónico válido');
    return;
  }
    if (!this.isEdit) {
      if (!this.formData.Password) {
        alert('La contraseña es requerida para crear un usuario');
        return;
      }
      if (!this.formData.Respuesta) {
        alert('La respuesta de seguridad es requerida');
        return;
      }
        if (!this.formData.IdGenero || this.formData.IdGenero === 0) {
      alert('Por favor seleccione un género');
      return;
    }
    }

    this.loading = true;

    // Preparar request con formato correcto
    const request = {
      ...this.formData,
      UsuarioAccion: 'admin' // Siempre incluir
    };

    if (this.isEdit) {
      // Para actualizar, quitar campos que no deberían actualizarse
      const { Password, ...updateRequest } = request;
      if (!this.formData.Password) {
        // Si no se proporciona password, no incluirlo en la actualización
        this.usuarioService.actualizar(updateRequest).subscribe({
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      } else {
        // Si se proporciona password, incluirlo
        this.usuarioService.actualizar(request).subscribe({
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => {
            this.handleError(error);
          }
        });
      }
    } else {
      // Para crear, asegurar todos los campos requeridos
      const createRequest: UsuarioCrearRequest = {
        IdUsuario: request.IdUsuario,
        Nombre: request.Nombre,
        Apellido: request.Apellido,
        FechaNacimiento: request.FechaNacimiento || '1990-01-01',
        IdGenero: request.IdGenero || 1,
        CorreoElectronico: request.CorreoElectronico,
        TelefonoMovil: request.TelefonoMovil,
        IdSucursal: request.IdSucursal || 1,
        Pregunta: request.Pregunta || '¿Pregunta de seguridad?',
        Respuesta: request.Respuesta,
        IdRole: request.IdRole || 2,
        Password: request.Password,
        IdStatusUsuario: request.IdStatusUsuario || 1,
        UsuarioAccion: 'admin'
      };

      this.usuarioService.crear(createRequest).subscribe({
        next: (response) => {
          this.handleResponse(response);
        },
        error: (error) => {
          this.handleError(error);
        }
      });
    }
  }

  private handleResponse(response: any): void {
    this.loading = false;

    // El backend usa 'Resultado' en lugar de 'Exito'
    const exito = response.Exito || response.Resultado === 1;
    const mensaje = response.Mensaje || 'Operación completada';

    if (exito) {
      alert('Operación realizada con éxito');
      this.router.navigate(['/app/usuarios']);
    } else {
      alert('Error: ' + mensaje);
    }
  }

  private handleError(error: any): void {
    this.loading = false;
    console.error('Error:', error);

    // Mensaje de error más específico
    let errorMessage = 'Error en la operación';
    if (error.error?.Mensaje) {
      errorMessage = error.error.Mensaje;
    } else if (error.message) {
      errorMessage = error.message;
    }

    alert(errorMessage);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamaño de archivo (ej: máximo 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('La imagen debe ser menor a 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.formData.FotografiaBase64 = e.target.result;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        alert('Error al cargar la imagen');
      };
      reader.readAsDataURL(file);
    }
  }

  // Helper para formatear fecha si es necesario
  private formatDate(date: any): string {
    if (!date) return '1990-01-01';
    if (typeof date === 'string') return date;
    if (date instanceof Date) return date.toISOString().split('T')[0];
    return '1990-01-01';
  }

// En tu usuario-form.component.ts
validarEmail(correo: string): boolean {
  if (!correo) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(correo);
}

}
