import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { DataCrudService } from '../shared/services/data-crud.service';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {

  formulario: FormGroup;
  submitted: boolean = false;
  id: any;
  clientes: any = {};
  arrClientes: any = [];


  constructor(
      private fb: FormBuilder,
      private cepService: ConsultaCepService,
      private http: HttpClient,
      private crudService: DataCrudService,
      private _snackBar: MatSnackBar
    ) {
      this.formulario = this.fb.group({
        search: [null],
      });

  }
  ngOnInit(): void {
  }

  searchCliente() {
    this.arrClientes = [];
    let client = this.formulario.get('search')?.value?.toLowerCase();
    this.crudService.listClient().subscribe({
      next: (data) => {
        data.forEach((e: any) => {
          let elm = e.cliente.toLowerCase();
          if(elm.includes(client)) {
            return this.arrClientes.push(e)
          }
        });
      },
      error: () => this._snackBar.open('ERRO AO PESQUISAR CLIENTES!!!', '', {duration: 4000})
    })
  }

  onEdit(id: any) {
    this.crudService.findByIdClient(id).subscribe({
      next: (data: any) => this.clientes = data,
      error: () => this._snackBar.open('ERRO AO CARREGAR CLIENTE!!!', '', {duration: 4000})
    })
  }

  onRemove(id: any) {
    this.crudService.removeClient(id).subscribe({
      next: () => {
        this._snackBar.open('CLIENTE REMOVIDO COM SUCESSO!!!', '', {duration: 4000})
        this.formulario.get('search');
        this.searchCliente();
      },
      error: () => this._snackBar.open('ERRO AO REMOVER CLIENTE!!!', '', {duration: 4000})
    })
  }

}
