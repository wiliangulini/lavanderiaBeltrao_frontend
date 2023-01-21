import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';

@Component({
  selector: 'app-busca-cep',
  templateUrl: './busca-cep.component.html',
  styleUrls: ['./busca-cep.component.scss']
})
export class BuscaCepComponent implements OnInit {

  formulario: FormGroup;

  cep: any;
  bairro: any;
  cidade: any;
  complemento: any;

  arrCep: any[] = [];
  arrCidade: any[] = [];
  arrBairro: any[] = [];
  arrComp: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cepService: ConsultaCepService,
    private http: HttpClient
  ) {
    this.formulario = this.fb.group({
      cep: [null],
      cidade: [null],
      rua: [null],
      bairro: [null],
      complemento: [null],

    });
  }

  ngOnInit(): void {
  }


  verificaValidTouched(campo: string) {
    return (
      !this.formulario.get(campo)?.valid && !!(this.formulario.get(campo)?.touched || this.formulario.get(campo)?.dirty)
    );
  }

  aplicaCssErro(campo: string) {
    return {'is-invalid': this.verificaValidTouched(campo)}
  }


  resetar(): void {
    this.formulario.reset();
    this.arrCep = [];
    this.arrCidade = [];
    this.arrBairro = [];
    this.arrComp = [];
  }

  populaDadosForm(dados: any) {
    this.formulario.patchValue({
      cep: dados.cep,
      complemento: dados.complemento,
      bairro: dados.bairro,
      cidade: dados.localidade,
    })
  }

  consultarRua(): void {
    let rua = this.formulario.get('rua')!.value;

    if(rua != null && rua !== '') {
      this.cepService.consultaRUA(rua)?.subscribe((data: any) => {

        data.forEach((data: any) => {
          console.log(data);
          this.arrCep.push(data.cep)
          this.arrBairro.push(data.bairro)
          this.arrCidade.push(data.localidade)
          this.arrComp.push(data.complemento)
        });
      })
    }
  }

}
