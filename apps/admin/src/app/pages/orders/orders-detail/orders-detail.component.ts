import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService, Order, ORDER_STATUS } from '@bluebits/orders';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [
  ]
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  
  order: any;
  orderStatuses: any = [];
  selectedStatus: any;
  endswith$: Subject<any> = new Subject();

  constructor(private messageService: MessageService, private orderService: OrdersService, private route: ActivatedRoute) { }

  ngOnInit(): void {
  	this._mapOrderStatus();
  	this._getOrder();
  }

  ngOnDestroy(){
    this.endswith$.complete();
  }

  private _mapOrderStatus(){
  	this.orderStatuses = Object.keys(ORDER_STATUS).map((key: any) => {
  		return {
  			id: key,
  			name: ORDER_STATUS[key].label
  		}
  	})

  }

  private _getOrder(){
  	this.route.params.subscribe((params: any) => {
  		if(params.id){
		  	this.orderService.getOrder(params.id).pipe(takeUntil(this.endswith$)).subscribe( (order: any) => {
		  		this.order = order;
		  		this.selectedStatus = order.status.toString();
		  	})

  		}
  	})
  }

  onStatusChange(event: any){
  	this.orderService.updateOrder({status: event.value}, this.order.id).pipe(takeUntil(this.endswith$)).subscribe(() => {
  	  this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`Order is Updated`
      });
  	}, (error) => {
  		 this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:`Oder is not updated`
      });
  	})
  }

}
 