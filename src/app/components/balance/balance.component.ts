import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Total_facturasService } from '../../service/total_facturas.service';
import { FormsModule } from '@angular/forms';

interface Producto {
  nombre: string;
  detalle: string;
  precio: number;
}

interface GastoDiaResponse {
  fecha: string;
  anio: number;
  mes: number;
  dia: number;
  total: number;
  cantidad_gastos: number;
}

// --- Interfaces de respuesta para los GET ---
interface BaseResponse {
  success: boolean;
  encontrado: boolean;
  base: number;
  base_nequi: number;
  dia?: number;
  mes?: number;
  anio?: number;
}

interface BaseFinalResponse {
  success: boolean;
  encontrado: boolean;
  base_final: number;
  base_nequi_final: number;
  dia?: number;
  mes?: number;
  anio?: number;
}

@Component({
  selector: 'app-balance',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.css'],
  imports: [CommonModule, FormsModule]
})
export class BalanceComponent implements OnInit {

  base: number | null = null;
  baseNequi: number | null = null;

  baseFinal: number | null = null;
  baseNequiFinal: number | null = null;

  subiendoBase = false;
  subiendoBaseFinal = false;

  sumaTotalGeneral$!: Observable<number>;

  fechaActual: Date = new Date();

  // Valores guardados que vienen del backend (solo lectura / referencia)
  base2: number = 0;
  base_nequi2: number = 0;
  base_final2: number = 0;
  base_nequi_final2: number = 0;

  productos: Producto[] = [
    { nombre: 'Producto 1',  detalle: 'Descripción del producto 1',  precio: 15000 },
    { nombre: 'Producto 2',  detalle: 'Descripción del producto 2',  precio: 23000 },
    { nombre: 'Producto 3',  detalle: 'Descripción del producto 3',  precio: 18500 },
    { nombre: 'Producto 4',  detalle: 'Descripción del producto 4',  precio: 9900  },
    { nombre: 'Producto 5',  detalle: 'Descripción del producto 5',  precio: 45000 },
    { nombre: 'Producto 6',  detalle: 'Descripción del producto 6',  precio: 12500 },
    { nombre: 'Producto 7',  detalle: 'Descripción del producto 7',  precio: 7800  },
    { nombre: 'Producto 8',  detalle: 'Descripción del producto 8',  precio: 32000 },
    { nombre: 'Producto 9',  detalle: 'Descripción del producto 9',  precio: 5600  },
    { nombre: 'Producto 10', detalle: 'Descripción del producto 10', precio: 21000 },
    { nombre: 'Producto 11', detalle: 'Descripción del producto 11', precio: 17800 },
    { nombre: 'Producto 12', detalle: 'Descripción del producto 12', precio: 65000 },
    { nombre: 'Producto 13', detalle: 'Descripción del producto 13', precio: 14200 },
    { nombre: 'Producto 14', detalle: 'Descripción del producto 14', precio: 8900  },
    { nombre: 'Producto 15', detalle: 'Descripción del producto 15', precio: 27500 },
    { nombre: 'Producto 16', detalle: 'Descripción del producto 16', precio: 31000 },
    { nombre: 'Producto 17', detalle: 'Descripción del producto 17', precio: 11500 },
    { nombre: 'Producto 18', detalle: 'Descripción del producto 18', precio: 5400  },
    { nombre: 'Producto 19', detalle: 'Descripción del producto 19', precio: 19800 },
    { nombre: 'Producto 20', detalle: 'Descripción del producto 20', precio: 7200  }
  ];

