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

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public requisicoes!: number;
  titulo = 'Desenvolvimento Integrado de Sistemas';

  allRequests: DefaultRequest[] = [];
  allReturns: any[] = [];

  PATH_MODEL1 = './assets/model1/'
  PATH_MODEL2 = './assets/model2/'

  isOpen: boolean[] = [];

  toggleAccordion(index: number) {
    this.isOpen[index] = !this.isOpen[index];
  }

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
    console.log(this.allRequests);
    this.requestService();
  }

  public async requestService() {
    for(let i of this.allRequests) {
      await sleep(Math.floor(Math.random() * 5000))
      console.log(`Enviada requisição do usuário: ${i.user}`)
      // this.http.post<any>('localhost:8080', i).subscribe((data) => this.allReturns.push(data))
    }
  }

  atualizarAccordion(i: number){
    let element = document.getElementById(`accordion_${i}`)
    element?.classList.contains("show") ? element?.classList.remove("show") : element?.classList.add("show")
  }
}
