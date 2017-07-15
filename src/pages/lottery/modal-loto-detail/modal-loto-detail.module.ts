import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalLotoDetailPage } from './modal-loto-detail';

@NgModule({
  declarations: [
    ModalLotoDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalLotoDetailPage),
  ],
  exports: [
    ModalLotoDetailPage
  ]
})
export class ModalLotoDetailPageModule {}
