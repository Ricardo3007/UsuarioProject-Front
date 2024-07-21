import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AppService } from '../api/app.service';
import { RequestStructure, TypeRequest } from '../api/models/request-api.model';
import { IUsuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
public appService=inject(AppService);
GetPersonas(): Observable<IUsuario[]> {
  const request: RequestStructure = {
    request: {
      type: TypeRequest.GET
    },
    endpoint: 'api/Person/Get',
    // skipInterceptor: true
  };
  return this.appService.sentRequest$(request).pipe(
    map((response:any)=>{
      return response as IUsuario[];
    })

  );
}
SavePersona(persona:IUsuario):Observable<boolean >{
  const request: RequestStructure = {
    request: {
      type: TypeRequest.POST,
      body: persona
    },
    endpoint: 'api/Person/Save',
    skipInterceptor: true,
  };
  return this.appService.sentRequest$(request).pipe(
    map((response:any)=>{
      return response as boolean;
    })

  );
}
UpdatePersona(persona:IUsuario):Observable<boolean >{
  const request: RequestStructure = {
    request: {
      type: TypeRequest.PUT,
      body: persona
    },
    endpoint: 'api/Person/Update',
    // skipInterceptor: true,
  };
  return this.appService.sentRequest$(request).pipe(
    map((response:any)=>{
      return response as boolean;
    })

  );
}
DeletePersona(id:number):Observable<boolean>{
  const request: RequestStructure = {
    request: {
      type: TypeRequest.DELETE,
    },
    endpoint: `api/Person/Delete/${id}`,
    // skipInterceptor: true,
  };
  return this.appService.sentRequest$(request).pipe(
    map((response:any)=>{
      return response as boolean;
    })

  );
}

}
