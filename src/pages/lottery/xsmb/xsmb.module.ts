import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { XsmbPage } from './xsmb';

@NgModule({
  declarations: [
    XsmbPage,
  ],
  imports: [
    IonicPageModule.forChild(XsmbPage),
  ],
  exports: [
    XsmbPage
  ]
})
export class XsmbPageModule {}
