import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as CSV from 'csv-parser';
import { DefaultRequest } from './request.model';
import { delay } from 'rxjs';
import { AnyARecord } from 'dns';


enum File {
  'MODEL1.csv',
  'MODEL2.csv',
  'MODEL3.csv',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public requisicoes = 0;
  titulo = 'Desenvolvimento Integrado de Sistemas';

  allRequests: DefaultRequest[] = [];
  allReturns: any[] = [];

  PATH_MODEL1 = './assets/model1/'
  PATH_MODEL2 = './assets/model2/'

  constructor(private http: HttpClient) {}

  public randomizeValues(req: DefaultRequest){
    req.user = Math.floor(Math.random() * 30000)
    req.ganho = Math.random() > 0.5 ? true : false;
    req.model = Math.random() > 0.5 ? true : false;
  }

  public async loadVector(req: DefaultRequest) {
    const vectorToRead = this.getRandomFilePath(req);
    const vectorLoaded = await this.readCSVFile(vectorToRead);

    req.vector = vectorLoaded;
  }

  private getRandomFilePath(req: DefaultRequest): string {
    const vector = Math.floor(Math.random() * 2.999999999);
    const fileName = File[vector];
    return (req.model ? this.PATH_MODEL1 : this.PATH_MODEL2) + fileName;
  }

  private async readCSVFile(filePath: string): Promise<string[]> {
    try {
      const fileContent: string | undefined = await this.http.get(filePath, { responseType: 'text' }).toPromise();
      
      if (fileContent === undefined) {
        console.error('Conteúdo do arquivo é indefinido.');
        return [];
      }
      const lines = fileContent.split('\n').map(line => line.trim());
      return lines;
    } catch (error) {
      console.error('Erro ao carregar o arquivo CSV:', error);
      return [];
    }
  }

  public async sendRequests() {
    this.allRequests = [];
    for (let i = 0; i < this.requisicoes; i++) {
      let req = new DefaultRequest;
      this.randomizeValues(req);
      await this.loadVector(req);
      this.allRequests.push(req);
    }

  }

  public requestService() {
    this.allRequests.forEach(i => {
      delay(Math.floor(Math.random() * 1000))
      this.http.post<any>('localhost:8080', i).subscribe((data) => this.allReturns.push(data))
    });
  }
}
