import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryUserMoneyPage } from './lottery-user-money';

@NgModule({
  declarations: [
    LotteryUserMoneyPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryUserMoneyPage),
  ],
  exports: [
    LotteryUserMoneyPage
  ]
})
export class LotteryUserMoneyModule {}
