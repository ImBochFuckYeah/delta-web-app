import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { GestionService } from '../services/gestion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cuenta-list.component.html'
})
export class CuentaListComponent implements OnInit {
  data: any[] = [];
  loading = false;
  usuarioAccion = 'Administrador';
  buscar = '';
  idPersona?: number;
  page=1; pageSize=10; total=0;

  constructor(private api: GestionService,
    private router: Router
  ) {}

  ngOnInit(): void { this.cargar(); }

  cargar(){
    this.loading=true;
    this.api.listarCuentas(this.usuarioAccion, {
      IdPersona: this.idPersona, Buscar: this.buscar, Pagina: this.page, TamanoPagina: this.pageSize
    }).subscribe({
      next: (r)=>{
        this.data = r?.Items ?? r?.Data ?? [];
        this.total = r?.Total ?? this.data.length ?? 0;
        this.loading=false;
      }, error: ()=> this.loading=false
    });
  }
  onSearch(){ this.page=1; this.cargar(); }
  onPageChange(p:number){ this.page=p; this.cargar(); }
  get totalPages(){ return Math.ceil(this.total/this.pageSize); }
  get pages(){ return Array.from({length:this.totalPages},(_,i)=>i+1); }

  cancel(): void {
    this.router.navigate(['/app/saldo-cuentas']);
  }

}
