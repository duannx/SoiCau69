import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryDauTuPage } from './lottery-dautu';

@NgModule({
  declarations: [
    LotteryDauTuPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryDauTuPage),
  ],
  exports: [
    LotteryDauTuPage
  ]
})
export class LotteryDauTuPageModule {}
