import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { ConnectProvider } from '../../providers/connect/connect';
import { Camera, CameraOptions } from "@ionic-native/camera";  

/**
 * Generated class for the BahanbakarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-bahanbakar',
  templateUrl: 'bahanbakar.html',
})
export class BahanbakarPage {

	responseData: any;
  param= {
    "token":"",
    "EmployeeId":"",
    "CarBankId":"",
    "avatar":"",
    "KmPengisian":"",
    "Harga":"",
    "TanggalPengisian":"",
    "Catatan":"",
    "Volume":""
  };
  cars: any;

  constructor(
  	public navCtrl: NavController, 
  	public toastController: ToastController,
    public connect: ConnectProvider,
    public camera: Camera,
  	public navParams: NavParams) {
  	this.inIt();
  }

  inIt(){
  	const data = JSON.parse(localStorage.getItem('userData'));
    
    this.param.EmployeeId = data.userData.EmployeeId;
    this.param.token = data.userData.token;
    this.param.CarBankId = data.userData.CarBankId;

    this.connect.postData(this.param, "getCars").then((result) =>{
      this.responseData = result;

      if(this.responseData.carData){
        this.cars = this.responseData.carData;
      }else{
        this.presentToast(this.responseData.error.text);    
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

  getPhoto() {
    const options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData)=>{
      this.param.avatar = "data:image/jpeg;base64," + imageData;
    },(err)=>{
      this.presentToast(err);
    });
  }

  simpan(){
    if (
      this.param.avatar != "" 
      && this.param.CarBankId != "" 
      && this.param.Harga != "" 
      && this.param.TanggalPengisian != "" 
      && this.param.Volume != "" 
      && this.param.KmPengisian != "") {
      const data = JSON.parse(localStorage.getItem('userData'));
    
      this.param.EmployeeId = data.userData.EmployeeId;
      this.param.token = data.userData.token;
      this.param.CarBankId = data.userData.CarBankId;
      this.connect.postData(this.param, "acceptBahanbakar").then((result) =>{
        this.responseData = result;

        if(this.responseData.success){
          this.param = {
            "token": data.userData.token,
            "EmployeeId": data.userData.EmployeeId,
            "CarBankId": data.userData.CarBankId,
            "avatar":"",
            "Volume":"",
            "KmPengisian":"",
            "Harga":"",
            "TanggalPengisian":"",
            "Catatan":""
          };
          this.presentToast("Sukses Mengirim");
        }else{
          this.presentToast("Koneksi Bermasalah");    
        }
      }, (err) => {
        this.presentToast("Koneksi Bermasalah");
      });
    }else{
      this.presentToast("Isi data yang kosong !");
    }
  }

}
