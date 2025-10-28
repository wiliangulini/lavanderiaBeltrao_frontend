import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { PesquisaComponent } from './pesquisa.component';

const routes: Routes = [
  { path: '', component: PesquisaComponent }
];

@NgModule({
  declarations: [PesquisaComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PesquisaModule { }
