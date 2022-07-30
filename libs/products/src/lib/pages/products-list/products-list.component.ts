import { Component, OnInit } from '@angular/core';
import { ProductsService, } from '../../services/products.service';
import { CategoriesService } from '../../services/categories.service';
import { Product } from '../../models/product'; 
import { Category } from '../../models/category'; 
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-list',
  templateUrl: './products-list.component.html',
  styles: [
  ]
})
export class ProductsListComponent implements OnInit {
  
  checked = false;
  products: Product[] = [];
  categories: Category[] = [];
  isCategoryPage: boolean = false;
  constructor(private prodService: ProductsService,
  			private categoriesService: CategoriesService,
  			private route: ActivatedRoute) { }

  ngOnInit(): void {
  	this.route.params.subscribe((params: any) => {
  		params.categoryid ? this._getProducts([params.categoryid]) : this._getProducts();
  		params.categoryid ? (this.isCategoryPage = true) : this.isCategoryPage = false;
  	})
  	this._getCategories();
  }


  private _getProducts(categoriesFilter?: any[]){
  	this.prodService.getProducts(categoriesFilter).subscribe((products) => {
  		this.products = products;
  	})
  }

  private _getCategories(){ 
  	this.categoriesService.getCategories().subscribe((categories) => {
  		this.categories = categories
  	})
  }

  categoryFilter(){
  	const selectedCategories = this.categories
  	.filter((category) => category.checked)
  	.map((category) => category.id)
  	this._getProducts(selectedCategories);
  }

}
