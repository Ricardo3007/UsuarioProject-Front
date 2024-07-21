

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../utils/session.service';
import { IUsuario } from '../../interfaces/usuario.interface';
import { ManagerUserComponent } from '../components/manager-user/manager-user.component';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,

  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule,RouterOutlet,FormsModule,ReactiveFormsModule,NzButtonModule,NzInputModule,NzIconModule,NzModalModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent {

  showPassword: boolean = false;
  url = window.location.href;
  conexion: string | null = null;
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  form: FormGroup = this._fb.group({
      UserName: new FormControl(null, [Validators.required]),
      Password: new FormControl(null, [Validators.required]),
  });
  loadingLogin: boolean = false;
  passwordVisible = false;
  public modal = inject(NzModalService);

  constructor(
    private _fb: FormBuilder,
    private _route: Router, private _auth: AuthService, private _sesionServicio: SessionService,) {

}

ingresar() {
  this.loadingLogin = true;
  this._auth.signIn(this.form.value).subscribe((result: any | null) => {
      if (result) {
          this.loadingLogin = false;
          this._route.navigate(['home']);

      } else {
          this.loadingLogin = false;    
      }
  });
}

//METODO PARA ABRIR EL MODAL DE CREAR O EDITAR PERSONA
managerUserModalNew(data?:IUsuario){
  const modal = this.modal.create<ManagerUserComponent,any>({
    nzTitle: 'Nueva Persona',
    nzContent: ManagerUserComponent,
    nzWidth:'70%',
    nzData: data,//DATA QUE LE PASO AL COMPONENTE POR INJECCION
    nzFooter:null,
    nzMaskClosable:false,
  });
}
}
