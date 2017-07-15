import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DatePicker } from '@ionic-native/date-picker';

import { Device } from '@ionic-native/device';
  
import { Keyboard } from '@ionic-native/keyboard';


import { HttpService } from '../providers/http-service';
import { LotteryHttpService } from '../providers/lottery/lottery-http-service';
import { LotteryConstants } from '../providers/lottery/lottery-constant';
import { LotteryDBCenter } from '../providers/lottery/lottery';    
import { DeviceInfoProvider } from '../providers/device-info/device-info';
import { LotteryHomePage } from '../pages/lottery/lottery-home/lottery-home'

@NgModule({
  declarations: [
    MyApp,
    LotteryHomePage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LotteryHomePage
  ],
  providers: [
    Device,
    StatusBar,
    SplashScreen,
    DatePicker, 
    Keyboard,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    HttpService,
    LotteryHttpService,
    LotteryConstants,
    LotteryDBCenter,
    DeviceInfoProvider,
  ]
})
export class AppModule { }
