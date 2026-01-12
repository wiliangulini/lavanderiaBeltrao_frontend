import {Component, OnInit} from '@angular/core';
import {FormArray, FormGroup} from "@angular/forms";
import {DataCrudService} from "../shared/services/data-crud.service";
import {ConsultaCepService} from "../shared/services/consulta-cep.service";

@Component({
  selector: 'app-form-cadastro',
  template: `<div></div>`
})
export abstract class FormCadastroComponent implements OnInit {

  formulario!: FormGroup;
  submitted!: boolean;
  i = 0;
  np: any;

  constructor(
    protected crudService: DataCrudService,
    protected cepService: ConsultaCepService
  ) {}

  ngOnInit(): void {}

  abstract submit(): any;

  onSubmit(): void {
    (this.formulario.valid) ? this.submit() : this.verificaValidacoesForm(this.formulario);
  }

  verificaValidacoesForm(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(campo => {
      const controle = formGroup.get(campo);
      controle?.markAsDirty();
      controle?.markAsTouched();
      if(controle instanceof FormGroup || controle instanceof FormArray) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo)?.valid &&
      !!(this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {'is-invalid': this.verificaValidTouched(campo)}
  }

  resetar(): void {
    this.submitted = false;
    this.formulario.reset();
  }

  consultarCep(e: any) {
    let CEP = e.target.value;
    const originalCep = CEP;

    this.cepService.consultaCEP(CEP).subscribe((data: any) => {
      if (data && data.cep && !data.erro) {
        this.formulario.patchValue({
          cep: data.cep,
          cidade: data.localidade,
          rua: data.logradouro,
          bairro: data.bairro,
          complemento: data.complemento
        });
      } else {
        this.formulario.patchValue({
          cep: originalCep
        });
      }
    })
  }
}
