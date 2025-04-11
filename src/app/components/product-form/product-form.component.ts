import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  imports: [
    CommonModule,
    ReactiveFormsModule,  // ✅ Ajout de ReactiveFormsModule ici
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSnackBarModule,
    RouterModule
  ],
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId?: number;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      unitsInStock: [0, [Validators.required, Validators.min(0)]],
      weight: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.productService.getProduct(this.productId).subscribe({
          next: (product) => this.productForm.patchValue(product),
          error: (err) => console.error(err)
        });
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const product: Product = this.productForm.value;
      if (this.isEditMode && this.productId !== undefined) {
        this.productService.updateProduct(this.productId, product).subscribe({
          next: () => {
            this.snackBar.open('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: (err) => console.error(err)
        });
      } else {
        this.productService.addProduct(product).subscribe({
          next: () => {
            this.snackBar.open('Produit ajouté avec succès', 'Fermer', { duration: 3000 });
            this.router.navigate(['/products']);
          },
          error: (err) => console.error(err)
        });
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }
}
