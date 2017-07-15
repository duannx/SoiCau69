import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotterySoicauPage } from './lottery-soicau';

@NgModule({
  declarations: [
    LotterySoicauPage,
  ],
  imports: [
    IonicPageModule.forChild(LotterySoicauPage),
  ],
  exports: [
    LotterySoicauPage
  ]
})
export class LotterySoicauPageModule {}
