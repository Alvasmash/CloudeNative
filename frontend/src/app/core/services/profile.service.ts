import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../models/user-profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/profile`;

  getUserProfile(): Observable<UserProfile | null> {
    return this.http.get<UserProfile>(this.apiUrl).pipe(
      catchError(err => {
        console.warn('Fallo llamada GET /api/profile:', err);
        return of(null);
      })
    );
  }
}
