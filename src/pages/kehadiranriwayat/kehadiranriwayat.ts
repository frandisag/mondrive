import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController} from 'ionic-angular';
import { GetfilterPage } from '../getfilter/getfilter';
import { KehadirandetailPage } from '../kehadirandetail/kehadirandetail';

import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the KehadiranriwayatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-kehadiranriwayat',
  templateUrl: 'kehadiranriwayat.html',
})
export class KehadiranriwayatPage {

  items: any;
  totalitems: Number = 0;
  nodata: boolean = false;
  responseData: any;
  color: any;
  param= {
    "token":"",
    "EmployeeId":"",
    "startdate":"",
    "enddate":"",
    "start": 0,
    "end": 0
  };

  constructor(
  	public navCtrl: NavController, 
  	public modalCtrl:ModalController,
    public toastController: ToastController,
    public loadingCtrl: LoadingController,
    public connect: ConnectProvider,
  	public navParams: NavParams) {
    this.inIt();
  }

  inIt(){
    const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.startdate = "";
    this.param.enddate = "";
    this.param.start = 0;
    this.param.end = 10;

    this.connect.postData(this.param, "getListKehadiran").then((result) =>{
      this.responseData = result;
      this.color="button";

      if(this.responseData.dataKehadiran){
        this.items = this.responseData.dataKehadiran;
        this.totalitems = this.responseData.totalDataKehadiran;
        if (this.items.length > 0) {
          this.nodata = false
        }else{
          this.nodata = true
        }
      }else{
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      this.presentToast("Koneksi Bermasalah");
    });
  }

  doRefresh(refresher){
    this.inIt();
    refresher.complete();
  }

  doInfinite(): Promise<any> {
    const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.start = this.param.end;
    this.param.end = this.param.end + 10 ;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.connect.postData(this.param, "getListKehadiran").then((result) => {
          this.responseData = result;
          
          if (this.responseData.dataKehadiran) {
            for (let i = 0; i < this.responseData.dataKehadiran.length; i++) {
              const data = this.responseData.dataKehadiran[i];
              this.items.push(data);
            }
          }else{
            this.presentToast(this.responseData.error.text);
          }
        },(err)=>{
          this.presentToast("Connection Problem");
        }) 
        
        resolve();
      }, 500);
    })
  }

  opendetail(AttendanceTime){
    const data = JSON.parse(localStorage.getItem('userData'));
    let detailModal = this.modalCtrl.create(KehadirandetailPage,{
      AttendanceTime: AttendanceTime,
      EmployeeId: data.userData.EmployeeId
    });
    detailModal.onDidDismiss(data => {
      
    });
    detailModal.present();
  }

  getFilter(){
    let profileModal = this.modalCtrl.create(GetfilterPage,{
      startdate: this.param.startdate,
      enddate: this.param.enddate
    });
    profileModal.onDidDismiss(data => {
      if (data) {
        let loadingPopup = this.loadingCtrl.create({
          content: 'Loading data...'
        });
        const local = JSON.parse(localStorage.getItem('userData'));
    
        this.param.EmployeeId = local.userData.EmployeeId;
        this.param.token = local.userData.token;
        this.param.startdate = data.startdate;
        this.param.enddate = data.enddate;
        this.param.start = 0;
        this.param.end = 10;

        if (data.startdate != "" && data.enddate != ""){
          this.color="danger";
        }else{
          this.color="button";
        }

        loadingPopup.present();
        this.connect.postData(this.param, "getListKehadiran").then((result) =>{
          this.responseData = result;
          if(this.responseData.dataKehadiran){
            this.items = this.responseData.dataKehadiran;
            this.totalitems = this.responseData.totalDataKehadiran;
            if (this.items.length > 0) {
              this.nodata = false
            }else{
              this.nodata = true
            }
            loadingPopup.dismiss();
          }else{
            loadingPopup.dismiss();
            this.presentToast(this.responseData.error.text);    
          }
        }, (err) => {
          loadingPopup.dismiss();
          this.presentToast("Koneksi Bermasalah");
        });
      }
    });
    profileModal.present();
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

}
