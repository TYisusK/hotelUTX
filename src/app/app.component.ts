import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';  // Necesario para usar formularios reactivos
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Esto indica que el componente es independiente (standalone)
  imports: [ReactiveFormsModule, CommonModule]  // Importa los módulos necesarios aquí
})
export class AppComponent {
  reservas: Array<{ nombre: string; edad: string; email: string; telefono: string; habitacion: string; dias: string; total: number }> = [];
  total = 0;
  
  habitaciones = [
    { tipo: 'Individual', precio: 500 },
    { tipo: 'Doble', precio: 750 },
    { tipo: 'Suite', precio: 1200 },
    { tipo: 'Presidencial', precio: 2000 },
    { tipo: 'Familiar', precio: 1500 }
  ];

  reservaEditando: number | null = null;  // Esta variable guardará el índice de la reserva que estamos editando

  formReserva = new FormGroup({
    nombre: new FormControl('', [Validators.required, Validators.minLength(5)]),
    edad: new FormControl('', [Validators.required, Validators.min(18), Validators.max(100)]),	
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    habitacion: new FormControl('', [Validators.required]),
    dias: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  calcularTotal() {
    const habitacionSeleccionada = this.habitaciones.find(h => h.tipo === this.formReserva.value.habitacion);
    if (habitacionSeleccionada) {
      this.total = habitacionSeleccionada ? habitacionSeleccionada.precio * Number(this.formReserva.value.dias) : 0;
    }
  }

  agregarReserva() {
    if (this.formReserva.valid) {
      const nuevaReserva = {
        nombre: this.formReserva.value.nombre!,
        edad: this.formReserva.value.edad!,
        email: this.formReserva.value.email!,
        telefono: this.formReserva.value.telefono!,
        habitacion: this.formReserva.value.habitacion!,
        dias: this.formReserva.value.dias!,
        total: this.total
      };

      if (this.reservaEditando !== null) {
        // Si estamos editando una reserva, la actualizamos
        this.reservas[this.reservaEditando] = nuevaReserva;
        this.reservaEditando = null;  // Restablecer la variable de edición
      } else {
        // Si no estamos editando, agregamos una nueva reserva
        this.reservas.push(nuevaReserva);
      }
      this.resetForm();
    }
  }

  editarReserva(reserva: any) {
    this.formReserva.setValue({
      nombre: reserva.nombre,
      edad: reserva.edad,
      email: reserva.email,
      telefono: reserva.telefono,
      habitacion: reserva.habitacion,
      dias: reserva.dias
    });
    this.total = reserva.total;

    // Guardamos el índice de la reserva que estamos editando
    this.reservaEditando = this.reservas.indexOf(reserva);
  }

  eliminarReserva(index: number) {
    this.reservas.splice(index, 1);
  }

  resetForm() {
    this.formReserva.reset();
    this.total = 0;
  }
}