import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

//ERP > Ciudades
import Cities from "./erp/ciudades/reducer";

//ERP > Centro de Costos
import CostsCenter from "./erp/centroCostos/reducer";

//ERP > Comprobantes
import Vouchers from "./erp/comprobantes/reducer";

//ERP > Plan de Cuentas
import Accounts from "./erp/cuentas/reducer";

//Tablas > Facturas Ciclicas
import CyclicalBills from "./tablas/facturasCiclicas/reducer";

//Tablas > Facturas Ciclica Detalles
import CyclicalBillDetails from "./tablas/facturaCiclicaDetalles/reducer";

//Tablas > Inmuebles
import Properties from "./tablas/inmuebles/reducer";

//Tablas > Inmuebles > Propietarios/Inquilinos
import PropertyOwnersRenters from "./tablas/inmueblesPropietariosInquilinos/reducer";

//Tablas > Inmuebles > Visitantes
import PropertyVisitors from "./tablas/inmueblesVisitantes/reducer";

//Tablas > Inmuebles > Vehiculos
import PropertyVehicles from "./tablas/inmueblesVehiculos/reducer";

//Tablas > Inmuebles > Mascotas
import PropertyPets from "./tablas/inmueblesMascotas/reducer";

//Tablas > Personas
import Person from "./tablas/personas/reducer";

//Tablas > Zonas
import Zones from "./tablas/zonas/reducer";

//Tablas > Tipos Tarea
import TypesHomework from "./tablas/tiposTarea/reducer";

//Tablas > Tipos Proveedor
import ProviderTypes from "./tablas/tiposProveedor/reducer";

//Tablas > Proveedores
import Providers from "./tablas/proveedores/reducer";

//Tablas > Tipos Vehiculo
import VehicleTypes from "./tablas/tiposVehiculo/reducer";

//Tablas > Conceptos Factura
import BillingConcepts from "./tablas/conceptosFactura/reducer";

//Tablas > Conceptos Gasto
import SpentConcepts from "./tablas/conceptosGasto/reducer";

//Tablas > Conceptos Visita
import ConceptVisit from "./tablas/conceptosVisita/reducer";

//Procesos > Facturas
import Bills from "./procesos/facturas/reducer";

//Procesos > Gastos
import Spents from "./procesos/gastos/reducer";

//Procesos > Pagos
import Payments from "./procesos/pagos/reducer";

//Procesos > Recibos Caja
import BillCashReceipts from "./procesos/recibosCaja/reducer";

//Procesos > Control Visitas
import ControlVisits from "./procesos/controlVisitas/reducer";

//Procesos > Clientes Instalados
import CustomersMaximo from "./procesos/clientesMaximo/reducer";

//Accesos > Usuarios Roles
import UsersRoles from "./accesos/usuariosRoles/reducer";

//Accesos > Usuarios
import Users from "./accesos/usuarios/reducer";

//Utilidades > Entorno
import Enviroment from "./utilidades/entorno/reducer";

//Utilidades > Mensajes Masivos
import MassiveMessages from "./utilidades/mensajesMasivos/reducer";

//Utilidades > Pqrsf
import Pqrsf from "./utilidades/Pqrsf/reducer";

//Utilidades > Tareas
import Tareas from "./utilidades/tareas/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Profile from "./auth/profile/reducer";

const rootReducer = combineReducers({
  //ERP
  CostsCenter,
  Vouchers,
  Accounts,
  Cities,
  
  //Tablas
  Properties,
  CyclicalBills,
  CyclicalBillDetails,
  PropertyOwnersRenters,
  PropertyVisitors,
  PropertyVehicles,
  PropertyPets,
  Person,
  Zones,
  TypesHomework,
  ProviderTypes,
  Providers,
  VehicleTypes,
  BillingConcepts,
  SpentConcepts,
  ConceptVisit,
  
  //Procesos
  Bills,
  Spents,
  Payments,
  BillCashReceipts,
  ControlVisits,
  CustomersMaximo,

  //Accesos
  UsersRoles,
  Users,

  //Utilidades
  Enviroment,
  MassiveMessages,
  Pqrsf,
  Tareas,
  
  // public
  Layout,
  Login,
  Profile
});

export default rootReducer;
