import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GestionService, PersonaDto } from '../services/gestion.service';

@Component({
  selector: 'app-persona-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './persona-form.component.html'
})
export class PersonaFormComponent implements OnInit {
  model: PersonaDto = { Nombre: '' };
  loading = false;
  isEdit = false;
  usuario = 'Administrador';

  constructor(private api: GestionService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id;
    if (this.isEdit) {
      this.loading = true;
      this.api.obtenerPersona(this.usuario, Number(id), undefined, true).subscribe({
        next: (r) => {
          this.loading = false;
          if (r?.Data) this.model = { ...r.Data };
        }, error: ()=> this.loading=false
      });
    }
  }

  save(){
    this.loading = true;
    const req$ = this.isEdit
      ? this.api.actualizarPersona({ ...(this.model as any), IdPersona: this.model.IdPersona! }, this.usuario, true)
      : this.api.crearPersona(this.model, this.usuario);

    req$.subscribe({
      next: (r)=> { this.loading=false; alert(r?.Mensaje ?? 'Guardado'); this.router.navigate(['/app/persona.php']); },
      error: (e)=> { this.loading=false; alert('Error guardando: '+ e?.message); }
    });
  }
}
