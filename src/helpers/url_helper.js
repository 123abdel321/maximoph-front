//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGIN
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//ERP > CIUDADES
export const GET_ERP_CIUDADES = "/sys/accounting/erp-cities";

//ERP > CENTRO DE COSTOS
export const GET_ERP_CENTRO_COSTOS = "/sys/accounting/erp-costs-center";

//ERP > COMPROBANTES
export const GET_ERP_COMPROBANTES = "/sys/accounting/erp-vouchers";

//ERP > CUENTAS
export const GET_ERP_CUENTAS = "/sys/accounting/erp-accounts";

//TABLAS > FACTURAS CICLICAS
export const GET_FACTURAS_CICLICAS = "/sys/tables/cyclical-bills";
export const POST_FACTURA_CICLICA = "/sys/tables/cyclical-bills";
export const POST_FACTURA_CICLICA_MASIVA = "/sys/tables/cyclical-bills/massive";
export const POST_PROCESAR_FACTURA_CICLICA = "/sys/tables/cyclical-bills/process";
export const PUT_FACTURA_CICLICA = "/sys/tables/cyclical-bills";
export const DELETE_FACTURA_CICLICA = "/sys/tables/cyclical-bills";
export const DELETE_FACTURA_CICLICA_MASIVA = "/sys/tables/cyclical-bills/delete-massive";

//TABLAS > FACTURA CICLICA DETALLES
export const GET_FACTURA_CICLICA_DETALLES = "/sys/tables/cyclical-bill-details";
export const POST_FACTURA_CICLICA_DETALLE = "/sys/tables/cyclical-bill-details";
export const PUT_FACTURA_CICLICA_DETALLE = "/sys/tables/cyclical-bill-details";
export const DELETE_FACTURA_CICLICA_DETALLE = "/sys/tables/cyclical-bill-details";

//TABLAS > INMUEBLES
export const GET_INMUEBLES = "/sys/tables/properties";
export const POST_INMUEBLE = "/sys/tables/properties";
export const PUT_INMUEBLE = "/sys/tables/properties";
export const DELETE_INMUEBLE = "/sys/tables/properties";

//TABLAS > INMUEBLE > PROPIETARIOS/INQUILINOS
export const GET_INMUEBLE_PROPIETARIOS_INQUILINOS = "/sys/tables/property-owners-renters";
export const GET_INMUEBLES_PROPIETARIO_INQUILINO = "/sys/tables/property-owners-renters/properties";
export const POST_INMUEBLE_PROPIETARIO_INQUILINO = "/sys/tables/property-owners-renters";
export const PUT_INMUEBLE_PROPIETARIO_INQUILINO = "/sys/tables/property-owners-renters";
export const DELETE_INMUEBLE_PROPIETARIO_INQUILINO = "/sys/tables/property-owners-renters";

//TABLAS > INMUEBLE > VISITANTES
export const GET_INMUEBLE_VISITANTES = "/sys/tables/property-visitors";
export const POST_INMUEBLE_VISITANTE = "/sys/tables/property-visitors";
export const PUT_INMUEBLE_VISITANTE = "/sys/tables/property-visitors";
export const DELETE_INMUEBLE_VISITANTE = "/sys/tables/property-visitors";

//TABLAS > INMUEBLE > VEHICULOS
export const GET_INMUEBLE_VEHICULOS = "/sys/tables/property-vehicles";
export const POST_INMUEBLE_VEHICULO = "/sys/tables/property-vehicles";
export const PUT_INMUEBLE_VEHICULO = "/sys/tables/property-vehicles";
export const DELETE_INMUEBLE_VEHICULO = "/sys/tables/property-vehicles";
export const POST_SUBIR_FOTO_VEHICULO = "/sys/tables/property-vehicles/photo";

//TABLAS > INMUEBLE > MASCOTAS
export const GET_INMUEBLE_MASCOTAS = "/sys/tables/property-pets";
export const POST_INMUEBLE_MASCOTA = "/sys/tables/property-pets";
export const PUT_INMUEBLE_MASCOTA = "/sys/tables/property-pets";
export const DELETE_INMUEBLE_MASCOTA = "/sys/tables/property-pets";
export const POST_SUBIR_FOTO_MASCOTA = "/sys/tables/property-pets/photo";

//TABLAS > PERSONAS
export const GET_PERSONAS = "/sys/tables/persons";
export const GET_PERSONAS_ERP = "/sys/tables/persons/erp";
export const POST_SUBIR_FOTO_PERSONA = "/sys/tables/persons/photo";
export const POST_PERSONAS = "/sys/tables/persons";
export const POST_PERSONAS_SYNC_ERP = "/sys/tables/persons/sync-erp";
export const PUT_PERSONAS = "/sys/tables/persons";
export const DELETE_PERSONAS = "/sys/tables/persons";

