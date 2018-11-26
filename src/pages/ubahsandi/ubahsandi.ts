import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';

import { ConnectProvider } from '../../providers/connect/connect';

/**
 * Generated class for the UbahsandiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-ubahsandi',
  templateUrl: 'ubahsandi.html',
})
export class UbahsandiPage {

	param = {
		"sandilama":"",
		"sandibaru1":"",
		"sandibaru2":"",
		"token":"",
		"EmployeeId":""

	}

	responseData: any;
	userDetails:any;

  constructor(
  	public navCtrl: NavController, 
  	public toastController: ToastController,
  	public connect: ConnectProvider,
  	public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UbahsandiPage');
  }

  simpan(){
  	if (this.param.sandilama != "" && this.param.sandibaru1 != "" && this.param.sandibaru2 != "") {
  		if (this.param.sandibaru1 == this.param.sandibaru2) {
  			const data =  JSON.parse(localStorage.getItem('userData'));
      	this.userDetails = data.userData;

      	this.param.EmployeeId = this.userDetails.EmployeeId;
      	this.param.token = this.userDetails.token;

	  		this.connect.postData(this.param, "changepassword").then((result) =>{
	        this.responseData = result;
	        console.log(this.responseData);
	        if(!this.responseData.success){
	          this.presentToast(this.responseData.error.text);    
	        }else{
	        	this.presentToast(this.responseData.success.text);
	        }
	      }, (err) => {
	        this.presentToast("Koneksi Bermasalah");
	      });
	  	}else{
	  		this.presentToast("Kata Sandi Baru Tidak Sama !");
	  	}
  	}else{
  		this.presentToast("Isi data yang kosong...");
  	}
  }

  presentToast(msg) {
    let toast = this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toast.present();
  }

}
