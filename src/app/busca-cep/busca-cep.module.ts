import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { BuscaCepComponent } from './busca-cep.component';

const routes: Routes = [
  { path: '', component: BuscaCepComponent }
];

@NgModule({
  declarations: [BuscaCepComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class BuscaCepModule { }
