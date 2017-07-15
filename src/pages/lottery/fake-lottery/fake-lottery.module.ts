import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FakeLotteryPage } from './fake-lottery';

@NgModule({
  declarations: [
    FakeLotteryPage,
  ],
  imports: [
    IonicPageModule.forChild(FakeLotteryPage),
  ],
  exports: [
    FakeLotteryPage
  ]
})
export class FakeLotteryPageModule {}
