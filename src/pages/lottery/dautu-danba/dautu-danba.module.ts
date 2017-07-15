import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuDanBaPage } from './dautu-danba';

@NgModule({
  declarations: [
    DauTuDanBaPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuDanBaPage),
  ],
  exports: [
    DauTuDanBaPage
  ]
})
export class DauTuDanBaPageModule {}
