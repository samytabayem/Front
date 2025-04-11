import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.service';

export interface Commande {
  numCommande?: number;
  date?: string;
  clientID: number;
  commandeProduits: CommandeProduits[];
}

export interface CommandeProduits {
  productID: number;
  produitID: number;
  quantity: number;
  produit?: Product;
}

/*export interface ClientCommande {
  clientID: number;
  firstName: string;
  lastName: string;
}*/

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'https://tdproduit-7.onrender.com/api/commande';

  constructor(private http: HttpClient) { }

  getCommandes(page: number = 1, pageSize: number = 10, startDate?: string, endDate?: string): Observable<Commande[]> {
    let url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;

    // Ajouter les filtres de date si fournis
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }

    return this.http.get<Commande[]>(url);
  }

  getCommande(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  addCommande(commande: Commande): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }
  updateCommande(id: number, commande: Commande): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, commande);
  }


  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  
}
