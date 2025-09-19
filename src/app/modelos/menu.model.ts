export interface Opcion {
  idOpcion: number;
  opcion: string;
  pagina: string;
  Alta: number;
  Baja: number;
  Cambio: number;
  Imprimir: number;
  Exportar: number;
}

export interface Menu {
  idMenu: number;
  menu: string;
  orden: number;
  opciones: Opcion[];
}

export interface Modulo {
  idModulo: number;
  modulo: string;
  menus: Menu[];
}