export class Reserva {
  id?: string; // ID opcional, generado por Firebase
  nombre!: string;
  edad!: number;
  email!: string;
  telefono!: string;
  habitacion!: string;
  dias!: number;
  total!: number;
}
