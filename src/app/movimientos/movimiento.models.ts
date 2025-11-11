// src/app/movimientos/movimiento.models.ts

// Respuesta estándar de tu API (con items opcional)
export interface ApiResp<T = any> {
  resultado: number;
  mensaje: string;
  items?: T[];
  [k: string]: any; // para campos extra como 'movimiento', 'saldo', etc.
}

// DTOs de Grabación de Movimiento
export interface CrearMovimientoVm {
  usuario: string;
  idSaldoCuenta: number;
  idTipoMovimientoCXC: number;     // 1 = Cargo, 2 = Abono
  fechaMovimiento: string;         // 'yyyy-MM-ddTHH:mm:ss'
  valorMovimiento: number;
  documentoRef?: string | null;
  descripcion?: string | null;
}

export interface MovimientoCreado {
  idMovimientoCuenta: number;
  idSaldoCuenta: number;
  idTipoMovimientoCXC: number;
  fechaMovimiento: string;
  valorMovimiento: number;
  descripcion?: string | null;
  fechaCreacion: string;
  usuarioCreacion: string;
}

export interface SaldoResumen {
  idSaldoCuenta: number;
  saldoAnterior: number;
  debitos: number;
  creditos: number;
  saldoActual: number;
}

// DTO que devuelve /GrabacionMovimiento/Tipos
export interface TipoMovimientoDto {
  IdTipoMovimientoCXC: number;
  Nombre: string;
  Operacion: number; // 1 = Cargo, 2 = Abono
}
