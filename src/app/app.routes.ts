import { Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { FacturasComponent } from './components/facturas/facturas.component';
import { CalendarioComponent } from './components/facturas/calendario/calendario.component';
import { CalendarioDiasComponent } from './components/facturas/calendario-dias/calendario-dias.component';
import { CalendarioDiasFacturasComponent } from './components/facturas/calendario-dias-facturas/calendario-dias-facturas.component';
import { FormatoFacturaComponent } from './components/facturas/formato-factura/formato-factura.component';
import { CalendarioDiasFacturas2Component } from './components/facturas/calendario-dias-facturas2/calendario-dias-facturas2.component';
import { CalendarioDiasFacturas3Component } from './components/facturas/calendario-dias-facturas3/calendario-dias-facturas3.component';
import { GastosDiaComponent } from './components/gastos-dia/gastos-dia.component';
import { BalanceComponent } from './components/balance/balance.component';
import { Balance2Component } from './components/balance2/balance2.component';

export const routes: Routes = [
    {
        path : '',
        component : InicioComponent
    },
    {
        path : 'facturas',
        component: FacturasComponent
    },
    {
        path : 'calendario',
        component : CalendarioComponent
    },
    {
        path : 'calendario-dias',
        component : CalendarioDiasComponent
    },
    {
        path : 'calendario-dias-facturas',
        component : CalendarioDiasFacturasComponent
    },
    {
        path : 'calendario-dias-facturas2',
        component : CalendarioDiasFacturas2Component
    },
    {
        path : 'calendario-dias-facturas3',
        component : CalendarioDiasFacturas3Component
    },
    {
        path : 'formato-factura',
        component : FormatoFacturaComponent
    },
    {
        path : 'gastos-dia',
        component : GastosDiaComponent
    },
    {
        path : 'balance',
        component : BalanceComponent
    },
    {
        path : 'balance2',
        component : Balance2Component
    },
    {
        //redirecciona cualquier ruta que no exista a la ruta raiz
        path : '**',
        redirectTo: ''
    }
];
