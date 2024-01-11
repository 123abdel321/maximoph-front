import { all, fork } from "redux-saga/effects";

//ERP > Ciudades
import Cities from "./erp/ciudades/saga";

//ERP > Centro de Costos
import CostsCenter from "./erp/centroCostos/saga";

//ERP > Comprobantes
import Vouchers from "./erp/comprobantes/saga";

//ERP > Plan de Cuentas
import Accounts from "./erp/cuentas/saga";

//Tablas > Inmuebles
import PropertiesSaga from "./tablas/inmuebles/saga";

//Tablas > Inmueble > Propietarios/Inquilinos
import PropertyOwnersRentersSaga from "./tablas/inmueblesPropietariosInquilinos/saga";

//Tablas > Inmueble > Visitantes
import PropertyVisitorsSaga from "./tablas/inmueblesVisitantes/saga";

//Tablas > Inmueble > Vehiculos
import PropertyVehiclesSaga from "./tablas/inmueblesVehiculos/saga";

//Tablas > Inmueble > Mascotas
import PropertyPetsSaga from "./tablas/inmueblesMascotas/saga";

//Tablas > Personas
import PersonSaga from "./tablas/personas/saga";

//Tablas > Facturas Ciclicas
import CyclicalBillsSaga from "./tablas/facturasCiclicas/saga";

//Tablas > Facturas Ciclica Detalles
import CyclicalBillDetailsSaga from "./tablas/facturaCiclicaDetalles/saga";

//Tablas > Zonas
import ZonesSaga from "./tablas/zonas/saga";

//Tablas > Tipos Tarea
import TypesHomeworkSaga from "./tablas/tiposTarea/saga";

//Tablas > Tipos Proveedor
import ProviderTypesSaga from "./tablas/tiposProveedor/saga";

//Tablas > Proveedores
import ProvidersSaga from "./tablas/proveedores/saga";

//Tablas > Tipos Vehiculo
import VehicleTypesSaga from "./tablas/tiposVehiculo/saga";

//Tablas > Conceptos Factura
import BillingConceptsSaga from "./tablas/conceptosFactura/saga";

//Tablas > Conceptos Gasto
import SpentConceptsSaga from "./tablas/conceptosGasto/saga";

//Tablas > Conceptos Visita
import ConceptVisitSaga from "./tablas/conceptosVisita/saga";

//Procesos > Facturas
import BillsSaga from "./procesos/facturas/saga";

//Procesos > Gastos
import SpentsSaga from "./procesos/gastos/saga";

//Procesos > Pagos
import PaymentsSaga from "./procesos/pagos/saga";

//Procesos > Recibos de Caja
import BillCashReceiptsSaga from "./procesos/recibosCaja/saga";

//Procesos > Control Visitas
import ControlVisitsSaga from "./procesos/controlVisitas/saga";

//Procesos > Clientes Instalados
import CustomersMaximoSaga from "./procesos/clientesMaximo/saga";

//Accesos > Usuarios Roles
import UsersRolesSaga from "./accesos/usuariosRoles/saga";

//Accesos > Usuarios
import UsersSaga from "./accesos/usuarios/saga";

//Utilidades > Entorno
import EnviromentSaga from "./utilidades/entorno/saga";

//Utilidades > Mensajes Masivos
import MassiveMessagesSaga from "./utilidades/mensajesMasivos/saga";

//Utilidades > Pqrsf
import PqrsfSaga from "./utilidades/Pqrsf/saga";

//Utilidades > Tareas
import HomeworksSaga from "./utilidades/tareas/saga";

//public
import AuthSaga from "./auth/login/saga";
import LayoutSaga from "./layout/saga";

export default function* rootSaga() {
  yield all([
    //erp
    fork(CostsCenter),
    fork(Vouchers),
    fork(Accounts),
    fork(Cities),
    
    //tablas
    fork(CyclicalBillsSaga),
    fork(CyclicalBillDetailsSaga),
    fork(PropertiesSaga),
    fork(PropertyOwnersRentersSaga),
    fork(PropertyVisitorsSaga),
    fork(PropertyVehiclesSaga),
    fork(PropertyPetsSaga),
    fork(PersonSaga),
    fork(ZonesSaga),
    fork(TypesHomeworkSaga),
    fork(ProviderTypesSaga),
    fork(ProvidersSaga),
    fork(VehicleTypesSaga),
    fork(BillingConceptsSaga),
    fork(SpentConceptsSaga),
    fork(ConceptVisitSaga),
    
    //procesos
    fork(BillsSaga),
    fork(SpentsSaga),
    fork(PaymentsSaga),
    fork(BillCashReceiptsSaga),
    fork(ControlVisitsSaga),
    fork(CustomersMaximoSaga),

    //accesos
    fork(UsersRolesSaga),
    fork(UsersSaga),

    //utilidades
    fork(EnviromentSaga),
    fork(MassiveMessagesSaga),
    fork(PqrsfSaga),
    fork(HomeworksSaga),

    //public
    fork(AuthSaga),
    fork(LayoutSaga)
  ]);
}
