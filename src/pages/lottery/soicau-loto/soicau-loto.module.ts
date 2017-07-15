import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SoicauLotoPage } from './soicau-loto';

@NgModule({
  declarations: [
    SoicauLotoPage,
  ],
  imports: [
    IonicPageModule.forChild(SoicauLotoPage),
  ],
  exports: [
    SoicauLotoPage
  ]
})
export class SoicauLotoPageModule {}