//TABLAS > ZONAS
export const GET_ZONAS = "/sys/tables/zones";
export const POST_ZONA = "/sys/tables/zones";
export const PUT_ZONA = "/sys/tables/zones";
export const DELETE_ZONA = "/sys/tables/zones";

//TABLAS > TIPOS TAREA
export const GET_TIPOS_TAREA = "/sys/tables/types-homework";
export const POST_TIPO_TAREA = "/sys/tables/types-homework";
export const PUT_TIPO_TAREA = "/sys/tables/types-homework";
export const DELETE_TIPO_TAREA = "/sys/tables/types-homework";

//TABLAS > TIPOS PROVEEDOR
export const GET_TIPOS_PROVEEDOR = "/sys/tables/provider-types";
export const POST_TIPO_PROVEEDOR = "/sys/tables/provider-types";
export const PUT_TIPO_PROVEEDOR = "/sys/tables/provider-types";
export const DELETE_TIPO_PROVEEDOR = "/sys/tables/provider-types";

//TABLAS > PROVEEDORES
export const GET_PROVEEDORES = "/sys/tables/providers";
export const POST_PROVEEDOR = "/sys/tables/providers";
export const PUT_PROVEEDOR = "/sys/tables/providers";
export const DELETE_PROVEEDOR = "/sys/tables/providers";

//TABLAS > TIPOS VEHICULO
export const GET_TIPOS_VEHICULO = "/sys/tables/vehicle-types";
export const POST_TIPO_VEHICULO = "/sys/tables/vehicle-types";
export const PUT_TIPO_VEHICULO = "/sys/tables/vehicle-types";
export const DELETE_TIPO_VEHICULO = "/sys/tables/vehicle-types";

//TABLAS > CONCEPTOS FACTURA
export const GET_CONCEPTOS_FACTURA = "/sys/tables/billing-concepts";
export const POST_CONCEPTO_FACTURA = "/sys/tables/billing-concepts";
export const PUT_CONCEPTO_FACTURA = "/sys/tables/billing-concepts";
export const DELETE_CONCEPTO_FACTURA = "/sys/tables/billing-concepts";

//TABLAS > CONCEPTOS GASTO
export const GET_CONCEPTOS_GASTO = "/sys/tables/spent-concepts";
export const POST_CONCEPTO_GASTO = "/sys/tables/spent-concepts";
export const PUT_CONCEPTO_GASTO = "/sys/tables/spent-concepts";          
export const DELETE_CONCEPTO_GASTO = "/sys/tables/spent-concepts";

//TABLAS > CONCEPTOS VISITA
export const GET_CONCEPTOS_VISITA = "/sys/tables/visit-concepts";
export const POST_CONCEPTO_VISITA = "/sys/tables/visit-concepts";
export const PUT_CONCEPTO_VISITA = "/sys/tables/visit-concepts";
export const DELETE_CONCEPTO_VISITA = "/sys/tables/visit-concepts";

//PROCESOS > GASTOS
export const GET_GASTOS = "/sys/process/spents";
export const GET_GASTO_PDF = "/sys/process/spents/PDF";
export const POST_GASTO = "/sys/process/spents";
export const PUT_GASTO = "/sys/process/spents";
export const DELETE_GASTO = "/sys/process/spents";

//PROCESOS > PAGOS
export const GET_PAGOS = "/sys/process/payments";
export const GET_PAGOS_ACUMULADO = "/sys/process/payments/acumulate";
export const GET_PAGO_PDF = "/sys/process/payments/PDF";
export const POST_PAGO = "/sys/process/payments";
export const PUT_PAGO = "/sys/process/payments";
export const DELETE_PAGO = "/sys/process/payments";

//PROCESOS > RECIBOS DE CAJA
export const GET_RECIBOS_CAJA = "/sys/process/bill-cash-receipts";
export const GET_RECIBO_CAJA_PDF = "/sys/process/bill-cash-receipts/PDF";
export const GET_PAZ_Y_SALVO_PDF = "/sys/process/bill-cash-receipts/peace-and-safety/PDF";
export const POST_RECIBO_CAJA = "/sys/process/bill-cash-receipts";
export const POST_RECIBO_CAJA_ANTICIPOS = "/sys/process/bill-cash-receipts/anticipos";
export const PUT_RECIBO_CAJA = "/sys/process/bill-cash-receipts";
export const DELETE_RECIBO_CAJA = "/sys/process/bill-cash-receipts";

