import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Reserva } from './models/reserva.model';
import { ReservaService } from './services/reserva.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class AppComponent implements OnInit {
  reservas: Reserva[] = [];
  total = 0;
  
  habitaciones = [
    { tipo: 'Individual', precio: 500 },
    { tipo: 'Doble', precio: 750 },
    { tipo: 'Suite', precio: 1200 },
    { tipo: 'Presidencial', precio: 2000 },
    { tipo: 'Familiar', precio: 1500 }
  ];

  reservaEditando: Reserva | null = null;

  formReserva = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(100)]),	
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    habitacion: new FormControl('', [Validators.required]),
    dias: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(private reservaService: ReservaService) {}

  async ngOnInit() {
    await this.getReservas();
  }

  // Obtener las reservas desde Firebase
  async getReservas() {
    this.reservas = await firstValueFrom(this.reservaService.getReservas());
  }

  // Calcular el total de la reserva
  calcularTotal() {
    const habitacionSeleccionada = this.habitaciones.find(h => h.tipo === this.formReserva.value.habitacion);
    if (habitacionSeleccionada) {
      this.total = habitacionSeleccionada.precio * Number(this.formReserva.value.dias);
    }
  }

  // Agregar una nueva reserva
  async agregarReserva() {
    if (this.formReserva.valid) {
      const nuevaReserva: Reserva = {
        nombre: this.formReserva.value.nombre!,
        edad: Number(this.formReserva.value.edad!),
        email: this.formReserva.value.email!,
        telefono: this.formReserva.value.telefono!,
        habitacion: this.formReserva.value.habitacion!,
        dias: Number(this.formReserva.value.dias!),
        total: this.total
      };

      if (this.reservaEditando) {
        // Si estamos editando una reserva, la actualizamos en Firebase
        nuevaReserva.id = this.reservaEditando.id;
        await this.reservaService.modificarReserva(nuevaReserva);
        this.reservaEditando = null;
      } else {
        // Si es una nueva reserva, la agregamos a Firebase
        await this.reservaService.agregarReserva(nuevaReserva);
      }

      await this.getReservas();
      this.resetForm();
    }
  }

  // Editar una reserva
  editarReserva(reserva: Reserva) {
    this.formReserva.setValue({
      nombre: reserva.nombre,
      edad: reserva.edad.toString(),
      email: reserva.email,
      telefono: reserva.telefono,
      habitacion: reserva.habitacion,
      dias: reserva.dias.toString()
    });

    this.total = reserva.total;
    this.reservaEditando = reserva;
  }

  async eliminarReserva(id: string) {
    if (!id) {
      console.error('Error: ID de la reserva no válido');
      return;
    }
    await this.reservaService.eliminarReserva(id);
    await this.getReservas();
  }
  

  // Reiniciar el formulario
  resetForm() {
    this.formReserva.reset();
    this.total = 0;
  }
}
