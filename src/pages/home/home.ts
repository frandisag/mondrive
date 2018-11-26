import { Component } from '@angular/core';
import { NavController, ToastController, Events} from 'ionic-angular';

import { TabskehadiranPage } from '../tabskehadiran/tabskehadiran';
import { TabsbahanbakarPage } from '../tabsbahanbakar/tabsbahanbakar';
import { TabsorderPage } from '../tabsorder/tabsorder';
import { TabsbukuteleponPage } from '../tabsbukutelepon/tabsbukutelepon';
import { TabslemburPage } from '../tabslembur/tabslembur';

import { ConnectProvider } from '../../providers/connect/connect';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	userData;
  responseData: any;
  countnotif: number = 0;
  countlemburnotif: number = 0;
  OnJobStatus: number = 0;

   param = {
    "token":"",
    "EmployeeId":"",
    "OccupationCode":""
   }

  constructor(
    public navCtrl: NavController,
    public toastController: ToastController,
    public events: Events,
    public connect: ConnectProvider) {
    events.subscribe('removeNotif', (notif) => {
      this.countnotif = this.countnotif - 1;
    });
    events.subscribe('addNotif', (notif) => {
      this.countnotif = this.countnotif + 1;
    });
    events.subscribe('removeNotifLembur', (notif) => {
      this.countlemburnotif = this.countlemburnotif - 1;
    });
    events.subscribe('addNotifLembur', (notif) => {
      this.countlemburnotif = this.countlemburnotif + 1;
    });
    events.subscribe('changeStatus', (notif) => {
      this.OnJobStatus = notif
    });
  	this.inIt();
  }

  doRefresh(refresher){
    this.inIt();
    refresher.complete();
  }

  inIt(){
  	const localdata = JSON.parse(localStorage.getItem('userData'));
  	this.userData = localdata.userData;

    this.param.token = localdata.userData.token;
    this.param.EmployeeId = localdata.userData.EmployeeId;
    this.param.OccupationCode = localdata.userData.OccupationCode;
    this.connect.postData(this.param, "getCountNotifDev").then((result) =>{
      this.responseData = result;

      if(this.responseData.dataCountNotif){
        this.countnotif = this.responseData.dataCountNotif;
      }

      if(this.responseData.dataCountLemburNotif){
        this.countlemburnotif = this.responseData.dataCountLemburNotif;
      }

      if(this.responseData.dataOnJobStatus){
        this.OnJobStatus = this.responseData.dataOnJobStatus;
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
    });
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      dismissOnPageChange: true
    });
    toast.present();
  }

  openkehadiran(){
    this.navCtrl.push(TabskehadiranPage,{},{
      animate: true,
      animation: 'ios-transition'
    });
  }

  openbahanbakar(){
    this.navCtrl.push(TabsbahanbakarPage,{},{
      animate: true,
      animation: 'ios-transition'
    });
  }

  openorder(){
    this.navCtrl.push(TabsorderPage,{},{
      animate: true,
      animation: 'ios-transition'
    });
  }

  openbukutelepon(){
    this.navCtrl.push(TabsbukuteleponPage,{},{
      animate: true,
      animation: 'ios-transition'
    });
  }

  openlembur(){
    this.navCtrl.push(TabslemburPage,{},{
      animate: true,
      animation: 'ios-transition'
    });
  }

}
