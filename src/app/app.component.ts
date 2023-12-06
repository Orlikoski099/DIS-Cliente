import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blob } from 'buffer';
import * as CSV from 'csv-parser';
import { DefaultRequest } from './request.model';


enum File {
  'MODEL1',
  'MODEL2',
  'MODEL3',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  titulo = 'Desenvolvimento Integrado de Sistemas';
  
  public requisicoes = 0;
  usuario!: number;
  ganho!: boolean;

  req!: DefaultRequest;

  PATH_MODEL1 = './assets/model1'
  PATH_MODEL2 = './assets/model2'


  todoRequests = [];

  constructor(private http:HttpClient) {}

  public randomizeValues(){
    this.req.user = Math.floor(Math.random() * 30000)
    this.req.ganho = Math.random() > 0.5 ? true : false;
    this.req.model = Math.random() > 0.5 ? true : false;
  }

  public loadVector() {
    let vectorLoaded!: string;

    let vector =  Math.floor(Math.random() * 2.999999999)
    let vectorToRead = File[vector]




    this.req.vector = vectorLoaded;
  }

  public sendRequests(){
    for(let i = 0; i < this.requisicoes; i++) {
      this.randomizeValues()
      
    }
  }
  
}
