import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DauTuLuyTienPage } from './dautu-luytien';

@NgModule({
  declarations: [
    DauTuLuyTienPage,
  ],
  imports: [
    IonicPageModule.forChild(DauTuLuyTienPage),
  ],
  exports: [
    DauTuLuyTienPage
  ]
})
export class DauTuLuyTienPageModule {}
