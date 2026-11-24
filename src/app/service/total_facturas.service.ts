import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { datosFactura, datosFactura2, RespuestaConteo } from '../components/facturas/calendario-dias-facturas2/calendario-dias-facturas2.component';

@Injectable({
  providedIn: 'root'
})
export class Total_facturasService {

private api = 'https://back-factu-2.vercel.app/api';

  // Estado compartido: lista de facturas del día
  private facturasSubject = new BehaviorSubject<datosFactura[]>([]);
  public facturas$ = this.facturasSubject.asObservable();

  // Observable que emite la suma total cada vez que cambian las facturas
  public sumaTotalGeneral$: Observable<number> = this.facturas$.pipe(
    map(facturas =>
      facturas.reduce((acc, f) => acc + this.calcularPrecioFinal(f), 0)
    )
  );

  constructor(private http: HttpClient) {}

  cargarFacturas(dia: number, mes: number, anio: number) {
    const url = `${this.api}/facturas-fecha-db2/${dia}/${mes}/${anio}`;
    this.http.get<datosFactura[]>(url).subscribe({
      next: (res) => {
        const conEstado = res.map(f => {
          const estadoLocal = localStorage.getItem(`factura_db2_${f.id}`);
          if (estadoLocal) {
            const parsed = JSON.parse(estadoLocal);
            f.terminado = parsed.terminado || false;
            f.pago = parsed.pago || false;
          } else {
            f.terminado = false;
            f.pago = false;
          }
          return f;
        });
        this.facturasSubject.next(conEstado);
      },
      error: () => this.facturasSubject.next([])
    });
  }

  getFacturasSnapshot(): datosFactura[] {
    return this.facturasSubject.getValue();
  }

  calcularPrecioFinal(f: datosFactura): number {
    let suma = Number(f.total_mayor) || 0;

    if (f.detallesOpcionales) {
      const subs = [
        f.detallesOpcionales.factura2, f.detallesOpcionales.factura3,
        f.detallesOpcionales.factura4, f.detallesOpcionales.factura5,
        f.detallesOpcionales.factura6, f.detallesOpcionales.factura7,
        f.detallesOpcionales.factura8, f.detallesOpcionales.factura9,
      ];
      for (const item of subs) {
        if (item && item.total_mayor) suma += Number(item.total_mayor);
      }
    }
    return suma;
  }

}
