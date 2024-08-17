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
    this.crudService.listClient().subscribe((data) =>{
      data.forEach((e: any) => {
        let elm = e.cliente.toLowerCase();
        if(elm.includes(client)) {
          return this.arrClientes.push(e)
        }
      });
    })
  }

  onEdit(id: any) {
    this.crudService.findByIdClient(id).subscribe((data: any) => this.clientes = data)
  }

  onRemove(id: any) {
    this.crudService.removeClient(id).subscribe(() => {
      this._snackBar.open('CLIENTE REMOVIDO COM SUCESSO!!!', '', {duration: 4000})
      this.formulario.get('search');
      this.searchCliente();
    })
  }

}
