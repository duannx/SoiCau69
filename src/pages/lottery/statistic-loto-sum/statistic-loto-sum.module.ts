import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoSumPage } from './statistic-loto-sum';

@NgModule({
  declarations: [
    StatisticLotoSumPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoSumPage),
  ],
  exports: [
    StatisticLotoSumPage
  ]
})
export class StatisticLotoSumPageModule {}
