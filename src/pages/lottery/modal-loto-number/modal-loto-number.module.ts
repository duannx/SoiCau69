import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLotoNumberPage } from './modal-loto-number';

@NgModule({
  declarations: [
    ModalLotoNumberPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLotoNumberPage),
  ],
  exports: [
    ModalLotoNumberPage
  ]
})
export class ModalLotoNumberPageModule {}
