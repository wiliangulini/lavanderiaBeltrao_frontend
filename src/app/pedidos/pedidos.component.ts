import {DataCrudService} from '../shared/services/data-crud.service';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';

import {ConsultaCepService} from '../shared/services/consulta-cep.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormularioComponent} from "../formulario/formulario.component";

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent extends FormularioComponent implements OnInit {

  constructor(
      FB: FormBuilder,
      HTTP: HttpClient,
      CS: DataCrudService,
      CP: ConsultaCepService,
      MSD: MatSnackBar,
      CDR: ChangeDetectorRef
  ) {
    super(FB, HTTP,CS, CP, MSD, CDR);
  }

  override ngOnInit(): void {
    let pag: any = window.location.href.split("/#/");
    let btn: any = document.querySelector('.btn-whats');
    if(pag[1] === 'registrar-pedido') {
      btn.style.display = 'none';
    }
  }


}
