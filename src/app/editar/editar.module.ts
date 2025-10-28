import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { EditarComponent } from './editar.component';

const routes: Routes = [
  { path: '', component: EditarComponent }
];

@NgModule({
  declarations: [EditarComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class EditarModule { }
