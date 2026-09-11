import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';
import { adminGuard } from './admin.guard';
import { AuthService } from '../auth/auth.service';
import { ToastService } from '../services/toast.service';

describe('Route Guards', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockToastService: jasmine.SpyObj<ToastService>;

  const dummyRoute = {} as ActivatedRouteSnapshot;
  const dummyState = { url: '/admin' } as RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isAuthenticated', 'isAdmin']);
    mockRouter = jasmine.createSpyObj('Router', ['createUrlTree']);
    mockToastService = jasmine.createSpyObj('ToastService', ['warning', 'error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ToastService, useValue: mockToastService }
      ]
    });
  });

  describe('authGuard', () => {
    it('debe permitir la navegación si el usuario está autenticado', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
      expect(result).toBeTrue();
    });

    it('debe redirigir al login si el usuario no está autenticado', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      const fakeUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(fakeUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(dummyRoute, dummyState));
      expect(result).toBe(fakeUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin' }
      });
      expect(mockToastService.warning).toHaveBeenCalled();
    });
  });

  describe('adminGuard', () => {
    it('debe permitir acceso si el usuario es administrador (ROLE_ADMIN)', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.isAdmin.and.returnValue(true);

      const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));
      expect(result).toBeTrue();
    });

    it('debe bloquear y redirigir al menú si el usuario autenticado NO tiene rol ADMIN', () => {
      mockAuthService.isAuthenticated.and.returnValue(true);
      mockAuthService.isAdmin.and.returnValue(false);
      const fakeUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(fakeUrlTree);

      const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));
      expect(result).toBe(fakeUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/menu']);
      expect(mockToastService.error).toHaveBeenCalled();
    });

    it('debe redirigir a login si el usuario ni siquiera está autenticado', () => {
      mockAuthService.isAuthenticated.and.returnValue(false);
      const fakeUrlTree = {} as UrlTree;
      mockRouter.createUrlTree.and.returnValue(fakeUrlTree);

      const result = TestBed.runInInjectionContext(() => adminGuard(dummyRoute, dummyState));
      expect(result).toBe(fakeUrlTree);
      expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/admin' }
      });
    });
  });
});
