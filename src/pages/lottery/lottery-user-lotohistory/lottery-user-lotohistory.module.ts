import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryUserLotoHistoryPage } from './lottery-user-lotohistory';

@NgModule({
  declarations: [
    LotteryUserLotoHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryUserLotoHistoryPage),
  ],
  exports: [
    LotteryUserLotoHistoryPage
  ]
})
export class LotteryUserMoneyModule {}
