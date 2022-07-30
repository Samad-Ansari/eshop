import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder,FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router';
import { Product, CategoriesService, Category, ProductsService} from '@bluebits/products';
import { timer } from 'rxjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import {MessageService} from 'primeng/api';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [
  ]
})
export class ProductsFormComponent implements OnInit, OnDestroy {

  editmode = false;
  form: any;
  isSubmitted = false;
  categories: Category[] = []
  imageDisplay: any;
  currentProductId: string = '';
  endswith$ : Subject<any> = new Subject();

  constructor(
  	private productService: ProductsService, 
  	private formBuilder: FormBuilder, 
  	private categoriesService: CategoriesService,
  	private messageService: MessageService,
  	private location: Location,
    private route: ActivatedRoute
  	) { }

  ngOnInit(): void {
  	this._initForm();
  	this._getCategories();
  	this._checkEditMode();
  }

  ngOnDestroy(){
    this.endswith$.next(null);
    this.endswith$.complete();
  }

  private _initForm(){
  	this.form = this.formBuilder.group({
  		name: ['', Validators.required],
  		brand: ['', Validators.required],
  		price: ['', Validators.required],
  		category: ['', Validators.required],
  		countInStock: ['', Validators.required],
  		description: ['', Validators.required],
  		richDescription: [''],
  		image: ['', Validators.required],
  		isFeatured: [false]
  	})

  }

  private _checkEditMode(){
  	this.route.params.subscribe( (params: any) => {
      if(params.id) {
        this.editmode = true;
        this.currentProductId = params.id;
        this.productService.getProduct(params.id).pipe(takeUntil(this.endswith$)).subscribe((product: any) =>{
          this.productForm.name.setValue(product.name);
           this.productForm.brand.setValue(product.brand);
          this.productForm.category.setValue(product.category.id);
          this.productForm.price.setValue(product.price);
          this.productForm.countInStock.setValue(product.countInStock);
          this.productForm.isFeatured.setValue(product.isFeatured);
          this.productForm.description.setValue(product.description);
          this.productForm.richDescription.setValue(product.richDescription);
          this.imageDisplay = product.image;
          this.productForm.image.setValidators([]);
          this.productForm.image.updateValueAndValidity();
        })
      }

    })
  }


  onImageUpload(event: any){
    const file = event.target.files[0];
    if(file){
      this.form.patchValue({image: file})
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result
      }
      fileReader.readAsDataURL(file);

    }

  }


  get productForm() {
  	return this.form.controls;
  }

  private _getCategories(){
  	return this.categoriesService.getCategories().pipe(takeUntil(this.endswith$)).subscribe( categories => {
  		this.categories = categories
  	});
  }

  onSubmit(){
  	this.isSubmitted = true;
  	if(this.form.invalid){
  		return;
  	} 
  	const productFormData = new FormData();
  	Object.keys(this.productForm).map((key) => {
    	productFormData.append(key, this.productForm[key].value);
  	})

  	if(this.editmode){
  		this._updateProduct(productFormData);
  	}
  	else {
	  	this._addProduct(productFormData);
  	}
  }

  private _updateProduct(productData: FormData){
    console.log(productData);
    this.productService.updateProduct(productData, this.currentProductId)
    .pipe(takeUntil(this.endswith$)).subscribe(
      () => {
        this.messageService.add({
          severity:'success', 
          summary:'Success', 
          detail:'Product is Updated'
        });
        timer(1000).toPromise().then( done => {
          this.location.back();
        })
      }, 
      (error) => {
        console.log(error);
        this.messageService.add({
          severity:'error', 
          summary:'Error', 
          detail:'Product is not Updated'});
      });

  }

  private _addProduct(productData: FormData){
  	this.productService.createProduct(productData).pipe(takeUntil(this.endswith$)).subscribe(
      (product: Product) => {
      this.messageService.add({
        severity:'success', 
        summary:'Success', 
        detail:`Product ${product.name} is Created`
      });
      timer(1000).toPromise().then( () => {
        this.location.back();
      })
    }, 
    () => {
      this.messageService.add({
        severity:'error', 
        summary:'Error', 
        detail:'Product is not Created'
     });
    });

  }

  onCancel(){
  	this.location.back();
  }

}
