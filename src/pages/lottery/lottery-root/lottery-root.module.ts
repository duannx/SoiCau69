import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LotteryRootPage } from './lottery-root';

@NgModule({
  declarations: [
    LotteryRootPage,
  ],
  imports: [
    IonicPageModule.forChild(LotteryRootPage),
  ],
  exports: [
    LotteryRootPage
  ]
})
export class LotteryRootPageModule {}
