import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryStatisticPage } from './lottery-statistic';

@NgModule({
  declarations: [
    LotteryStatisticPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryStatisticPage),
  ],
  exports: [
    LotteryStatisticPage
  ]
})
export class LotteryStatisticModule {}
