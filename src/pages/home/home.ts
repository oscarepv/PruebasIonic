import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { SMS } from '@ionic-native/sms';
import { OneSignal } from '@ionic-native/onesignal';
import {Camera, CameraOptions, EncodingType} from '@ionic-native/camera';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import {  storage ,initializeApp } from 'firebase';
import firebase from 'firebase';
import * as $ from "jquery";
import * as xml2js from 'xml2js';

export const firebaseConfig = {
  apiKey: "AIzaSyCpTTC60cKaQ2K_N4XX2GUWGJeyYjKcBX4",
  authDomain: "notiionic.firebaseapp.com",
  databaseURL: "https://notiionic.firebaseio.com",
  projectId: "notiionic",
  storageBucket: "notiionic.appspot.com",
  messagingSenderId: "478996604377"

};

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  contenidoFoto;
  constructor(public navCtrl: NavController,
              private device: Device,
              private network: Network,
              private sms: SMS,
              private oneSignal: OneSignal,
              private camera: Camera,
              private filePath: FilePath,
              private file: File,
              private transfer: FileTransfer,
              private _fdb: AngularFireDatabase) {

    initializeApp(firebaseConfig);
  //alert(this.device.uuid);
  console.log('Device UUID is: ' + this.device.uuid);
  console.log(this.network.type);
  if(this.network.type == "none" || this.network.type == "unknown"){
  	console.log('no hay red');
  }

  }

  enviarSMS(){
    let wsUrl = "https://www.w3schools.com/xml/tempconvert.asmx?op=CelsiusToFahrenheit";

    let soapRequest =
      '<?xml version="1.0" encoding="utf-8"?>\
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
        <soap:Body>\
          <CelsiusToFahrenheit xmlns="https://www.w3schools.com/xml/">\
            <Celsius>-17.7778</Celsius>\
          </CelsiusToFahrenheit>\
        </soap:Body>\
      </soap:Envelope>';

    /*let wsUrl = "http://192.168.0.42:8080/UbicacionES/UbicacionES?tester";
    let soapRequest =
      '<?xml version="1.0" encoding="UTF-8"?>\
      <S:Envelope xmlns:S="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">\
          <SOAP-ENV:Header/>\
          <S:Body>\
              <ns2:parroquias xmlns:ns2="http://ws.codigos.com/">\
                <zona>04</zona>\
              </ns2:parroquias>\
          </S:Body>\
      </S:Envelope>';*/

    /* let wsUrl = "http://wsnewideas1.gerenciall.com/service.asmx?op=HelloWorld";
     let soapRequest =
       '<?xml version="1.0" encoding="utf-8"?>\
       <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">\
         <soap:Body>\
           <HelloWorld xmlns="http://tempuri.org/" />\
         </soap:Body>\
       </soap:Envelope>';*/


    $.ajax({
      contentType: "text/xml",
      dataType: "text",
      url: wsUrl,
      type: 'POST',
      data: soapRequest,


      success: (data) => {
        //this.viewMessage(JSON.stringify(data));
        console.log('Hmmm we had a success response', data);



        //console.log(xml2js.toJson(data));

        /*xml2js.parseString(data, { trim:true, explicitArray: false }, (error, result) => {
          if (error) {
            throw new Error(error);
          } else {
            console.log(result);
          }
        });*/


        console.log(data.toString());
         xml2js.parseString(data.toString(), function (err, result) {

           console.log(result["soap:Envelope"]["soap:Body"]["0"].CelsiusToFahrenheitResponse["0"].CelsiusToFahrenheitResult[0]);
         });

        /*xml2js.parseString(data, ((result) => {
          console.log(result);
          return result;
        }));
        /*xml2js.parseString(data, function (err, result) {
          console.log(result);
        });*/

        //this.convertXmltoJson(data);
      },
      error: (err) => {
        //this.viewMessage(JSON.stringify(err));
        console.log('Error :(', err);
      }
    });

  //this.sms.send('0984864415', 'Hello world!');
  }

  enviarNoti(){
  	let obj: any = {
  		headings: {en:"Seguridad soy yo"},
  		contents: {en: "El sr(a) Oscar Eduardo Pullay Vinueza tienes una alerta de robo"},
  		include_player_ids: ['b7633f58-aae9-47bc-a80b-28b11177c446']
  	}
  	this.oneSignal.postNotification(obj).then(()=>{
  		alert('enviado');
  	}).catch(()=>{
  		alert('error');
  	});
  }

  recuperFotoGelary(){
    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      correctOrientation: true
    }
    this.camera.getPicture(option).then(imagenData =>{
      alert(imagenData);
      const selfieRef = firebase.storage().ref('profilePictures/user1/profilePicture.png');
      selfieRef
        .putString(imagenData, 'base64', {contentType: 'image/png'})
        .then(savedProfilePicture => {
          firebase
            .database()
            .ref(`users/user1/profilePicture`)
            .set(savedProfilePicture.downloadURL);
        });
      this.contenidoFoto = 'data:image/jpeg:base64',+imagenData;
    }).catch(error=>{
      alert(error);
    });
  }

  tomarFoto(){
    let option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.CAMERA,
      targetWidth: 600,
      targetHeight: 300,
      //allowEdit: true,
      correctOrientation: true,
      saveToPhotoAlbum:false
    }
    this.camera.getPicture(option).then(imagenData =>{
      this.contenidoFoto = 'data:image/jpeg:base64',+imagenData;
    }).catch(error=>{
      alert(error);
    });
  }

  enviaFoto(){
    let option: CameraOptions = {
      quality: 100,
      encodingType: EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      targetWidth: 600,
      targetHeight: 300,
      correctOrientation: true
    }
    this.camera.getPicture(option).then(imagenPath =>{
     this.uploadFile(imagenPath);
    }).catch(error=>{
      alert(error);
    });
  }


  uploadFile(imagenPath){
    let fileTransfer: FileTransferObject = this.transfer.create();
    let option: FileUploadOptions = {
      fileKey: 'file',
      fileName: 'ionic.png',
      mimeType: 'image/png',
      headers: {},
      chunkedMode: false
    }
    fileTransfer.upload(imagenPath,"http://").then( data =>{
      console.log(data);
      }

    ).catch(error =>{
      console.log(error);
    });
  }

  async takePhoto(){
    //try {} catch {}
    const options: CameraOptions = {
      quality: 50,
      targetHeight: 600,
      targetWidth: 600,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then(imageData =>{
      const image = `data:image/jpeg;base64,${imageData}`;
      const pictures = storage().ref('pictures');
      pictures.putString(image,'data_url');

    }).catch(error =>{
      alert(error);
    })
  }

}
