import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande } from './commande.service';


export interface Client {
  clientID: number ;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  adress: Address[];
  commande: Commande[];
}

export interface Address {
  adressID?: number;
  street: string;
  zipcode: string;
  city: string;
  country: string;
  clientID?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private apiUrl = 'http://localhost:5192/api/client';

  constructor(private http: HttpClient) { }

  getClients(
    page: number = 1, 
    pageSize: number = 10, 
    clientId?: number, 
    firstName?: string, 
    lastName?: string, 
    country?: string
  ): Observable<{ totalItems: number, clients: Client[] }> {
    let url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;

    // Ajouter les filtres si fournis
    if (clientId) {
      url += `&clientId=${clientId}`;
    }
    if (firstName) {
      url += `&firstName=${encodeURIComponent(firstName)}`;
    }
    if (lastName) {
      url += `&lastName=${encodeURIComponent(lastName)}`;
    }
    if (country) {
      url += `&country=${encodeURIComponent(country)}`;
    }

    return this.http.get<{ totalItems: number, clients: Client[] }>(url);
  }


  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.apiUrl}/${id}`);
  }

  addClient(client: Client): Observable<Client> {
    return this.http.post<Client>(this.apiUrl, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  updateClient(id: number, client: Client): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, client);
  }

}
