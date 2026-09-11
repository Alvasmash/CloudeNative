import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'menu'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión | Pedidos360'
  },
  {
    path: 'menu',
    loadComponent: () => import('./features/menu/menu.component').then(m => m.MenuComponent),
    title: 'Menú & Catálogo | Pedidos360'
  },
  {
    path: 'carrito',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Carrito de Compras | Pedidos360'
  },
  {
    path: 'pedidos',
    loadComponent: () => import('./features/orders/orders-list.component').then(m => m.OrdersListComponent),
    canActivate: [authGuard],
    title: 'Mis Pedidos | Pedidos360'
  },
  {
    path: 'pedidos/:id',
    loadComponent: () => import('./features/orders/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard],
    title: 'Seguimiento de Pedido | Pedidos360'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard],
    title: 'Administración de Pedidos | Pedidos360'
  },
  {
    path: '**',
    redirectTo: 'menu'
  }
];
