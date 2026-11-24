import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'calendario-dias',
  templateUrl: './calendario-dias.component.html',
  styleUrls: ['./calendario-dias.component.css'],
  imports: [CommonModule]
})
export class CalendarioDiasComponent implements OnInit {

  @ViewChild('dia11') dia11!: ElementRef;

  anioRecibido: any;
  mesRecibido: any;
  numeroGuardado: number = 0;

  // ===== Datos de la suma mensual =====
  totalMes: number = 0;
  totalFacturas: number = 0;
  cargandoTotal: boolean = false;
  errorTotal: string | null = null;

  private apiUrl = 'https://back-factu-2.vercel.app';

  meses: string[] = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    const navegacion = this.router.getCurrentNavigation();

    if (navegacion?.extras.state) {
      this.anioRecibido = navegacion.extras.state['anio'];
      this.mesRecibido = navegacion.extras.state['mes'];
    }
  }

  ngOnInit(): void {
    // Fallback: si no vino por navegación, usa la fecha actual
    if (!this.mesRecibido || !this.anioRecibido) {
      const hoy = new Date();
      this.mesRecibido = this.mesRecibido || (hoy.getMonth() + 1);
      this.anioRecibido = this.anioRecibido || hoy.getFullYear();
    }
    this.cargarTotalMes();
  }

  cargarTotalMes(): void {
    const mes = Number(this.mesRecibido);
    const anio = Number(this.anioRecibido);

    if (isNaN(mes) || isNaN(anio)) {
      this.errorTotal = 'Mes o año inválidos';
      return;
    }

    this.cargandoTotal = true;
    this.errorTotal = null;

    this.http
      .get<any>(`${this.apiUrl}/api/facturas-suma-mes-total/${mes}/${anio}`)
      .subscribe({
        next: (data) => {
          this.totalMes = data.suma_total_mes || 0;
          this.totalFacturas = data.total_facturas || 0;
          this.cargandoTotal = false;
        },
        error: (err) => {
          console.error('Error al cargar total del mes:', err);
          this.errorTotal = 'No se pudo cargar el total del mes';
          this.cargandoTotal = false;
        }
      });
  }

  obtenerNombreMes(): string {
    const indice = Number(this.mesRecibido) - 1;
    return this.meses[indice] || '';
  }

  navegarADetalle(evento: Event) {
    const elemento = evento.target as HTMLElement;
    this.numeroGuardado = Number(elemento.innerText);

    this.router.navigate(['/balance2'], {
      state: {
        mes: this.mesRecibido,
        anio: this.anioRecibido,
        dia: this.numeroGuardado
      }
    });
  }
}