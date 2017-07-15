import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatisticTestPage } from './statistic-test';

@NgModule({
  declarations: [
    StatisticTestPage,
  ],
  imports: [
    IonicPageModule.forChild(StatisticTestPage),
  ],
  exports: [
    StatisticTestPage
  ]
})
export class StatisticTestPageModule { }
