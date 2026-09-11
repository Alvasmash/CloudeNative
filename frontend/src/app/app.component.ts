import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './layout/header.component';
import { FooterComponent } from './layout/footer.component';
import { ToastContainerComponent } from './shared/components/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastContainerComponent],
  template: `
    <div class="app-layout">
      <app-header />
      <main class="app-main">
        <router-outlet />
      </main>
      <app-footer />
      <app-toast-container />
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: #F8FAFC;
      color: #0F172A;
    }
    .app-main {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {
  title = 'Pedidos360';
}
