import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from './shared-material.module';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { InputClientComponent } from '../input-client/input-client.component';
import { FormularioComponent } from '../formulario/formulario.component';
import { FormClienteComponent } from '../form-cliente/form-cliente.component';

const SHARED_COMPONENTS = [
  ErrorMsgComponent,
  InputClientComponent,
  FormularioComponent,
  FormClienteComponent
];

@NgModule({
  declarations: SHARED_COMPONENTS,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    ...SHARED_COMPONENTS
  ]
})
export class SharedModule { }
