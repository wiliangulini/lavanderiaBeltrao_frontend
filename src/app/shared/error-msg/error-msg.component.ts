import {DataCrudService} from '../services/data-crud.service';
import {HttpClient} from '@angular/common/http';
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl} from '@angular/forms';
import {FormValidations} from '../form-validations';

import {ConsultaCepService} from '../services/consulta-cep.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FormularioComponent} from "../../formulario/formulario.component";


@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss']
})
export class ErrorMsgComponent extends FormularioComponent implements OnInit {

  @Input() nome: string = '';

  @Input() control!: FormControl;

  @Input() label: string = '';

  constructor(
    FB: FormBuilder,
    HTTP: HttpClient,
    CS: DataCrudService,
    CP: ConsultaCepService,
    MSB: MatSnackBar,
    CDR: ChangeDetectorRef
  ) {
    super(FB, HTTP, CS, CP, MSB, CDR);
  }

  override ngOnInit(): void {
  }

  get errorMessage() {

    for(const propertyName in this.control.errors) {
      if(this.control.errors!.hasOwnProperty(propertyName) && this.control.touched) {
        return FormValidations.getErrorMsg(this.label, propertyName, this.control.errors![propertyName])
      }
    }
    return null;
  }
}
