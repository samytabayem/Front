import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class ProductDetailComponent implements OnInit {
  product?: Product;

  constructor(
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = this.route.snapshot.params['id'];
    this.productService.getProduct(productId).subscribe({
      next: (data) => (this.product = data),
      error: (err) => console.error(err)
    });
  }

  navigateBack(): void {
    this.router.navigate(['/products']);
  }
  navigateToEditProduct(): void {
    if (this.product?.produitID !== undefined) {
      this.router.navigate(['/products/edit', this.product.produitID]);
    } else {
      console.error('Produit ID est indéfini');
    }
  }

  deleteProduct(): void {
    if (this.product?.produitID !== undefined) {
      this.productService.deleteProduct(this.product.produitID).subscribe({
        next: () => {
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err)
      });
    } else {
      console.error('Produit ID est indéfini');
    }
  }

}
