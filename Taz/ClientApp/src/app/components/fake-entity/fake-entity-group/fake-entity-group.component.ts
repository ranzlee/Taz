import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';

@Component({
  selector: 'app-fake-entity-group',
  templateUrl: './fake-entity-group.component.html',
  styleUrls: ['./fake-entity-group.component.css']
})
export class FakeEntityGroupComponent implements OnInit {
  // inputs
  @Input() parent: Taz.Domain.IFakeEntity;
  // model properties
  public fakeEntities: Taz.Domain.IFakeEntity[];
  public newFakeEntity: Taz.Domain.IFakeEntity;
  // private properties
  private httpService: HttpService;

  constructor(@Inject(HttpService) httpService: HttpService) {
    this.httpService = httpService;
    this.newFakeEntity = {};
  }

  ngOnInit(): void {
    const parentId = this.parent == null ? '0' : this.parent.id;
    this.httpService.get<Taz.Domain.IFakeEntity[]>(
      'api/FakeEntity/GetFakeEntities?parentid=' + parentId,
      result => {
        this.fakeEntities = result;
      }
    );
  }

  add(): void {
    if (this.parent != null) {
      this.newFakeEntity.parentId = this.parent.id;
      this.newFakeEntity.rootId = this.parent.rootId;
    }
    this.httpService.post<Taz.Domain.IFakeEntity>(
      'api/FakeEntity/AddOrUpdateFakeEntity',
      this.newFakeEntity,
      result => {
        this.fakeEntities.push(result);
        this.newFakeEntity = {};
      }
    );
  }
}
