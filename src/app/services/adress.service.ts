import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Adress {
  adressID?: number;
  street: string;
  zipcode: string;
  city: string;
  country: string;
  clientId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdressService {
  private apiUrl = 'http://localhost:5192/api/Adress';

  constructor(private http: HttpClient) { }

  getAddresses(page: number = 1, pageSize: number = 10, country?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    if (country) {
      params = params.set('country', country);
    }

    return this.http.get<any>(this.apiUrl, { params });
  }
  getAddress(id: number): Observable<Adress> {
    return this.http.get<Adress>(`${this.apiUrl}/${id}`);
  }

  addAddress(address: Adress): Observable<Adress> {
    return this.http.post<Adress>(this.apiUrl, address);
  }

  updateAddress(id: number, adress: Adress): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, adress);
  }

  deleteAddress(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
