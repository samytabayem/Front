import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ClientService, Client } from '../../services/client.service';
import { AdressService, Adress } from '../../services/adress.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
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
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent implements OnInit {
  clientForm!: FormGroup;
  clientID?: number;
  availableAddresses: Adress[] = []; // Liste des adresses disponibles

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private addressService: AdressService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    
    this.clientForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      adress: this.fb.array([this.createEmptyAddress()]) // ✅ FormArray pour gérer plusieurs adresses
      
    });
    //this.addAddress();

    // Charger les adresses disponibles depuis l'API
    this.addressService.getAddresses().subscribe({
      next: (addresses) => this.availableAddresses = addresses,
      error: (err) => console.error('Erreur lors du chargement des adresses', err)
    });

    // Vérifier si on est en mode modification
    this.clientID = this.route.snapshot.params['id'];
    if (this.clientID) {
      this.clientService.getClient(this.clientID).subscribe((client) => {
        if (client.dateOfBirth) {
          client.dateOfBirth = this.formatDate(client.dateOfBirth);
        }
        this.clientForm.patchValue(client);
        client.adress.forEach(address => this.addAddress(address)); // Ajouter les adresses existantes
      });
    }
  }

  // Getter pour le tableau d'adresses
  get adress(): FormArray {
    return this.clientForm.get('adress') as FormArray;
  }

  // Ajouter une nouvelle adresse ou une adresse existante
  addAddress(address: Adress | null = null): void {
    this.adress.push(this.fb.group({
      street: [address?.street || '', Validators.required],
      zipcode: [address?.zipcode || '', Validators.required],
      city: [address?.city || '', Validators.required],
      country: [address?.country || '', Validators.required]
    }));
  }

  // Supprimer une adresse du formulaire
  removeAddress(index: number): void {
    this.adress.removeAt(index);
  }
  createEmptyAddress(): FormGroup {
    return this.fb.group({
      street: ['', Validators.required],
      zipcode: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });
  }
  atLeastOneAddressValidator(): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control instanceof FormArray) {
        return control.length > 0 ? null : { atLeastOneAddress: true };
      }
      return null;
    };
  }
  formatDate(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // Retourne au format 'YYYY-MM-DD'
  }
  
  

  // Sauvegarde du client
  saveClient(): void {
    console.log(this.clientForm.value,"test")
    if (this.clientForm.invalid) return;

    const client: Client = this.clientForm.value;
    if (this.clientID) {
      this.clientService.updateClient(this.clientID,client).subscribe({
        next: () => {
          this.snackBar.open('Client mis à jour avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (err) => console.error(err)
      });
    } else {
      this.clientService.addClient(client).subscribe({
        next: () => {
          this.snackBar.open('Client ajouté avec succès', 'Fermer', { duration: 3000 });
          this.router.navigate(['/clients']);
        },
        error: (err) => console.error(err)
      });
    }
  }
}
