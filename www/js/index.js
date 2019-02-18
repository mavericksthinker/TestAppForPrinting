/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
  var ENTER_KEY = 13;
  var customPrinter = document.getElementById('custom');
  var printerList = document.getElementById('printerlist');
  let printer;
  let darkDialogTheme = "{theme : 'DEVICE_DARK',progressStyle : 'SPINNER',cancelable : true,title : 'Please Wait...',message : 'Scanning for Wifi printers...'}";

  var connected = false,i=0;
  var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        console.log('Received Event: ' + id);
            }
        };

        //List the printers available(Bluetooth, USB & WifiPrinter)
        function findBluetoothPrinters(){
         bluetoothList(function (data) {
           console.log("Success");
           console.log(data); //list of printer in data array
           listPrinters(data);
        }, function (err) {
               console.log("Error");
               console.log(err);
         });
        }

        function findWifiPrinters(){

           initDialog(function (data) {
              console.log(data);
           }, function (err) {
               console.log("Unable to initiate");
               console.log(err);
              }, darkDialogTheme);

           wifiList(function (data) {
             console.log("Success");
             console.log(data); //list of printer in data array
            //var printerList = document.getElementById('printerlist');
             listPrinters(data);
             }, function (err) {
                  console.log("Error");
                  console.log(err);
                });
           dismissDialog(function(msg){
             console.log(msg);
           },function(err){
             console.log("Unable to dismiss");
             console.log(err);                                                     });
         }

         function findUSBPrinters(){
            usbList(function (data) {
               console.log("Success");
               console.log(data); //list of printer in data array
               listPrinters(data);
            }, function (err) {
                 console.log("Error");
                 console.log(err);
            });
         }

         function listPrinters(list){
         var printerList = document.getElementById('printerlist');
            while (printerList.firstChild) {
              printerList.removeChild(printerList.firstChild);
            }
            var entry = document.createElement('option');
                entry.text = "select Printer";
                printerList.add(entry);

           for (p=0;p<list.length;p++) {
            var entry = document.createElement('option');
                entry.text = list[p];
                printerList.add(entry);
           }
           i = list.length+1;
         }

        //Connects to the printer
        function connectToPrinter() {
       // var list = document.getElementById("printerlist")
        printer = printerList.options[printerList.selectedIndex].text;
        console.log("Connecting to "+printer)
        connect(function (data) {
           console.log("Connection Successful with the printer");
           connected = true;
           console.log(data);
        }, function (err) {
            console.log("Error Unable to connect");
            console.log(err)
           }, printer)
           debugger;
        }

        //Disconnects from the printer
        function disconnectFromPrinter() {
           //var list = document.getElementById("printerlist")
           //var currentPrinter = list.options[list.selectedIndex].text;
           CordovaPrint.disconnect(function(data){
              console.log("Successfully Disconnected " + data);
              connected =  false;
           },function(err){
        	    console.log("Error in disconnecting "+err);
             });
        }

        //Test for POS Command and text printing
        function text_print() {
          var currentDate = new Date();
          var timeStamp = currentDate.getTime();
           CordovaPrint.posCommand(function (res) {
              console.log("Alligned to the Center"+res);
           }, function (err) {
             console.log("Error in CordovaPrint.PrintPOSCommand "+err)
           }, CordovaPrint.CENTER);
            CordovaPrint.text(function (res) {
              console.log('Text is appended to the ByteArray '+res);
              }, function (err) {
                   console.log("Error in CordovaPrint.printText() "+err);
                 },"Order No:"+timeStamp+"\n\n    Ordering Time:"+currentDate+"\n\n     HOTTAB POS\n\n     Thank you for using our POS\n\n");
            CordovaPrint.print(function (result){
               console.log("POS and Text data is sent to the printer")
            },function(err){
               console.log("Error in CordovaPrint.print() in CordovaPrint.printText "+err)
            });
     }


        //Image printing
        function image_print(){
        //have to give complete path from the sd card as the default path is set till the SD Card
           var path = "restaurant.png";
           image(function(data){
           console.log("Image data is successfully appended "+data);
           },function(err){
             console.log("Error in the CordovaPrint.printImage() "+err);
          },path,30,true,127);
           print(function(data){
             console.log("Image printing successfully done "+data);
           },function(err){
             console.log("Error in CordovaPrint.print() in CordovaPrint.printImage() "+err);
             });
        }
    /*   const justify_center = '\x1B\x61\x01';
                    const justify_left   = '\x1B\x61\x00';
                    const qr_model       = '\x32';          // 31 or 32
                    const qr_size        = '\x08';          // size
                    const qr_eclevel     = '\x33';          // error correction level (30, 31, 32, 33 - higher)
                    const qr_data        = 'http://stackoverflow.com/';
                    const qr_pL          = String.fromCharCode((qr_data.length + 3) % 256);
                    const qr_pH          = String.fromCharCode((qr_data.length + 3) / 256);

       CordovaPrint.printText(data => {
                      this.msg= 'QR code ok';
                    }, err => {
                      this.msg= 'QR code ERROR';
                    },  justify_center +
                                  '\x1D\x28\x6B\x04\x00\x31\x41' + qr_model + '\x00' +        // Select the model
                                  '\x1D\x28\x6B\x03\x00\x31\x43' + qr_size +                  // Size of the model
                                  '\x1D\x28\x6B\x03\x00\x31\x45' + qr_eclevel +               // Set n for error correction
                                  '\x1D\x28\x6B' + qr_pL + qr_pH + '\x31\x50\x30' + qr_data + // Store data
                                  '\x1D\x28\x6B\x03\x00\x31\x51\x30' +                        // Print
                                  '\n\n\n' +
                                  justify_left);*/
    //QR_Code printing
    function ESCPOS_qrCode(){
        qr_Code(function (data) {
          console.log('QR_Code data is appended '+data);
        }, function (err) {
             console.log(err+"ESCPOS Qr_code");
           },"https://facebook.com/",50,05,51);

        print(function(data){
          console.log('ESCPOS qrCode is printed '+data);
        },function(err){
            console.log("Error in ESCPOS_QRCode CordovaPrint.print() "+err);
          });
    }
    //Barcode Printing
    function ESCPOS_barCode(){
        barcode(function (data) {
           console.log('Barcode data is appended '+data);
        }, function (err) {
             console.log(err+"ESCPOS Barcode");
           },'12345678',70,3,80,0,2);

        print(function(data){
           console.log('Barcode is printed '+data);
        },function(err){
             console.log("Error in ESCPOS_Barcode CordovaPrint.print() "+err);
          });
    }



    //Cut the paper via POS Commands
    function cut(){
        posCommand(function (data) {
           console.log("Cut Command appended "+data);
        }, function (err) {
             console.log("Error in CordovaPrint.printPOSCommand "+err);
           }, CordovaPrint.CUT_FULL);

        print(function(data){
           console.log("Successfully executed the ESCPOS Enabled cut command "+data);
        },function(err){
             console.log("Error in cut CordovaPrint.print() "+err);
          });
    }

    function connectManually(printerName){
        connect(function (data) {
         console.log("Connection Successful with the printer");
         connected = true;
         console.log(data);
        }, function (err) {
            console.log("Error Unable to connect");
            console.log(err);
        }, printer)
        debugger;
    }

     function newTodoKeyPressHandler( event ) {
        if (event.keyCode === ENTER_KEY) {
           printer = customPrinter.value
           var entry = document.createElement('option');
             entry.text = printer;
             printerList.add(entry);
             connectManually(printer);
           console.log("Custom Printer name : "+printer);
          customPrinter.value = '';
        }
      }

      function addEventListeners() {
        customPrinter.addEventListener('keypress', newTodoKeyPressHandler, false);
      }

      addEventListeners();

    //Full Test for Text, Image, Barcode,QR_Code printing
    function Test_Full(){
           text_print();
           image_print();
           ESCPOS_barCode();
           ESCPOS_qrCode();
           cut();
        }
        app.initialize();
