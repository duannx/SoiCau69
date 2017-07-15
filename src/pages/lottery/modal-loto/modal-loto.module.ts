import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLotoPage } from './modal-loto';

@NgModule({
  declarations: [
    ModalLotoPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLotoPage),
  ],
  exports: [
    ModalLotoPage
  ]
})
export class ModalLotoPageModule {}
