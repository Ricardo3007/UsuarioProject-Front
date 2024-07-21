import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NZ_MODAL_DATA, NzModalModule, NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { combineLatest, startWith } from 'rxjs';
import { IUsuario } from '../../../interfaces/usuario.interface';
import { PersonaService } from '../../../services/persona.service';

@Component({
  selector: 'app-manager-user',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,NzInputModule, NzModalModule,NzSelectModule,NzButtonModule,NzDatePickerModule,NzTableModule,NzIconModule],
  templateUrl: './manager-user.component.html',
  styleUrl: './manager-user.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManagerUserComponent {
  //FORMULARIO
  form:FormGroup = new FormGroup({});//SE CREA UN FORMULARIO
  //INYECCIONES DE DEPENDENCIAS
  public _fb =inject(FormBuilder);
  readonly #modal = inject(NzModalRef);//SE INYECTA EL MODAL
  readonly nzData: IUsuario = inject(NZ_MODAL_DATA);//SE INYECTA LOS DATOS DEL MODAL
  private _usuarioService = inject(PersonaService);//SE INYECTA EL SERVICIO DE PERSONA
  //VARIABLES
  loadingManager:boolean = false;//SE CREA UNA VARIABLE PARA EL LOADING PARA CUANDO GUARDEN O EDITEN
  constructor() {
    //SE INICIALIZA EL FORMULARIO
    this.initForm();
    //SI EXISTE UN USUARIO SE SETEA EL FORMULARIO
    if (this.nzData) {
      this.setForm(this.nzData);
    }
  }
  //METODO QUE INICIALIZA EL FORMULARIO
  initForm():void {
    this.form = this._fb.group({
      id: [null],
      name: [null,[Validators.required,Validators.minLength(5)]],
      lastName: [null,[Validators.required,Validators.minLength(5)]],
      documentType: [null,[Validators.required]],
      documentNumber: [null,[Validators.required,Validators.minLength(9)]],
      email: [null,[Validators.required,Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)]],
      fullName: [null],
      document: [null],
      dataUser: this._fb.group({
        id: [null],
        username: [{ value: null, disabled: true },[Validators.required]],
        password: [null,[Validators.required,Validators.minLength(6)]],
      }),
    });
  }
  ngOnInit() {
    // OBTENEMOS LOS CONTROLES DEL FORMULARIO PARA LOS CAMPOS name, lastName y documentNumber PARA SUSCRIBIRNOS A SUS CAMBIOS
    const nameControl = this.form.get('name');
    const lastNameControl = this.form.get('lastName');
    const documentNumberControl = this.form.get('documentNumber');

    // NOS SUBSCRIBIMOS A LOS CAMBIOS DE LOS CAMPOS name, lastName y documentNumber
    combineLatest([
      nameControl!.valueChanges.pipe(startWith(nameControl!.value)),
      lastNameControl!.valueChanges.pipe(startWith(lastNameControl!.value)),
      documentNumberControl!.valueChanges.pipe(startWith(documentNumberControl!.value))
    ]).subscribe(([name, lastName, documentNumber]) => {
      // SI LOS CAMPOS name, lastName Y documentNumber  TIENEN VALOR
      if (name && lastName && documentNumber ) {
        // SE CREA EL USERNAME CON LA PRIMERA LETRA DEL NOMBRE, LAS PRIMERAS 3 LETRAS DEL APELLIDO Y LOS ULTIMOS 4 DIGITOS DEL DOCUMENTO
        const username = `${name.slice(0, 1)}${lastName.slice(0, 3)}${documentNumber.slice(-4)}`;
        // SI NO EXISTE UN USUARIO EN EL MODAL SE SETEA EL VALOR DEL CAMPO username
        if (!this.nzData) {
          this.form.get('dataUser.username')!.setValue(username);
        }
      }
    });
  }
  //SE SETEA EL FORMULARIO
  setForm(data:IUsuario):void {
    this.form.patchValue(data);
    this.form.get('dataUser.username')?.disable();
  }
  // METODO PARA CERRAR EL MODAL
  cancel():void {
    this.#modal.close();
  }
  // METODO PARA GUARDAR O EDITAR UN USUARIO
  SaveOrEdit():void {

    //SE VALIDA EL FORMULARIO
    if (this.form.valid) {
     //SE OBTIENEN LOS DATOS DEL FORMULARIO
     const data:IUsuario = {...this.form.getRawValue(),
        document: `${this.form.get('documentType')?.value} -${this.form.get('documentNumber')?.value}`,
        fullName: `${this.form.get('name')?.value} ${this.form.get('lastName')?.value}`
     };
    //SE MUESTRA EL LOADING
    this.loadingManager = true;
    //SE GUARDA O ACTUALIZA EL USUARIO
    if (data.id) {
      //SE ACTUALIZA
      this._usuarioService.UpdatePersona(data).subscribe((status)=>{
        //SE CIERRA EL MODAL
        this.#modal.close(status);
        //SE OCULTA EL LOADING
        this.loadingManager = false;
      }
      );
    }else{
      //SE GUARDA
      this._usuarioService.SavePersona(data).subscribe((status)=>{
        //SE CIERRA EL MODAL
            //SE CIERRA EL MODAL
            this.#modal.close(status);
        //SE OCULTA EL LOADING
        this.loadingManager = false;
      }
      );

    }

    }

  }
}
