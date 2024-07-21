import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTableModule } from 'ng-zorro-antd/table';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { IUsuario } from '../../interfaces/usuario.interface';
import { PersonaService } from '../../services/persona.service';
import { SessionService } from '../../utils/session.service';
import { ManagerUserComponent } from '../components/manager-user/manager-user.component';
/* import { GetReserva } from 'src/app/app.component';
import { ManagerReservaComponent } from 'src/app/components/manager-reserva/manager-reserva.component';
import { Cliente, Reserva, Servicio } from 'src/app/Models/registro-models';
import { ReservasApiService } from 'src/app/Services/reservas-api.service';
import { UsuarioService } from 'src/app/Services/usuario.service';
import { SessionService } from 'src/app/utils/session.service'; */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,

  imports: [CommonModule, ReactiveFormsModule,
    FormsModule,
    NzPageHeaderModule,NzInputModule,
    NzButtonModule,NzTableModule,
    NzModalModule,NzIconModule,
    NzSelectModule,NzDatePickerModule,
    NzPopoverModule,NzListModule]
})
export class HomeComponent {
  //VARIABLES
  usuarios:IUsuario[] = [];//SE CREA UN ARREGLO DE PERSONAS
  loadingUsuarios:boolean = false;//SE CREA UNA VARIABLE PARA EL LOADING

  //INYECCIONES DE DEPENDENCIAS
  public modal = inject(NzModalService);
  public usuarioService = inject(PersonaService);
  private _sessionService=inject(SessionService);
  private _route=inject(Router);

  constructor() {
      this.getPersonas();//SE LLAMA AL METODO PARA OBTENER LAS PERSONAS
  }
  //METODO PARA OBTENER LAS PERSONAS
  getPersonas(){
    this.loadingUsuarios = true;
    this.usuarioService.GetPersonas().subscribe((personas)=>{
      this.loadingUsuarios = false;
      this.usuarios = personas;
    }
    );
  }
  //METODO PARA ABRIR EL MODAL DE CREAR O EDITAR PERSONA
  managerUserModal(data?:IUsuario){
    const modal = this.modal.create<ManagerUserComponent,any>({
      nzTitle: data? 'Editar Persona' : 'Nueva Persona',
      nzContent: ManagerUserComponent,
      nzWidth:'70%',
      nzData: data,//DATA QUE LE PASO AL COMPONENTE POR INJECCION
      nzFooter:null,
      nzMaskClosable:false,
    })
    modal.afterClose.subscribe((result:boolean) =>
    {
      if (result) {
      this.getPersonas();
      }
    }
    );
  }
  //METODO PARA ELIMINAR UNA PERSONA
  deleteUser(data:IUsuario){
    this.usuarioService.DeletePersona(Number(data.id)).subscribe((response)=>{
      if (response) {
      this.getPersonas();
      }
    }
    );
  }
  cerrarSesion(){
    this._sessionService.limpiarSesion();
    this._route.navigate(['login']);
  }
}
