import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PedidosComponent} from './pedidos/pedidos.component';
import {NavbarComponent} from './navbar/navbar.component';
import {PesquisaComponent} from './pesquisa/pesquisa.component';
import {ErrorMsgComponent} from './shared/error-msg/error-msg.component';
import {CadastroComponent} from './cadastro/cadastro.component';
import {BuscaCepComponent} from './busca-cep/busca-cep.component';
import {EditarComponent} from './editar/editar.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { InputClientComponent } from './input-client/input-client.component';
import { FormularioComponent } from './formulario/formulario.component';
import { FormClienteComponent } from './form-cliente/form-cliente.component';
import {MatRadioModule} from '@angular/material/radio';

@NgModule({
    declarations: [
        AppComponent,
        PedidosComponent,
        NavbarComponent,
        PesquisaComponent,
        ErrorMsgComponent,
        CadastroComponent,
        BuscaCepComponent,
        EditarComponent,
        InputClientComponent,
        FormularioComponent,
        FormClienteComponent,
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatRadioModule
  ],
  exports: [
    InputClientComponent,
    MatRadioModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
