import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuBachThuPage } from './dautu-bachthu';

@NgModule({
  declarations: [
    DauTuBachThuPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuBachThuPage),
  ],
  exports: [
    DauTuBachThuPage
  ]
})
export class DauTuBachThuPageModule {}
