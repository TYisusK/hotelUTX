import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Reserva } from '../models/reserva.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private db: Firestore = inject(Firestore); // Inyectamos Firestore

  constructor() {}

  // Obtener todas las reservas desde Firebase
  getReservas(): Observable<Reserva[]> {
    const reservasCollection = collection(this.db, 'reservas');
    return collectionData(reservasCollection, { idField: 'id' }) as Observable<Reserva[]>;
  }

  // Agregar una nueva reserva a Firebase
  agregarReserva(reserva: Reserva) {
    const reservasCollection = collection(this.db, 'reservas');
    return addDoc(reservasCollection, {
      nombre: reserva.nombre,
      edad: reserva.edad,
      email: reserva.email,
      telefono: reserva.telefono,
      habitacion: reserva.habitacion,
      dias: reserva.dias,
      total: reserva.total
    });
  }

  // Modificar una reserva existente en Firebase
  modificarReserva(reserva: Reserva) {
    const reservaDoc = doc(this.db, 'reservas', reserva.id!);
    return updateDoc(reservaDoc, {
      nombre: reserva.nombre,
      edad: reserva.edad,
      email: reserva.email,
      telefono: reserva.telefono,
      habitacion: reserva.habitacion,
      dias: reserva.dias,
      total: reserva.total
    });
  }

  // Eliminar una reserva de Firebase
  eliminarReserva(id: string) {
    const reservaDoc = doc(this.db, 'reservas', id);
    return deleteDoc(reservaDoc);
  }
}
