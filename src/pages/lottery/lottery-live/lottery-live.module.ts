import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryLivePage } from './lottery-live';

@NgModule({
  declarations: [
    LotteryLivePage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryLivePage),
  ],
  exports: [
    LotteryLivePage
  ]
})
export class LotteryLivePageModule {}
