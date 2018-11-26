import { Component } from '@angular/core';
import { Platform, MenuController, AlertController, ToastController, App, Events} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { LoginPage } from '../pages/login/login';
import { MenusPage } from '../pages/menus/menus';
import { OrderdetailPage } from '../pages/orderdetail/orderdetail';
import { LemburdetailPage } from '../pages/lemburdetail/lemburdetail';

import { ConnectProvider } from '../providers/connect/connect';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage;
  param = {
    device_token : '',
    token: '',
    StatusOrder:0,
    OccupationCode: '',
    EmployeeId: '',
    OrderId:'',
    OrderByEmployeeId:'',
    CarBankId:'',
    Source:'',
    Destination:'',
    FullName:'',
    PassangerName:'',
    Note:''
  }

  responseData: any;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public menu: MenuController,
    public alertCtrl: AlertController,
    public push: Push,
    public events: Events,
    public app: App,
    public connect: ConnectProvider,
    public toastCtrl : ToastController,
    public splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initPushNotification();
      statusBar.styleDefault();
	    if (platform.is('android')) {
        statusBar.overlaysWebView(false);
        statusBar.backgroundColorByHexString('#000000');
      }
      splashScreen.hide();
    });
  }

  initPushNotification(){
    const options: PushOptions = {
      android: {
        sound: 'default',
        vibrate: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: true
      },
      windows: {}
    };

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) =>{
      if (localStorage.getItem('userData')) {
        const data =  JSON.parse(localStorage.getItem('userData'));
        if (notification.additionalData.function == 'createOrder') {
          if (data.userData.OccupationCode == 'DRV') {
            //alert(JSON.stringify(notification.additionalData.eventData));
            this.events.publish('addNotif', 1);
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getRootNav().push(OrderdetailPage,{
                    param: notification.additionalData.eventData,
                    carData: notification.additionalData.carData,
                    page: 'order',
                    OccupationCode: data.userData.OccupationCode
                  });

                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'createLembur') {
          if (data.userData.OccupationCode == 'GA') {
            //alert(JSON.stringify(notification.additionalData.eventData));
            this.events.publish('addNotifLembur', 1);
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getRootNav().push(LemburdetailPage,{
                    param: notification.additionalData.eventData,
                    page: 'lembur',
                    OccupationCode: data.userData.OccupationCode
                  });

                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'updateOrder') {
          if (data.userData.OccupationCode == 'GA') {
            //alert(JSON.stringify(notification.additionalData.eventData));
            this.events.publish('removeNotif', 1);
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getRootNav().push(OrderdetailPage,{
                    param: notification.additionalData.eventData,
                    carData: notification.additionalData.carData,
                    page: 'order',
                    OccupationCode: data.userData.OccupationCode
                  });

                }
              }]
            });
            confirmAlert.present();
          }
        }

        if (notification.additionalData.function == 'updateLembur') {
          if (data.userData.OccupationCode == 'DRV') {
            //alert(JSON.stringify(notification.additionalData.eventData));
            this.events.publish('removeNotifLembur', 1);
            let confirmAlert = this.alertCtrl.create({
              title: 'Notification',
              message: notification.title,
              buttons: [{
                text: 'Ignore',
                role: 'cancel'
              },{
                text: 'View',
                handler: () => {
                  this.app.getRootNav().push(LemburdetailPage,{
                    param: notification.additionalData.eventData,
                    page: 'lembur',
                    OccupationCode: data.userData.OccupationCode
                  });

                }
              }]
            });
            confirmAlert.present();
          }
        }
      }
    });

    if (localStorage.getItem('device_token')) {
      if (localStorage.getItem('userData')) {
        this.rootPage = MenusPage ;
      }else{
        this.rootPage = LoginPage ;
      }
    }else{
      pushObject.on('registration').subscribe((registration: any) => {
        localStorage.setItem('device_token', registration.registrationId)
      });

      if (localStorage.getItem('userData')) {
        this.rootPage = MenusPage ;
      }else{
        this.rootPage = LoginPage ;
      }
    }

    pushObject.on('error').subscribe(error => {
      this.presentToast("Device Problem, Please restart Device");
    });

    pushObject.on('tolakOrder').subscribe(data => {
      this.tolakOrder(data.additionalData.eventData);
    });

    pushObject.on('terimaOrder').subscribe(data => {
      this.terimaOrder(data.additionalData.eventData);
    });

  }

  tolakOrder(order){
    const user = JSON.parse(localStorage.getItem('userData'));
    this.param.StatusOrder = 2;
  
    this.param.EmployeeId = user.userData.EmployeeId;
    this.param.token = user.userData.token;
    this.param.OccupationCode = user.userData.OccupationCode;
    this.param.OrderId = order.OrderId;
    this.param.OrderByEmployeeId = order.OrderByEmployeeId;
    this.param.CarBankId = order.CarBankId;
    this.param.Source = order.Source;
    this.param.Destination = order.Destination;
    this.param.FullName = order.FullName;
    this.param.PassangerName = order.PassangerName;
    this.param.Note = order.Note;
    
    this.connect.postData(this.param, "updateOrder").then((result) =>{
      this.responseData = result;
      if(this.responseData.success){
        this.events.publish('removeNotif', 1);
      }else{
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
    });
  }

  terimaOrder(order){
    const user = JSON.parse(localStorage.getItem('userData'));
    this.param.StatusOrder = 1;
  
    this.param.EmployeeId = user.userData.EmployeeId;
    this.param.token = user.userData.token;
    this.param.OccupationCode = user.userData.OccupationCode;
    this.param.OrderId = order.OrderId;
    this.param.OrderByEmployeeId = order.OrderByEmployeeId;
    this.param.CarBankId = order.CarBankId;
    this.param.Source = order.Source;
    this.param.Destination = order.Destination;
    this.param.FullName = order.FullName;
    this.param.PassangerName = order.PassangerName;
    this.param.Note = order.Note;
    
    this.connect.postData(this.param, "updateOrder").then((result) =>{
      this.responseData = result;
      if(this.responseData.success){
        this.events.publish('removeNotif', 1);
      }else{
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
}

