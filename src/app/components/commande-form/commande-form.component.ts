import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { CommandeService, Commande, CommandeProduits,  } from '../../services/commande.service';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Product, ProductService } from '../../services/product.service';
import { Client, ClientService } from '../../services/client.service';

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
  selector: 'app-commande-form',
  standalone: true,
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.css'],
  
})
export class CommandeFormComponent implements OnInit {
  commandeForm!: FormGroup;
  clients: Client[] = [];
  produits: Product[] = [];
  commandeID?: number;

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private productService: ProductService,
    private clientService: ClientService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.commandeForm = this.fb.group({
      clientID: ['', Validators.required],
      commandeProduits: this.fb.array([])
    });

   
    this.productService.getProducts().subscribe(data => this.produits = data.products);

    this.clientService.getClients(1, 10).subscribe({
      next: (data) => {
        this.clients = data.clients;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
      }
    });

    this.commandeID = this.route.snapshot.params['id'];
    if (this.commandeID) {
      this.commandeService.getCommande(this.commandeID).subscribe((commande) => {
        this.commandeForm.patchValue({
          clientID: commande.clientID
        });
        commande.commandeProduits.forEach(prod => this.addProduit(prod.produitID, prod.quantity));
      });
    }
  }

  get commandeProduits(): FormArray {
    return this.commandeForm.get('commandeProduits') as FormArray;
  }

  // ✅ Vérifier si un produit est déjà sélectionné
  isProductAlreadySelected(produitID: number): boolean {
    return this.commandeProduits.controls.some(control => control.value.produitID === produitID);
  }

  addProduit(produitID: number = 0, quantity: number = 1): void {
    this.commandeProduits.push(this.fb.group({
      produitID: [produitID, Validators.required],
      quantity: [quantity, [Validators.required, Validators.min(1)]]
    }));
  }
  onSelectClient(clientId: number): void {
    /*this.adressForm.patchValue({ clientId });*/
  }


  saveCommande(): void {
    if (this.commandeForm.invalid) return;

    const commande: Commande = this.commandeForm.value;
    if (this.commandeID) {
      this.commandeService.updateCommande(this.commandeID, commande).subscribe(() => {
        this.snackBar.open('Commande mise à jour avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/commandes']);
      });
    } else {
      this.commandeService.addCommande(commande).subscribe(() => {
        this.snackBar.open('Commande enregistrée avec succès', 'Fermer', { duration: 3000 });
        this.router.navigate(['/commandes']);
      });
    }
  }

  navigateBack(): void {
    this.router.navigate(['/commandes']);
  }

  removeProduit(index: number): void {
    this.commandeProduits.removeAt(index);
  }
}
