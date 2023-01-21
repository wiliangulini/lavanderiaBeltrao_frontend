import { EditarComponent } from './editar/editar.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuscaCepComponent } from './busca-cep/busca-cep.component';
import { CadastroComponent } from './cadastro/cadastro.component';

import { PedidosComponent } from './pedidos/pedidos.component';
import { PesquisaComponent } from './pesquisa/pesquisa.component';

const routes: Routes = [
  {path: '', redirectTo: '/registrar-pedido', pathMatch: 'full' },
  {path: 'registrar-pedido', component: PedidosComponent },
  {path: 'pesquisar-pedido', component: PesquisaComponent },
  {path: 'cadastrar-clientes', component: CadastroComponent },
  {path: 'buscar-cep', component: BuscaCepComponent },
  {path: 'editar-clientes', component: EditarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
