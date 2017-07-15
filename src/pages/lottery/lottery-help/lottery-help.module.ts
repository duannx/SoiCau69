import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryHelpPage } from './lottery-help';

@NgModule({
  declarations: [
    LotteryHelpPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryHelpPage),
  ],
  exports: [
    LotteryHelpPage
  ]
})
export class LotteryHelpModule {}
