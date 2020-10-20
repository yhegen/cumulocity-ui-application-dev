import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FetchClient } from "@c8y/client";

@Component({
    selector: 'app-analytics-builder',
    templateUrl: "./apamaAB.component.html",
    styleUrls: ['./apamaAB.component.css']
  })

  export class AnalyticsBuilderComponent implements OnInit {
    aBuilder_data: any;
    constructor(public route: ActivatedRoute,
                private fetchClient: FetchClient) {}        // 1

     ngOnInit() {
        this.fetchClient.fetch('service/cep/analyticsbuilder').then((response) => { //try...
            response.json().then( (data) => {
                this.aBuilder_data = data["analyticsBuilderModelRepresentations"];
            } );  

         } ,(error) => { //...catch
            console.log(error);
         }  ); 
     }
  }