import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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

@Component({
  selector: 'app-gastos-dia',
  templateUrl: './gastos-dia.component.html',
  styleUrls: ['./gastos-dia.component.css'],
  imports: [CommonModule]
})
export class GastosDiaComponent implements OnInit {

  // Fecha actual usando new Date()
  fechaActual: Date = new Date();

  // Productos de ejemplo (luego los reemplazas por los de tu BD)
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

  /** Total que viene del backend (cabecera) */
  totalBackend: number = 0;

  /** Para mostrar un estado mientras carga (opcional) */
  cargandoTotal: boolean = false;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.cargarTotal();
    const hoy = new Date();
    hoy.getDate(),
    hoy.getMonth() + 1,
    hoy.getFullYear()
  }

  private cargarTotal(): void {
    const url = `https://back-gastos.vercel.app/${this.fechaActual.getFullYear()}/${this.fechaActual.getMonth() + 1}/${this.fechaActual.getDate()}`;
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

  // Getter para calcular el total dinámicamente
  get total(): number {
    return this.productos.reduce((sum, p) => sum + p.precio, 0);
  }

}
