import { Injectable } from '@angular/core';
import { CAR } from '../model/CAR';
import { MOCKCAR, MOCKRENT_LOG } from '../model/MOCK';
import { RENT_LOG } from '../model/RENT_LOG';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  serverUrl: string;

  constructor(private http: HttpClient) {
    this.serverUrl = 'https://aztest20230425.azurewebsites.net/api/';
  }

  getCar():Observable<CAR[]>{
    const apiUrl = this.serverUrl + 'getCar';

    //return this.http.get<CAR[]>(apiUrl).pipe(
    //  catchError((error: HttpErrorResponse) => {
    //    return throwError(error.error);
    //  })
    //);

    return of(MOCKCAR);
  }

  getRentLog(CAR_ID: number):Observable<RENT_LOG[]>{
    const apiUrl = this.serverUrl + 'getRentLog/' + CAR_ID;

    return this.http.get<RENT_LOG[]>(apiUrl).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error.error);
      })
    );

    //return of(MOCKRENT_LOG);
  }

}
