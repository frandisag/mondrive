import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { NativeAudio } from '@ionic-native/native-audio';
import { Vibration } from '@ionic-native/vibration';
import { Camera } from '@ionic-native/camera';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Push } from '@ionic-native/push';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { MenusPage } from '../pages/menus/menus';
import { TabskehadiranPage } from '../pages/tabskehadiran/tabskehadiran';
import { KehadiranPage } from '../pages/kehadiran/kehadiran';
import { KehadiranriwayatPage } from '../pages/kehadiranriwayat/kehadiranriwayat';
import { TabsbahanbakarPage } from '../pages/tabsbahanbakar/tabsbahanbakar';
import { BahanbakarPage } from '../pages/bahanbakar/bahanbakar';
import { BahanbakarriwayatPage } from '../pages/bahanbakarriwayat/bahanbakarriwayat';
import { UbahsandiPage } from '../pages/ubahsandi/ubahsandi';
import { TabsorderPage } from '../pages/tabsorder/tabsorder';
import { OrderPage } from '../pages/order/order';
import { OrderriwayatPage } from '../pages/orderriwayat/orderriwayat';
import { TabsbukuteleponPage } from '../pages/tabsbukutelepon/tabsbukutelepon';
import { GetfilterPage } from '../pages/getfilter/getfilter';
import { OrderbuatPage } from '../pages/orderbuat/orderbuat';
import { OrderdetailPage } from '../pages/orderdetail/orderdetail';
import { KehadirandetailPage } from '../pages/kehadirandetail/kehadirandetail';
import { BahanbakardetailPage } from '../pages/bahanbakardetail/bahanbakardetail';
import { TabslemburPage } from '../pages/tabslembur/tabslembur';
import { LemburPage } from '../pages/lembur/lembur';
import { LemburriwayatPage } from '../pages/lemburriwayat/lemburriwayat';
import { LemburbuatPage } from '../pages/lemburbuat/lemburbuat';
import { LemburdetailPage } from '../pages/lemburdetail/lemburdetail';

import { ConnectProvider } from '../providers/connect/connect';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    MenusPage,
    TabskehadiranPage,
    KehadiranPage,
    KehadiranriwayatPage,
    TabsbahanbakarPage,
    BahanbakarPage,
    BahanbakarriwayatPage,
    UbahsandiPage,
    TabsorderPage,
    OrderPage,
    OrderriwayatPage,
    TabsbukuteleponPage,
    GetfilterPage,
    OrderbuatPage,
    OrderdetailPage,
    KehadirandetailPage,
    BahanbakardetailPage,
    TabslemburPage,
    LemburPage,
    LemburriwayatPage,
    LemburbuatPage,
    LemburdetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp,{
      scrollAssist: false
    }),
    SuperTabsModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    MenusPage,
    TabskehadiranPage,
    KehadiranPage,
    KehadiranriwayatPage,
    TabsbahanbakarPage,
    BahanbakarPage,
    BahanbakarriwayatPage,
    UbahsandiPage,
    TabsorderPage,
    OrderPage,
    OrderriwayatPage,
    TabsbukuteleponPage,
    GetfilterPage,
    OrderbuatPage,
    OrderdetailPage,
    KehadirandetailPage,
    BahanbakardetailPage,
    TabslemburPage,
    LemburPage,
    LemburriwayatPage,
    LemburbuatPage,
    LemburdetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ConnectProvider,
    Vibration,
    Push,
    NativeAudio,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectProvider
  ]
})
export class AppModule {}
