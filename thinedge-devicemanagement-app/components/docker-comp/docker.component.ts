import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { OperationService, IOperation, FetchClient } from '@c8y/client';
import { Alert, AlertService } from '@c8y/ngx-components';
import { interval } from 'rxjs';

@Component({
    selector: 'app-docker',
    templateUrl: "./docker.component.html",
    styleUrls: ['./docker.component.css']
  })
  export class DockerComponent implements OnInit {
    containers: any;
    deviceId: string;
    available: any;

    isAvailable: boolean;

    constructor(public route: ActivatedRoute,
                private ops: OperationService,
                private alert: AlertService,
                private fetchClient: FetchClient,) {
                  this.available = new Object;
                }

      ngOnInit(): void {  
      this.deviceId = this.route.snapshot.parent.data.contextData["id"];
     // this.containers = this.route.snapshot.parent.data.contextData["c8y_Docker"] ;     
      this.isAvailable = true;
      this.deviceFetchClient();
       
    }
   
    ngAfterViewChecked(){
     
      if (Object.keys(<Object>this.available).length >0 ){
        //document.getElementsByName("my-card");
        var queryCards = document.querySelectorAll('.card');
        if (this.available.status == "UNAVAILABLE"){
          //document.getElementById("docker-card").classList.add("d");  
          if(this.isAvailable){
            this.isAvailable = false;
            this.setCardDisabled(queryCards);
          }     
        }else{
          //document.getElementById("docker-card").classList.remove("d");
          if(!this.isAvailable){
            this.isAvailable = true;
            this.setCardEnabled(queryCards);
          }      
        }
      }  
    }

    setCardDisabled(queryCards){
      for( var i = 0; i < queryCards.length; i++){
          queryCards[i].classList.add('d');
      }for( var i = 0; i < this.containers.length; i++){
          this.containers[i].status = "Disconnected";
          this.containers[i].cpu = "0.0";
          this.containers[i].memory = "0.0";
      }
      
    }
    setCardEnabled(queryCards){
      for( var i = 0; i < queryCards.length; i++){
          queryCards[i].classList.remove('d');
      }
      this.deviceFetchClient();

    
    }
    
    deviceFetchClient(){
      this.fetchClient.fetch('inventory/managedObjects/' + this.deviceId).then((response) => { //try...
        response.json().then( (data) => {
          this.containers = data["c8y_Docker"];  
          this.available = data["c8y_Availability"];
          console.log("System is " + this.available.status);
          
        } );  
        } ,(error) => { //...catch
         console.log(error);
        }  ); 
    }

    sendUpdateStatusOperation(item, status): void{
      const dockerOperation: IOperation = {
        deviceId: this.deviceId,
        c8y_Docker: {
          name: item.name,
          containerID: item.containerID,​
          command: status.toLowerCase()
        },
        description: status + " container..."
      };
      console.log(`Container '${item.name}' send operation '${status}' to deviceId ${this.deviceId}`);
  //    this.ops.create(dockerOperation);
      this.ops.create(dockerOperation).then(result => {
        const myAlert:Alert = {
          text :"Operation '" + status + "' erzeugt.", 
          type: 'info',
          timeout : 3000
        };
        this.alert.add(myAlert);
        console.log(result);
        console.log(myAlert);
      },error => {
        const myAlert:Alert = {
          text : "Fehler beim Erstellen der Operation. " + JSON.stringify(error), 
          type: 'danger',
          timeout : 3000
        };
        this.alert.add(myAlert);
      } );
  
      //this.alert.info("Operation '" + status + "' erzeugt.");
    }
    start(item): void{
      this.sendUpdateStatusOperation(item, "Start");
    }
    stop(item): void{
      this.sendUpdateStatusOperation(item, "Stop");
    }
    restart(item): void{
      this.sendUpdateStatusOperation(item, "Restart");
    }
    
  }