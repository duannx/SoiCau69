import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoGanPage } from './statistic-loto-gan';

@NgModule({
  declarations: [
    StatisticLotoGanPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoGanPage),
  ],
  exports: [
    StatisticLotoGanPage
  ]
})
export class StatisticLotoGanPageModule {}
