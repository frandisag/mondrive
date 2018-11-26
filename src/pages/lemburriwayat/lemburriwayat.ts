import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ToastController, LoadingController } from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';
import { LemburdetailPage } from '../lemburdetail/lemburdetail';
import { GetfilterPage } from '../getfilter/getfilter';

/**
 * Generated class for the LemburriwayatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-lemburriwayat',
  templateUrl: 'lemburriwayat.html',
})
export class LemburriwayatPage {

  items: any;
  carData: any;
  nodata: boolean = false;
	totalitems : Number = 0;
  responseData: any;
  color: any;

  param= {
    "token":"",
    "EmployeeId":"",
    "startdate":"",
    "enddate":"",
    "OccupationCode":"",
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
    this.inIt()
  }

  inIt(){
  	const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.OccupationCode = data.userData.OccupationCode;
    this.param.startdate = "";
    this.param.enddate = "";
    this.param.start = 0;
    this.param.end = 10;

    // let loadingPopup = this.loadingCtrl.create({
    //   content: 'Loading data...'
    // });
    //loadingPopup.present();
    this.connect.postData(this.param, "getListRiwayatLembur").then((result) =>{
      this.responseData = result;

      if(this.responseData.dataLembur){
        this.items = this.responseData.dataLembur;
        
        if (this.items.length > 0) {
          this.nodata = false
        }else{
          this.nodata = true
        }
        this.totalitems = this.responseData.totalLembur;
        //loadingPopup.dismiss();
      }else{
        //loadingPopup.dismiss();
        this.presentToast(this.responseData.error.text);    
      }
    }, (err) => {
      //loadingPopup.dismiss();
      this.presentToast("Koneksi Bermasalah");
    });
  }

  opendetail(item){
    const data = JSON.parse(localStorage.getItem('userData'));
  	let profileModal = this.modalCtrl.create(LemburdetailPage,{
      param: item,
      page: 'riwayat',
      OccupationCode: data.userData.OccupationCode
    });
    profileModal.onDidDismiss(data => {
      //console.log(data);
      if (data) {
        this.inIt();
      }
    });
    profileModal.present();
  }

  doInfinite(): Promise<any> {
    const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.start = this.param.end;
    this.param.end = this.param.end + 10 ;
    
    return new Promise((resolve) => {
      setTimeout(() => {
        
        this.connect.postData(this.param, "getListRiwayatLembur").then((result) => {
          this.responseData = result;
          
          if (this.responseData.dataLembur) {
            for (let i = 0; i < this.responseData.dataLembur.length; i++) {
							const data = this.responseData.dataLembur[i];
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
        this.connect.postData(this.param, "getListRiwayatLembur").then((result) =>{
          this.responseData = result;
          if(this.responseData.dataLembur){
            this.items = this.responseData.dataLembur;
        		this.totalitems = this.responseData.totalLembur;
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

  doRefresh(refresher){
    this.inIt();
    refresher.complete();
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
