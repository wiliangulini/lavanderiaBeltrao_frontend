import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/registrar-pedido', pathMatch: 'full' },
  {
    path: 'registrar-pedido',
    loadChildren: () => import('./pedidos/pedidos.module').then(m => m.PedidosModule)
  },
  {
    path: 'pesquisar-pedido',
    loadChildren: () => import('./pesquisa/pesquisa.module').then(m => m.PesquisaModule)
  },
  {
    path: 'cadastrar-clientes',
    loadChildren: () => import('./cadastro/cadastro.module').then(m => m.CadastroModule)
  },
  {
    path: 'buscar-cep',
    loadChildren: () => import('./busca-cep/busca-cep.module').then(m => m.BuscaCepModule)
  },
  {
    path: 'editar-clientes',
    loadChildren: () => import('./editar/editar.module').then(m => m.EditarModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
