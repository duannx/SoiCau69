import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticLotoPage } from './statistic-loto';

@NgModule({
  declarations: [
    StatisticLotoPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticLotoPage),
  ],
  exports: [
    StatisticLotoPage
  ]
})
export class StatisticLotoPageModule { }
