import {DataCrudService} from '../shared/services/data-crud.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormularioComponent} from "../formulario/formulario.component";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-pesquisa',
  templateUrl: './pesquisa.component.html',
  styleUrls: ['./pesquisa.component.scss']
})
export class PesquisaComponent extends FormularioComponent implements OnInit {

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

  override ngOnInit(): void {}


}
