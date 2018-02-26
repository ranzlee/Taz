import { Component, Inject } from '@angular/core';
import { HttpService } from '../../services/http/http.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent {
  public forecasts: WeatherForecast[];
  public fakeEntities: Taz.Domain.IFakeEntity[];

  constructor(@Inject(HttpService) httpService: HttpService) {
    httpService.get<WeatherForecast[]>(
      'api/SampleData/WeatherForecasts',
      result => {
        this.forecasts = result;
      }
    );
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
