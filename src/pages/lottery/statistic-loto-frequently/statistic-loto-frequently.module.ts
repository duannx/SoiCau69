import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoFrequentlyPage } from './statistic-loto-frequently';

@NgModule({
  declarations: [
    StatisticLotoFrequentlyPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoFrequentlyPage),
  ],
  exports: [
    StatisticLotoFrequentlyPage
  ]
})
export class StatisticLotoFrequentlyPageModule {}
