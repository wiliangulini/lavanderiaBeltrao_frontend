import {Component, Input, OnInit} from '@angular/core';
import {FormCadastroComponent} from "../form-cadastro/form-cadastro.component";
import {FormBuilder, Validators} from "@angular/forms";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";
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
      cep: [null],
      cidade: [null],
      rua: [null],
      numCasa: [null, [Validators.required]],
      bairro: [null],
      complemento: [null],
    });
  }

  override ngOnInit(): void {}

  ngAfterViewInit(): void {
    let pes = document.getElementById('pesquisa');
    console.log(pes)
    pes === null ? this.submitted = true : this.submitted = false;
    console.log(this.submitted)
  }

  submit(): any {
    console.log(this.submitted)
    this.crudService.saveClient(this.clientes).subscribe(
      success => {
        this.onSuccess();
        this.submitted ? this.onSuccess() : this.onSuccessEdit();
        this.resetar();
      },
      error => this.onError()
    )
  }

  private onSuccess() {
    this._snackBar.open('CLIENTE SALVO COM SUCESSO!!!', '', {duration: 4000});
  }
  private onSuccessEdit() {
    this._snackBar.open('CLIENTE EDITADO COM SUCESSO!!!', '', {duration: 4000});
  }
  private onError() {
    this._snackBar.open('ERRO AO SALVAR CLIENTE!!!', '', {duration: 4000});
  }


}
