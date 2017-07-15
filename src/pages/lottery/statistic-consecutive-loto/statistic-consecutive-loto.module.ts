import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticConsecutiveLotoPage } from './statistic-consecutive-loto';

@NgModule({
  declarations: [
    StatisticConsecutiveLotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticConsecutiveLotoPage),
  ],
  exports: [
    StatisticConsecutiveLotoPage
  ]
})
export class StatisticConsecutiveLotoPageModule {}
