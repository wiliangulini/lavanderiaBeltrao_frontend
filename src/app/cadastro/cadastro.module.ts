import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CadastroComponent } from './cadastro.component';

const routes: Routes = [
  { path: '', component: CadastroComponent }
];

@NgModule({
  declarations: [CadastroComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class CadastroModule { }
