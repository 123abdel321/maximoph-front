import React from "react";
import { Navigate } from "react-router-dom";

// TABLAS
  
  //Inmuebles
  import Inmuebles from "../pages/Tablas/Inmuebles/Index";
  //Personas
  import Personas from "../pages/Tablas/Personas/Index";
  //Zonas
  import Zonas from "../pages/Tablas/Zonas/Index";
  //****************************************************************************
  //****************************************************************************
  //Tipos Tarea
  import TiposTarea from "../pages/Tablas/TiposTarea/Index";
  //Tipos Vehiculo
  import TiposVehiculo from "../pages/Tablas/TiposVehiculo/Index";
  //Tipos Proveedor
  import TiposProveedor from "../pages/Tablas/TiposProveedor/Index";
  //Proveedores
  import Proveedores from "../pages/Tablas/Proveedores/Index";
  //****************************************************************************
  //****************************************************************************
  //Facturación Ciclica
  import FacturacionCiclicaMaestra from "../pages/Tablas/FacturacionCiclica/Index";
  //Conceptos Facturación
  import ConceptosFacturacion from "../pages/Tablas/ConceptosFacturacion/Index";
  //Conceptos Gastos
  import ConceptosGastos from "../pages/Tablas/ConceptosGastos/Index";
  //Conceptos Visita
  import ConceptosVisita from "../pages/Tablas/ConceptosVisita/Index";


// PROCESOS
  //Facturación Ciclica
  import FacturacionCiclica from "../pages/Procesos/FacturacionCiclica/Index";
  
  //LANDING
  
    //Facturación Histórico
    import FacturacionHistorico from "../pages/Procesos/FacturacionHistorico/Index";
    
    //Autorizar Visitantes
    import AutorizarVisitantes from "../pages/Procesos/AutorizarVisitantes/Index";

    //Proveedores
    import ProveedoresLanding from "../pages/Tablas/ProveedoresLanding/Index";

    //Clientes Máximo
    import ClientesMaximo from "../pages/Procesos/ClientesMaximo/Index";
  
  //LANDING

  //Gastos
  import Gastos from "../pages/Procesos/Gastos/Index";
  //Pagos
  import Pagos from "../pages/Procesos/Pagos/Index";
  //Recibos de Caja
  import RecibosCaja from "../pages/Procesos/RecibosCaja/Index";
  //Control Visitas
  import ControlVisitas from "../pages/Procesos/ControlVisitas/Index";
  //Acumulado
  import Acumulado from "../pages/Procesos/Acumulado/Index";

// ACCESOS
  
  //Usuarios
  import Usuarios from "../pages/Accesos/Usuarios/Index";

  //Usuarios roles
  import UsuariosRoles from "../pages/Accesos/UsuariosRoles/Index";
  
  //Roles permisos
  import RolesPermisos from "../pages/Accesos/RolesPermisos/Index";

// UTILIDADES

  //Entorno
  import Entorno from "../pages/Utilidades/Entorno/Index";

  //Logs
  import Logs from "../pages/Utilidades/Logs/Index";

  //Mensajes Masivos
  import MensajesMasivos from "../pages/Utilidades/MensajesMasivos/Index";

  //Mensajes Recibidos
  import MensajesRecibidos from "../pages/Utilidades/MensajesRecibidos/Index";

  //PQRSF
  import Pqrsf from "../pages/Utilidades/Pqrsf/Index";
  import PqrsfEnviados from "../pages/Utilidades/PqrsfEnviados/Index";

  //Tareas
  import Tareas from "../pages/Utilidades/Tareas/Index";
  import TareasRecibidas from "../pages/Utilidades/TareasRecibidas/Index";


// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";


const authProtectedRoutes = [
  //Tablas
  { path: "/tablas/inmuebles", component: <Inmuebles /> },
  { path: "/tablas/personas", component: <Personas /> },
  { path: "/tablas/facturacion-ciclica", component: <FacturacionCiclicaMaestra /> },
  { path: "/tablas/zonas", component: <Zonas /> },
  { path: "/tablas/tipos-tarea", component: <TiposTarea /> },
  { path: "/tablas/tipos-vehiculo", component: <TiposVehiculo /> },
  { path: "/tablas/proveedores", component: <Proveedores /> },
  { path: "/tablas/tipos-proveedor", component: <TiposProveedor /> },
  { path: "/tablas/conceptos-facturacion", component: <ConceptosFacturacion /> },
  { path: "/tablas/conceptos-gastos", component: <ConceptosGastos /> },
  { path: "/tablas/conceptos-visita", component: <ConceptosVisita /> },
  { path: "/tablas/proveedores-landing", component: <ProveedoresLanding /> },
  
  //Procesos
  { path: "/procesos/facturacion-ciclica", component: <FacturacionCiclica /> },
  { path: "/procesos/facturacion-historico", component: <FacturacionHistorico /> },
  { path: "/procesos/autorizar-visitantes", component: <AutorizarVisitantes /> },
  { path: "/procesos/gastos", component: <Gastos /> },
  { path: "/procesos/pagos", component: <Pagos /> },
  { path: "/procesos/recibos-de-caja", component: <RecibosCaja /> },
  { path: "/procesos/control-visitas", component: <ControlVisitas /> },
  { path: "/procesos/clientes-instalados-maximo", component: <ClientesMaximo /> },
  { path: "/procesos/acumulado", component: <Acumulado /> },
  
  //Accesos
  { path: "/accesos/roles-permisos", component: <RolesPermisos /> },
  { path: "/accesos/usuarios-roles", component: <UsuariosRoles /> },
  { path: "/accesos/usuarios", component: <Usuarios /> },
  
  //Utilidades
  { path: "/utilidades/entorno", component: <Entorno /> },
  { path: "/utilidades/logs", component: <Logs /> },
  { path: "/utilidades/mensajes-masivos", component: <MensajesMasivos /> },
  { path: "/utilidades/mensajes-recibidos", component: <MensajesRecibidos /> },
  { path: "/utilidades/pqrsfs", component: <Pqrsf /> },
  { path: "/utilidades/pqrsf", component: <PqrsfEnviados /> },
  { path: "/utilidades/tareas", component: <Tareas /> },
  { path: "/utilidades/tareas-recibidas", component: <TareasRecibidas /> },
  
  {
    path: "/",
    exact: true,
    component: < Navigate to="/procesos/autorizar-visitantes" />,
  },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/logout", component: <Logout /> },
];

export { authProtectedRoutes, publicRoutes };
