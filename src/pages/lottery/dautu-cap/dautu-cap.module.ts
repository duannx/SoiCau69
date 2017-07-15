import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuCapPage } from './dautu-cap';

@NgModule({
  declarations: [
    DauTuCapPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuCapPage),
  ],
  exports: [
    DauTuCapPage
  ]
})
export class DauTuCapPageModule {}
