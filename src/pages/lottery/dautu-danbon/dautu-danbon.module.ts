import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuDanBonPage } from './dautu-danbon';

@NgModule({
  declarations: [
    DauTuDanBonPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuDanBonPage),
  ],
  exports: [
    DauTuDanBonPage
  ]
})
export class DauTuDanBonPageModule {}