//PROCESOS > RECIBOS DE CAJA > COMPROBANTES
export const GET_VOUCHERS_BCR = "/sys/process/bill-cash-receipts/vouchers/all";
export const GET_VOUCHERS_ENVIADOS = "/sys/process/bill-cash-receipts/vouchers";
export const POST_VOUCHER = "/sys/process/bill-cash-receipts/vouchers";
export const PUT_VOUCHER = "/sys/process/bill-cash-receipts/vouchers";

//PROCESOS > FACTURAS
export const GET_FACTURAS = "/sys/process/history-bills/gen";
export const GET_FACTURAS_DETALLES = "/sys/process/history-bills/details";
export const GET_FACTURA_PDF = "/sys/process/bills/PDF";
export const GET_FACTURAS_PDF = "/sys/process/bills/PDFs";
export const SEND_FACTURA_PDF = "/sys/process/bills/email";
export const DELETE_FACTURA = "/sys/process/bills";
export const DELETE_FACTURAS = "/sys/process/bills/history";

//PROCESOS > CONTROL VISITAS
export const GET_CONTROL_VISITAS = "/sys/process/control-visits";
export const GET_CONTROL_VISITAS_VISITANTES = "/sys/process/control-visits/visitors";
export const POST_CONTROL_VISITA = "/sys/process/control-visits";
export const PUT_CONTROL_VISITA = "/sys/process/control-visits";
export const DELETE_CONTROL_VISITA = "/sys/process/control-visits";

//PROCESOS > CLIENTES INSTALADOS
export const GET_CLIENTES = "/admin/clients";
export const POST_CLIENTE = "/admin/clients";
export const PUT_CLIENTE = "/admin/clients/edit";
export const PUT_LOGO_CLIENTE = "/admin/clients/edit-logo";
export const DELETE_CLIENTE = "/admin/clients";

//ACCESOS > ROLES
export const GET_USUARIOS_ROLES = "/users/roles";
export const POST_USUARIO_ROL = "/users/roles";
export const PUT_USUARIO_ROL = "/users/roles";
export const PUT_ROL_PERMISOS = "/users/roles/permissions";
export const DELETE_USUARIO_ROL = "/users/roles";
export const GET_ROL_PERMISOS = "/users/roles/permissions";

//ACCESOS > USUARIOS
export const GET_USUARIOS = "/users";
export const POST_USUARIO = "/users/register";
export const PUT_USUARIO = "/users";
export const POST_DELETE_USUARIO = "/users/removeClient";

//UTILIDADES > ENTORNO
export const GET_LOGS = "/sys/utilities/logs";
export const GET_RESUMEN_ERP = "/sys/utilities/enviroment";
export const GET_API_KEY_ERP = "/sys/utilities/enviroment/validate-api-key-erp";
export const PUT_ENTORNO_MAXIMO = "/sys/utilities/enviroment";
export const DELETE_NOTIFICACIONES = "/sys/utilities/enviroment/notifications";
export const POST_SYNC_DATA_ERP = "/sys/utilities/enviroment/sync-data-erp";

//UTILIDADES > ENTORNO > IMPORTADOR
export const GET_IMPORTADOR_TABLA_PLANTILLA = "/sys/utilities/importer/download";
export const POST_IMPORTADOR_TABLA_PLANTILLA = "/sys/utilities/importer/upload";

//UTILIDADES > MENSAJES MASIVOS
export const GET_MENSAJES_RECIBIDOS = "/sys/utilities/massive-messages/receive";
export const GET_MENSAJES_MASIVOS = "/sys/utilities/massive-messages";
export const POST_MENSAJE_MASIVO = "/sys/utilities/massive-messages";
export const PUT_MENSAJE_MASIVO = "/sys/utilities/massive-messages";

//UTILIDADES > PQRSF
export const GET_PQRSF = "/sys/utilities/pqrsf/all";
export const GET_PQRSF_ENVIADOS = "/sys/utilities/pqrsf";
export const POST_PQRSF = "/sys/utilities/pqrsf";

//UTILIDADES > TAREAS
export const GET_TAREAS = "/sys/utilities/homeworks/all";
export const GET_TAREAS_ASIGNADAS = "/sys/utilities/homeworks";
export const POST_TAREA = "/sys/utilities/homeworks";
export const POST_TAREA_MASIVA = "/sys/utilities/homeworks/massive";
export const PUT_TAREA = "/sys/utilities/homeworks";
export const PUT_TAREA_COMPLETAR = "/sys/utilities/homeworks/change-state";
export const DELETE_TAREA = "/sys/utilities/homeworks";
export const DELETE_TAREA_MASIVA = "/sys/utilities/homeworks/massive";

//LOGIN MAXIMO PH
export const POST_JWT_LOGIN = "/users/login";
export const UPDATE_FB_TOKEN_USER = "/users/fb-token";