  totalBackend: number = 0;
  cargandoTotal: boolean = false;

  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient, private TotalFacturasService: Total_facturasService) { }

  ngOnInit() {
    this.cargarTotal();
    const hoy = new Date();
    this.TotalFacturasService.cargarFacturas(
      hoy.getDate(),
      hoy.getMonth() + 1,
      hoy.getFullYear()
    );
    this.sumaTotalGeneral$ = this.TotalFacturasService.sumaTotalGeneral$;
    this.cargarBasesGuardadas();
  }

  private cargarTotal(): void {
    const url = `${this.API_URL}/gastos/${this.fechaActual.getFullYear()}/${this.fechaActual.getMonth() + 1}/${this.fechaActual.getDate()}`;
    this.cargandoTotal = true;

    this.http.get<GastoDiaResponse>(url).subscribe({
      next: (res) => {
        this.totalBackend = res.total;
        this.cargandoTotal = false;
      },
      error: (err) => {
        console.error('Error al cargar el total:', err);
        this.totalBackend = 0;
        this.cargandoTotal = false;
      }
    });
  }

  // ==========================================
  // SUBIR BASE (POST /base)  -> base + base_nequi
  // ==========================================
  subirBase(): void {
    if (this.subiendoBase) return;

    // Validación: ambos campos deben ser números válidos (>= 0)
    if (this.base === null || this.base === undefined || isNaN(this.base) || this.base < 0 ||
        this.baseNequi === null || this.baseNequi === undefined || isNaN(this.baseNequi) || this.baseNequi < 0) {
      alert('Debes ingresar BASE y BASE NEQUI como números válidos (0 o mayores)');
      return;
    }

    // Usamos la fecha ACTUAL al momento del clic (no la de ngOnInit)
    const ahora = new Date();

    const body = {
      base: Number(this.base),
      base_nequi: Number(this.baseNequi),
      dia: ahora.getDate(),
      mes: ahora.getMonth() + 1,
      anio: ahora.getFullYear()
    };

    console.log('POST /base ->', body);

    this.subiendoBase = true;
    this.http.post(`${this.API_URL}/base`, body).subscribe({
      next: (res: any) => {
        console.log('Base subida:', res);
        alert('BASE y BASE NEQUI subidas correctamente');
        // Limpiar inputs tras éxito
        this.base = null;
        this.baseNequi = null;
        this.subiendoBase = false;
      },
      error: (err) => {
        console.error('Error al subir base:', err);
        alert('Error al subir BASE: ' + (err?.error?.message || err.message));
        this.subiendoBase = false;
      }
    });
  }

  // ==========================================
  // SUBIR BASE FINAL (POST /base_final) -> base_final + base_nequi_final
  // ==========================================
  subirBaseFinal(): void {
    if (this.subiendoBaseFinal) return;

    if (this.baseFinal === null || this.baseFinal === undefined || isNaN(this.baseFinal) || this.baseFinal < 0 ||
        this.baseNequiFinal === null || this.baseNequiFinal === undefined || isNaN(this.baseNequiFinal) || this.baseNequiFinal < 0) {
      alert('Debes ingresar BASE FINAL y BASE NEQUI FINAL como números válidos (0 o mayores)');
      return;
    }

    const ahora = new Date();

    const body = {
      base_final: Number(this.baseFinal),
      base_nequi_final: Number(this.baseNequiFinal),
      dia: ahora.getDate(),
      mes: ahora.getMonth() + 1,
      anio: ahora.getFullYear()
    };

    console.log('POST /base_final ->', body);

    this.subiendoBaseFinal = true;
    this.http.post(`${this.API_URL}/base_final`, body).subscribe({
      next: (res: any) => {
        console.log('Base final subida:', res);
        alert('BASE FINAL y BASE NEQUI FINAL subidas correctamente');
        this.baseFinal = null;
        this.baseNequiFinal = null;
        this.subiendoBaseFinal = false;
      },
      error: (err) => {
        console.error('Error al subir base final:', err);
        alert('Error al subir BASE FINAL: ' + (err?.error?.message || err.message));
        this.subiendoBaseFinal = false;
      }
    });
  }

   // ==========================================
  // GET: Cargar base y base_nequi guardadas
  // ==========================================
  private cargarBasesGuardadas(): void {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes  = hoy.getMonth() + 1;
    const dia  = hoy.getDate();

    // GET /base
    this.http.get<BaseResponse>(`${this.API_URL}/base/${anio}/${mes}/${dia}`).subscribe({
      next: (res) => {
        if (res.encontrado) {
          this.base2 = res.base;
          this.base_nequi2 = res.base_nequi;
        } else {
          this.base2 = 0;
          this.base_nequi2 = 0;
        }
        console.log('Base cargada:', { base2: this.base2, base_nequi2: this.base_nequi2 });
      },
      error: (err) => {
        console.error('Error al cargar /base:', err);
        this.base2 = 0;
        this.base_nequi2 = 0;
      }
    });

    // GET /base_final
    this.http.get<BaseFinalResponse>(`${this.API_URL}/base_final/${anio}/${mes}/${dia}`).subscribe({
      next: (res) => {
        if (res.encontrado) {
          this.base_final2 = res.base_final;
          this.base_nequi_final2 = res.base_nequi_final;
        } else {
          this.base_final2 = 0;
          this.base_nequi_final2 = 0;
        }
        console.log('Base final cargada:', {
          base_final2: this.base_final2,
          base_nequi_final2: this.base_nequi_final2
        });
      },
      error: (err) => {
        console.error('Error al cargar /base_final:', err);
        this.base_final2 = 0;
        this.base_nequi_final2 = 0;
      }
    });
  }

  get total(): number {
    return this.productos.reduce((sum, p) => sum + p.precio, 0);
  }
}