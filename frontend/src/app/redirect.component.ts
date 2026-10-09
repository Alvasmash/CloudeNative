import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

@Component({
  selector: 'app-redirect',
  standalone: true,
  template: '<p>Procesando autenticación...</p>',
})
export class RedirectComponent implements OnInit {
  private readonly router = inject(Router);

  ngOnInit(): void {
    /*
     * Con flujo redirect, el bridge guarda la respuesta de Microsoft y
     * navega a la página que inició el login, donde se procesa.
     * Si no hay respuesta en la URL (por ejemplo al volver del logout),
     * se envía al usuario al login en vez de dejarlo en esta pantalla.
     */
    broadcastResponseToMainFrame().catch((error: Error) => {
      console.error('Error enviando respuesta de autenticación:', error);
      this.router.navigate(['/login']);
    });
  }
}
