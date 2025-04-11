import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  produitID?: number;
  name: string;
  description: string;
  price: number;
  unitsInStock: number;
  weight: number;
}

export interface ProductResponse {
  totalItems: number;
  page: number;
  pageSize: number;
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://tdproduit-7.onrender.com/api/Produit';

  constructor(private http: HttpClient) { }

  // Mise à jour pour retourner la réponse complète (incluant la pagination)
  getProducts(page: number = 1, pageSize: number = 10, produitId?: number, name?: string): Observable<ProductResponse> {
    let url = `${this.apiUrl}?page=${page}&pageSize=${pageSize}`;
    
    // Ajouter les paramètres de filtrage à l'URL
    if (produitId) {
      url += `&produitId=${produitId}`;
    }
    if (name) {
      url += `&name=${name}`;
    }

    return this.http.get<ProductResponse>(url);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/details/${id}`);
  }

  addProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Product): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
