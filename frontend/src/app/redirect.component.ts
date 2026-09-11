import { Component, OnInit } from '@angular/core';
import { broadcastResponseToMainFrame } from '@azure/msal-browser/redirect-bridge';

@Component({
    selector: 'app-redirect',
    standalone: true,
    template: '<p>Procesando autenticación...</p>'
})
export class RedirectComponent implements OnInit {

    ngOnInit(): void {
        broadcastResponseToMainFrame().catch((error: Error) => {
            console.error(
                'Error enviando respuesta de autenticación:',
                error
            );
        });
    }
}