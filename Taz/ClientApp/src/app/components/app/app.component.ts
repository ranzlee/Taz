import { Component } from '@angular/core';
import { HttpService } from '../../services/http/http.service';
import { FakeEntityStoreService } from '../../services/fake-entity-store/fake-entity-store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FakeEntityStoreService]
})
export class AppComponent {}
