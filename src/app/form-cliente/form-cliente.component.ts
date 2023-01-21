import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormCadastroComponent} from "../form-cadastro/form-cadastro.component";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
import {HttpClient} from "@angular/common/http";
import {DataCrudService} from "../shared/services/data-crud.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent extends FormCadastroComponent implements OnInit {

  @Input() clientes: any = {};

  constructor(
    private fb: FormBuilder,
    DCS: DataCrudService,
    CP: ConsultaCepService,
    private _snackBar: MatSnackBar,
  ) {
    super(DCS, CP);
    this.formulario = this.fb.group({
      cliente: [null, [Validators.required]],
      telefone: [null, [Validators.required]],
      cep: [null, [Validators.required]],
      cidade: [null, [Validators.required]],
      rua: [null, [Validators.required]],
      numCasa: [null, [Validators.required]],
      bairro: [null, [Validators.required]],
      complemento: [null],
    });
  }

  override ngOnInit(): void {}

  submit(): any {
    this.crudService.saveClient(this.clientes).subscribe(
      success => this.onSuccess(),
      error => this.onError(),
      () => console.log('request completo')
    )
  }

  private onSuccess() {
    this._snackBar.open('CLIENTE SALVO COM SUCESSO!!!', '', {duration: 4000});
  }
  private onError() {
    this._snackBar.open('ERRO AO SALVAR CLIENTE!!!', '', {duration: 4000});
  }


}
