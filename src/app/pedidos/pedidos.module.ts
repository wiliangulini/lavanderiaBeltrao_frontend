import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PedidosComponent } from './pedidos.component';

const routes: Routes = [
  { path: '', component: PedidosComponent }
];

@NgModule({
  declarations: [PedidosComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PedidosModule { }
