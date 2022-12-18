import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {APP_CONFIG} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudyDevService {

  base = APP_CONFIG.production ? 'https://study.dev/api' : 'http://localhost:4200/api';

  constructor(private http: HttpClient) {
  }

  getTopics = () => this.http.get<any>(`${this.base}/topics`);
}
