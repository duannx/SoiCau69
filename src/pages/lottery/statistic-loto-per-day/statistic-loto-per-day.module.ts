import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoPerDayPage } from './statistic-loto-per-day';

@NgModule({
  declarations: [
    StatisticLotoPerDayPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoPerDayPage),
  ],
  exports: [
    StatisticLotoPerDayPage
  ]
})
export class StatisticLotoPerDayPageModule {}
