import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GestionService, PersonaDto } from '../services/gestion.service';

@Component({
  selector: 'app-persona-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './persona-list.component.html'
})
export class PersonaListComponent implements OnInit {
  personas: PersonaDto[] = [];
  searchTerm = '';
  loading = false;
  total = 0;
  page = 1;
  pageSize = 10;
  usuarioAccion = 'Administrador'; // trae de tu AuthService

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
}
