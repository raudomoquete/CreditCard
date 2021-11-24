import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { TarjetaCredito } from 'src/app/models/tarjetaCredito';
import { TarjetaService } from 'src/app/services/tarjeta.service';

@Component({
  selector: 'app-tarjeta-credito',
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit, OnDestroy {
  form: FormGroup;
  suscription: Subscription;
  tarjeta: TarjetaCredito;
  idTarjeta = 0;

  constructor(private formBuilder: FormBuilder,
              private tarjetaService: TarjetaService,
              private toastr: ToastrService) {
    this.form = this.formBuilder.group({
      id: 0,
      titular!: ['', [Validators.required]],
      numeroTarjeta!: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(16)]],
      cvv!: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]]
    })
  }

  ngOnInit(): void {
    this.suscription = this.tarjetaService.obtenerTarjeta$().subscribe(data => {
      console.log(data);
      this.tarjeta = data;
      this.form.patchValue({
        titular: this.tarjeta.titular,
        numeroTarjeta: this.tarjeta.numeroTarjeta,
        cvv: this.tarjeta.cvv
      });
      this.idTarjeta == this.tarjeta.id;
    });
  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

   guardarTarjeta() {
     if (this.idTarjeta === 0) {
       this.agregar();
     } else {
       this.editar();
     }
    }

     agregar() {
      const tarjeta: TarjetaCredito = {
        titular: this.form.get('titular')?.value,
        numeroTarjeta: this.form.get('numeroTarjeta')?.value,
        cvv: this.form.get('cvv')?.value
      };
 
     this.tarjetaService.guardarTarjeta(tarjeta).subscribe(data => {
       this.toastr.success('Nuevo Registro', 'La tarjeta ha sido agregada');
       this.tarjetaService.obtenerTarjetas();
       this.form.reset();
     });
  } 

  editar() {
    const tarjeta: TarjetaCredito = {
      id: this.tarjeta.id,
      titular: this.form.get('titular')?.value,
      numeroTarjeta: this.form.get('numeroTarjeta')?.value,
      cvv: this.form.get('cvv')?.value
    };
    this.tarjetaService.actualizarTarjeta(this.idTarjeta, tarjeta).subscribe(data => {
      this.toastr.info('Registro Actualizado', 'La tarjeta ha sido actualizada');
      this.tarjetaService.obtenerTarjetas();
      this.form.reset();
      this.idTarjeta = 0;
    });
    
  }

  
}
