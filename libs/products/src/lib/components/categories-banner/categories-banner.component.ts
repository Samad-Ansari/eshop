import { Component, OnInit, OnDestroy } from '@angular/core';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit, OnDestroy{

  categories: Category[] = []
  endsubs$ : Subject<any> = new Subject();
  constructor(private categoriesService: CategoriesService) { }

  ngOnInit(): void {
  	this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((cat) => {
  		this.categories = cat;
  	})
  }

  ngOnDestroy(){
  	this.endsubs$.next(null);
  	this.endsubs$.complete();
  }

}
