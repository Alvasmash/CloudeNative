import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/auth/auth.service';

describe('AppComponent', () => {
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'isAdmin',
      'userName',
      'userEmail',
      'isDemoMode'
    ]);
    mockAuthService.isAuthenticated.and.returnValue(false);
    mockAuthService.isAdmin.and.returnValue(false);
    mockAuthService.userName.and.returnValue('Invitado');
    mockAuthService.userEmail.and.returnValue('');
    mockAuthService.isDemoMode.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  it('debe crear la aplicación correctamente', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`debe tener el título 'Pedidos360'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Pedidos360');
  });
});
