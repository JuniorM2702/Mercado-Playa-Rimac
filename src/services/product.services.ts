import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../model/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = 'http://localhost:8080/api/v1/products'; 

  constructor(private http: HttpClient) {}

  getOfertas(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/ofertas`);
  }
}
