import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GestionService, PersonaDto } from '../services/gestion.service';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './persona-list.component.html',
  styleUrls: ['./persona-list.component.css']
})
export class PersonaListComponent implements OnInit {
  personas: PersonaDto[] = [];
  searchTerm = '';
  loading = false;
  total = 0;
  page = 1;
  pageSize = 10;
  usuarioAccion = 'Administrador'; // trae de tu AuthService
  documentos: any[] = [];
personaSeleccionada: PersonaDto | null = null;
mostrandoModal = false;

  constructor(private api: GestionService) {}

  ngOnInit(): void { this.cargar(); }

  cargar() {
    this.loading = true;
    this.api.listarPersonas(this.usuarioAccion, this.searchTerm, this.page, this.pageSize).subscribe({
      next: (r) => {
        this.personas = r?.Items ?? r?.Data ?? [];
        this.total = r?.Total ?? 0;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }
  onSearch(){ this.page = 1; this.cargar(); }
  onPageChange(p:number){ this.page = p; this.cargar(); }

  eliminar(id: number){
    if(!confirm('¿Eliminar persona?')) return;
    this.api.eliminarPersona(this.usuarioAccion, id).subscribe({
      next: (r) => { alert(r?.Mensaje ?? 'Eliminado'); this.cargar(); },
      error: (e) => alert('Error eliminando: ' + e?.message)
    });
  }

  get totalPages(){ return Math.ceil(this.total / this.pageSize); }
  get pages(){ return Array.from({length: this.totalPages}, (_,i)=>i+1); }

abrirDocumentos(p: PersonaDto) {
  this.personaSeleccionada = p;
  this.mostrandoModal = true;
  this.documentos = [];

  this.api.obtenerDocumentosPersona(this.usuarioAccion, p.IdPersona!).subscribe({
    next: (r) => {
      console.log('📄 Respuesta completa:', r);

      if (r?.Resultado === 1 && Array.isArray(r.Documentos)) {
        // ✅ Si el backend devuelve el arreglo Documentos
        this.documentos = r.Documentos.map((d: any) => ({
          TipoDocumento: d.TipoDocumento,
          Numero: d.NoDocumento
        }));
      } else if (r?.Data?.DocumentosJson) {
        // 🔁 Compatibilidad si algún día vuelve a usarse DocumentosJson
        try {
          const docs = JSON.parse(r.Data.DocumentosJson);
          this.documentos = docs.map((d: any) => ({
            TipoDocumento: this.obtenerNombreTipoDocumento(d.IdTipoDocumento),
            Numero: d.NoDocumento
          }));
        } catch {
          this.documentos = [];
        }
      } else {
        console.warn('⚠️ No se encontraron documentos en la respuesta');
      }
    },
    error: (e) => {
      console.error('Error al cargar documentos:', e);
      alert('Error al cargar documentos.');
    }
  });
}

obtenerNombreTipoDocumento(idTipo: number): string {
  switch (idTipo) {
    case 1: return 'DPI';
    case 2: return 'Pasaporte';
    case 3: return 'Licencia';
    case 4: return 'Licencia de Conducir';
    default: return `Tipo #${idTipo}`;
  }
}



cerrarModal() {
  this.mostrandoModal = false;
  this.personaSeleccionada = null;
  this.documentos = [];
}
}
