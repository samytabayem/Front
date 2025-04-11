import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientService, Client } from '../../services/client.service';
import { AdressService, Adress } from '../../services/adress.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-adress-list',
  templateUrl: './adress-list.component.html',
  styleUrls: ['./adress-list.component.css'],

   imports: [
       CommonModule,
          ReactiveFormsModule,  // ✅ Ajout de ReactiveFormsModule ici
          MatCardModule,
          MatInputModule,
          MatButtonModule,
          MatFormFieldModule,
          MatSelectModule,
          MatSnackBarModule,
          RouterModule,
           MatPaginatorModule,
           MatTableModule
       
        ]
})
export class AdressListComponent implements OnInit {
  adress: Adress[] = [];
  clients: Client[] = [];
  totalItems: number = 0;
  filterForm: FormGroup;
  page: number = 1;
  pageSize: number = 10;

  // Formulaire pour ajouter et modifier des adresses
  adressForm: FormGroup;

  constructor(
    private adressService: AdressService,
    private clientService: ClientService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      country: ['']
    });

    this.adressForm = this.fb.group({
      adressID: [null],
      street: [''],
      city: [''],
      zipcode: [''],
      country: [''],
      clientId: [null] // Ce champ sera assigné lorsqu'un client est sélectionné
    });
  }

  ngOnInit(): void {
    this.loadClients();
    this.loadAddresses();

    // Appliquer les filtres lorsque l'utilisateur modifie les champs
    this.filterForm.valueChanges.subscribe(() => {
      this.applyFilters();
    });
  }

  // Charger les clients
  loadClients(page: number = 1, pageSize: number = 10): void {
    this.clientService.getClients(page, pageSize).subscribe({
      next: (data) => {
        this.clients = data.clients;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des clients', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Appliquer les filtres pour les adresses
  applyFilters(): void {
    const { country } = this.filterForm.value;
    this.loadAddresses(1, this.pageSize, country);
  }

  // Charger les adresses avec pagination et filtre
  loadAddresses(page: number = this.page, pageSize: number = this.pageSize, country?: string): void {
    this.adressService.getAddresses(page, pageSize, country).subscribe({
      next: (data) => {
        this.adress = data.addresses;
        this.totalItems = data.totalItems;
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors du chargement des adresses', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Ajouter une adresse
  onAddAddress(): void {
    if (this.adressForm.invalid) {
      this.snackBar.open('Formulaire invalide', 'Fermer', { duration: 3000 });
      return;
    }

    this.adressService.addAddress(this.adressForm.value).subscribe({
      next: (data) => {
        this.snackBar.open('Adresse ajoutée avec succès', 'Fermer', { duration: 3000 });
        this.loadAddresses(); // Recharger la liste des adresses
        this.adressForm.reset(); // Réinitialiser le formulaire
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de l\'ajout de l\'adresse', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Modifier une adresse
  onEditAddress(): void {
    if (this.adressForm.invalid || !this.adressForm.value.adressID) {
      this.snackBar.open('Formulaire invalide ou ID manquant', 'Fermer', { duration: 3000 });
      return;
    }

    this.adressService.updateAddress(this.adressForm.value.adressID, this.adressForm.value).subscribe({
      next: () => {
        this.snackBar.open('Adresse modifiée avec succès', 'Fermer', { duration: 3000 });
        this.loadAddresses(); // Recharger la liste des adresses
        this.adressForm.reset(); // Réinitialiser le formulaire
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Erreur lors de la modification de l\'adresse', 'Fermer', { duration: 3000 });
      }
    });
  }

  // Supprimer une adresse
  onDeleteAddress(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      this.adressService.deleteAddress(id).subscribe({
        next: () => {
          this.snackBar.open('Adresse supprimée avec succès', 'Fermer', { duration: 3000 });
          this.loadAddresses(); // Recharger la liste des adresses
        },
        error: (err) => {
          console.error(err);
          this.snackBar.open('Erreur lors de la suppression de l\'adresse', 'Fermer', { duration: 3000 });
        }
      });
    }
  }

  // Remplir le formulaire pour modifier une adresse
  onEditForm(id: number): void {
    const address = this.adress.find(a => a.adressID === id);
    if (address) {
      this.adressForm.patchValue(address);
    }
  }

  // Sélectionner un client à partir de la liste
  onSelectClient(clientId: number): void {
    this.adressForm.patchValue({ clientId });
  }

  // Gestion de la pagination
  onPageChange(event: any): void {
    this.page = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadAddresses(this.page, this.pageSize, this.filterForm.value.country);
  }
}
