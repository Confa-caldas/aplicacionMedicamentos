import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class LockDetectionService {
  private isBrowser: boolean;
  private lastHiddenTime: number | null = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Verifica si el entorno es un navegador
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      this.initializeVisibilityListener();
    }
  }

  private initializeVisibilityListener() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Cuando la pestaña se oculta o el dispositivo se bloquea
        this.lastHiddenTime = Date.now();
        console.log('Dispositivo bloqueado o pestaña inactiva');
      } else {
        // Cuando la pestaña vuelve a ser visible o el dispositivo se desbloquea
        if (this.lastHiddenTime) {
          const elapsed = Date.now() - this.lastHiddenTime;
          console.log(`Tiempo bloqueado: ${elapsed / 1000} segundos`);

          // Comprueba si han pasado más de 5 minutos (300,000 ms)
          if (elapsed > 5 * 60 * 1000) {
            console.log('Tiempo excedido. Cerrando sesión.');
            this.logout();
          }
        }
        this.lastHiddenTime = null; // Restablece el tiempo
      }
    });
  }

  private logout() {
    // Implementa aquí la lógica de cierre de sesión
    console.log('Cerrando sesión...');
    // Por ejemplo, redirigir al login o llamar a un servicio de autenticación
    // this.authService.logout();
  }
}
