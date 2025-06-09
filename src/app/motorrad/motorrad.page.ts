import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FahrzeugeService, Motorraeder } from '../api/fahrzeuge.service';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-motorrad',
  templateUrl: './motorrad.page.html',
  styleUrls: ['./motorrad.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class MotorradPage implements OnInit {
  motorraeder: Motorraeder = { data: [], total: 0 };
  displayedMotorraeder: any[] = [];
  Marke: string = '';
  Model: string = '';
  selectedYear: number = 2020;
  availableYears: number[] = [2020, 2019, 2018, 2017, 2016, 2015];
  sortOption: string = 'default';
  sortOptions = [
    { value: 'default', label: 'Standard' },
    { value: 'marke', label: 'Marke (A-Z)' },
    { value: 'marke-desc', label: 'Marke (Z-A)' },
    { value: 'modell', label: 'Modell (A-Z)' },
    { value: 'modell-desc', label: 'Modell (Z-A)' },
    { value: 'jahr', label: 'Jahr (neu-alt)' },
    { value: 'jahr-desc', label: 'Jahr (alt-neu)' }
  ];

  // Paginierung
  currentPage: number = 1;
  itemsPerPage: number = 10; // APP-10
  totalPages: number = 1;

  constructor(
    private fahrzeugeService: FahrzeugeService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadMotorraeder();
  }

  loadMotorraeder(): void {
    this.fahrzeugeService.getMotorraeder(this.Marke, this.Model, this.selectedYear)
      .subscribe({
        next: (data: Motorraeder) => {
          this.motorraeder = data;
          this.totalPages = Math.ceil(this.motorraeder.data.length / this.itemsPerPage);
          this.sortMotorraeder();
          this.updateDisplayedMotorraeder();
          console.log('Daten geladen:', {
            total: this.motorraeder.data.length,
            currentPage: this.currentPage,
            itemsPerPage: this.itemsPerPage
          });
        },
        error: (error) => {
          console.error('Fehler:', error);
          this.motorraeder = { data: [], total: 0 };
          this.displayedMotorraeder = [];
        }
      });
  }

  sortMotorraeder(): void {
    if (!this.motorraeder.data) return;

    switch (this.sortOption) {
      case 'marke':
        this.motorraeder.data.sort((a, b) =>
          a.make_model_trim.make_model.make.name.localeCompare(b.make_model_trim.make_model.make.name));
        break;
      case 'marke-desc':
        this.motorraeder.data.sort((a, b) =>
          b.make_model_trim.make_model.make.name.localeCompare(a.make_model_trim.make_model.make.name));
        break;
      case 'modell':
        this.motorraeder.data.sort((a, b) =>
          a.make_model_trim.make_model.name.localeCompare(b.make_model_trim.make_model.name));
        break;
      case 'modell-desc':
        this.motorraeder.data.sort((a, b) =>
          b.make_model_trim.make_model.name.localeCompare(a.make_model_trim.make_model.name));
        break;
      case 'jahr':
        this.motorraeder.data.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'jahr-desc':
        this.motorraeder.data.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
    }
    this.updateDisplayedMotorraeder();
  }

  updateDisplayedMotorraeder(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.displayedMotorraeder = this.motorraeder.data.slice(startIndex, endIndex);
  }

  changePage(newPage: number): void {
    if (newPage < 1 || newPage > this.totalPages) return;
    this.currentPage = newPage;
    this.updateDisplayedMotorraeder();
  }

  onSortChange(): void {
    this.currentPage = 1;
    this.sortMotorraeder();
  }

  async openModal(motorrad: any) {
    const modal = await this.modalController.create({
      component: MotorradPage,
      componentProps: {
        selectedMotorrad: motorrad
      }
    });
    await modal.present();
  }
}
