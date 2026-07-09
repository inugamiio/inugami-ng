import {Component, computed, effect, input, output, signal} from '@angular/core';
import {SearchRequest, SearchResponse} from 'inugami-ng/models'
import {InuIcon} from 'inugami-icons'
import {NgClass} from '@angular/common'

@Component({
             selector   : 'inu-paginator',
             standalone : true,
             imports    : [
               InuIcon,
               NgClass
             ],
             templateUrl: './inu-paginator.component.html',
             styleUrl   : './inu-paginator.component.scss',
           })
export class InuPaginator {
  //==================================================================================================================
  // ATTRIBUTES
  //==================================================================================================================
  defaultPageSize = input<number>(10);
  searchResponse  = input<SearchResponse<any> | undefined>(undefined);
  styleClass      = input<string>('');
  onChanged       = output<SearchRequest>();


  // internal
  _styleClass = computed<string>(() => [
    'inu-paginator',
    this.styleClass()
  ].join(' '));

  //==================================================================================================================
  // INIT
  //==================================================================================================================
  constructor() {
    effect(() => {
      this.searchResponse();
      this.styleClass();
    });
  }

  //==================================================================================================================
  // ACTION
  //==================================================================================================================
  protected goFirst() {
    const previousPage = this.searchResponse()?.page ?? 0;
    if (previousPage > 0) {
      this.onChanged.emit({
                            page    : 0,
                            pageSize: this.searchResponse()?.pageSize ?? this.defaultPageSize()
                          });
    }
  }

  protected previous() {
    const previousPage = (this.searchResponse()?.page ?? 0) - 1;
    if (previousPage >= 0) {
      this.onChanged.emit({
                            page    : previousPage,
                            pageSize: this.searchResponse()?.pageSize ?? this.defaultPageSize()
                          });
    }
  }


  protected next() {
    if (this.searchResponse()?.next) {
      this.onChanged.emit({
                            page    : (this.searchResponse()?.page ?? 0) + 1,
                            pageSize: this.searchResponse()?.pageSize ?? this.defaultPageSize()
                          });
    }
  }


  protected goLast() {
    const totalPage = this.searchResponse()?.totalPages ?? 0;

    if (totalPage > 0) {
      this.onChanged.emit({
                            page    : totalPage - 1,
                            pageSize: this.searchResponse()?.pageSize ?? this.defaultPageSize()
                          });
    }
  }
}
