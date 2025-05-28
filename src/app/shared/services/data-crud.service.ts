import { Clientes } from '../clientes';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {delay, first, take} from 'rxjs';

import { environment } from '../../../environments/environment';
import { PedidosClientes } from '../pedidos-clientes';

@Injectable({
  providedIn: 'root'
})
export class DataCrudService {

  private readonly pedidosAPI = `${environment.apiUrl}/pedidos`;
  private readonly clientesAPI = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) { }

  list() {
    return this.http.get<PedidosClientes[]>(this.pedidosAPI)
  }

  findById(id: any) {
    return this.http.get(`${this.pedidosAPI}/${id}`).pipe(
      delay(500),
      take(1)
      );
  }

  save(pedido: any) {
    if(pedido.id) {
      return this.update(pedido)
    }
    return this.create(pedido);
  }

  protected create(pedidos: Partial<PedidosClientes>) {
    return this.http.post(this.pedidosAPI, pedidos).pipe(take(1));
  }

  protected update(record: Partial<PedidosClientes>) {
    return this.http.put<PedidosClientes>(`${this.pedidosAPI}/${record.id}`, record).pipe(first());
  }

  remove(id: any) {
    return this.http.delete(`${this.pedidosAPI}/${id}`).pipe(first());
  }

  listClient() {
    return this.http.get<Clientes[]>(this.clientesAPI)
  }

  findByIdClient(id: any) {
    return this.http.get(`${this.clientesAPI}/${id}`).pipe(
      delay(1000),
      take(1)
    );
  }


  saveClient(cliente: any) {
    if(cliente.id) {
      return this.updateClient(cliente)
    }
    return this.createClient(cliente);
  }

  private createClient(cliente: any) {
    return this.http.post(this.clientesAPI, cliente).pipe(take(1));
  }

  private updateClient(record: Partial<Clientes>) {
    let cliente: any = record;
    delete cliente.search;
    return this.http.put<Clientes>(`${this.clientesAPI}/${cliente.id}`, cliente).pipe(take(1));
  }

  removeClient(id: any) {
    return this.http.delete(`${this.clientesAPI}/${id}`).pipe(first());
  }
}
