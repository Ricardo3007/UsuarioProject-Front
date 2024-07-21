import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageItems } from '../enums/localstorage.enum';

@Injectable({
  providedIn: 'root'
})
export class SessionService {


    constructor(private router:Router) { }

    setSesion(loginData: any) {
        if (loginData == null) {
            return;
        }
        this.setTokens(loginData.token);
        if(loginData) {
            localStorage.setItem(LocalStorageItems.USER, this.encode(JSON.stringify(loginData.usuario)));
        }
    }

    setTokens(token: string) {
        if(token) {
            localStorage.setItem(LocalStorageItems.TOKEN, this.encode(token));
        }
    }

    limpiarSesion() {
        localStorage.removeItem(LocalStorageItems.TOKEN);
        localStorage.removeItem(LocalStorageItems.USER);
    /*     this.router.navigate(["login"]); */
    }

    sesionActiva(): boolean {
        let tokenLocal = localStorage.getItem(LocalStorageItems.TOKEN);
        let usuarioLocal = localStorage.getItem(LocalStorageItems.USER);
        if (tokenLocal == null || usuarioLocal == null) {
            return false;
        }
        return true;
    }

    token(): string {
        let token = localStorage.getItem(LocalStorageItems.TOKEN);
        if (token == null) {
            return "";
        }
        return this.decode(token);
    }



    usuario(): any | null {
        let usuarioLocal = localStorage.getItem(LocalStorageItems.USER);
        if (usuarioLocal == null) {
            return null;
        }
        let usuarioJson = JSON.parse(this.decode(usuarioLocal));
        return usuarioJson;
    }

    private encode(value: any): string {
        return btoa(value);
    }

    private decode(value: any): string {
        return atob(value);
    }
}
