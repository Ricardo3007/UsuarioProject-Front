import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../utils/session.service';

export const authGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router: Router = inject(Router);
  if (!sessionService.sesionActiva()) {
    console.log('No hay sesion activa');
    return router.navigate(['login']);
  }else{
    console.log('Sesion activaasdasdasd');
    return true;
  }
};
export const noAuthGuard: CanActivateFn = (route, state) => {
  return true;
};
