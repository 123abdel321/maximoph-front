import axios from "axios";
import { del, get, post, put, getPDF } from "./api_helper";
import * as url from "./url_helper";

// Gets the logged in user data from local session
const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};

// Login Method
const postLogin = data => post(url.POST_JWT_LOGIN, data);

const updateTokenFBUser = token => put(url.UPDATE_FB_TOKEN_USER, {token});

// ERP > Ciudades
const getAllCities = () => get(url.GET_ERP_CIUDADES);

// ERP > Centro de Costos
const getAllCostsCenter = () => get(url.GET_ERP_CENTRO_COSTOS);

// ERP > Comprobantes
const getAllVouchers = () => get(url.GET_ERP_COMPROBANTES);

// ERP > Cuentas
const getAllAccounts = () => get(url.GET_ERP_CUENTAS);

// Tablas > Inmuebles
const getAllProperties = () => get(url.GET_INMUEBLES);

const postCreateProperty = data => post(url.POST_INMUEBLE, data);

const putEditProperty = data => put(url.PUT_INMUEBLE, data);

const deleteDeleteProperty = id => del(`${url.DELETE_INMUEBLE}/${id}`);

// Tablas > Inmueble > Propietarios/Inquilinos
const getAllPropertyOwnersRenters = data => get(`${url.GET_INMUEBLE_PROPIETARIOS_INQUILINOS}/${data.editInmuebleId}`);

const getAllPropertiesOwnerRenter = data => get(`${url.GET_INMUEBLES_PROPIETARIO_INQUILINO}/${data.email}`);

const postCreatePropertyOwnerRenter = data => post(url.POST_INMUEBLE_PROPIETARIO_INQUILINO, data);

const putEditPropertyOwnerRenter = data => put(url.PUT_INMUEBLE_PROPIETARIO_INQUILINO, data);

const deleteDeletePropertyOwnerRenter = id => del(`${url.DELETE_INMUEBLE_PROPIETARIO_INQUILINO}/${id}`);


// Tablas > Facturas Ciclicas
const getAllCyclicalBills= (date) => get(`${url.GET_FACTURAS_CICLICAS}${date?'?date=true':''}`);

const postCreateCyclicalBill = data => post(url.POST_FACTURA_CICLICA, data);

const postCreateCyclicalBillMassive = data => post(url.POST_FACTURA_CICLICA_MASIVA, data);

const postProcessCyclicalBill = data => post(url.POST_PROCESAR_FACTURA_CICLICA, data);

const putEditCyclicalBill = data => put(url.PUT_FACTURA_CICLICA, data);

const deleteDeleteCyclicalBill = id => del(`${url.DELETE_FACTURA_CICLICA}/${id}`);

const deleteDeleteCyclicalBillMassive = data => post(url.DELETE_FACTURA_CICLICA_MASIVA, data);


// Tablas > Factura Ciclica Detalles
const getAllCyclicalBillDetails= data => get(`${url.GET_FACTURA_CICLICA_DETALLES}/${data.editFacturaCiclicaId}`);

const postCreateCyclicalBillDetail = data => post(url.POST_FACTURA_CICLICA_DETALLE, data);

const putEditCyclicalBillDetail = data => put(url.PUT_FACTURA_CICLICA_DETALLE, data);

const deleteDeleteCyclicalBillDetail = id => del(`${url.DELETE_FACTURA_CICLICA_DETALLE}/${id}`);


// Tablas > Inmueble > Visitantes
const getAllPropertyVisitors = data => get(`${url.GET_INMUEBLE_VISITANTES}/${data.editInmuebleId}`);

const postCreatePropertyVisitor = data => post(url.POST_INMUEBLE_VISITANTE, data);

const putEditPropertyVisitor = data => put(url.PUT_INMUEBLE_VISITANTE, data);

const deleteDeletePropertyVisitor = id => del(`${url.DELETE_INMUEBLE_VISITANTE}/${id}`);


// Tablas > Inmueble > Vehiculos
const getAllPropertyVehicles = data => get(`${url.GET_INMUEBLE_VEHICULOS}/${data.editInmuebleId}`);

const postCreatePropertyVehicle = data => post(url.POST_INMUEBLE_VEHICULO, data);

const putEditPropertyVehicle = data => put(url.PUT_INMUEBLE_VEHICULO, data);

const deleteDeletePropertyVehicle = id => del(`${url.DELETE_INMUEBLE_VEHICULO}/${id}`);

const postUploadPhotoPropertyVehicle = data => post(url.POST_SUBIR_FOTO_VEHICULO, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Tablas > Inmueble > Mascotas
const getAllPropertyPets = data => get(`${url.GET_INMUEBLE_MASCOTAS}/${data.editInmuebleId}`);

const postCreatePropertyPet = data => post(url.POST_INMUEBLE_MASCOTA, data);

const putEditPropertyPet = data => put(url.PUT_INMUEBLE_MASCOTA, data);

const deleteDeletePropertyPet = id => del(`${url.DELETE_INMUEBLE_MASCOTA}/${id}`);

const postUploadPhotoPropertyPet = data => post(url.POST_SUBIR_FOTO_MASCOTA, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});



// Tablas > Personas
const getAllPersons = () => get(url.GET_PERSONAS);

const getAllPersonsErp = () => get(url.GET_PERSONAS_ERP);

const postCreatePerson = data => post(url.POST_PERSONAS, data);

const postUploadPhotoPerson = data => post(url.POST_SUBIR_FOTO_PERSONA, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putEditPerson = data => put(url.PUT_PERSONAS, data);

const putSyncPersonERP = id => post(`${url.POST_PERSONAS_SYNC_ERP}/${id}`);

const deleteDeletePerson = id => del(`${url.DELETE_PERSONAS}/${id}`);


// Tablas > Zonas
const getAllZones = () => get(url.GET_ZONAS);

const postCreateZone = data => post(url.POST_ZONA, data);

const putEditZone = data => put(url.PUT_ZONA, data);

const deleteDeleteZone = id => del(`${url.DELETE_ZONA}/${id}`);


// Tablas > Tipos Tarea
const getAllTypesHomework = () => get(url.GET_TIPOS_TAREA);

const postCreateTypeHomework = data => post(url.POST_TIPO_TAREA, data);

const putEditTypeHomework = data => put(url.PUT_TIPO_TAREA, data);

const deleteDeleteTypeHomework = id => del(`${url.DELETE_TIPO_TAREA}/${id}`);


// Tablas > Tipos Proveedor
const getAllProviderTypes = () => get(url.GET_TIPOS_PROVEEDOR);

const postCreateProviderType = data => post(url.POST_TIPO_PROVEEDOR, data);

const putEditProviderType = data => put(url.PUT_TIPO_PROVEEDOR, data);

const deleteDeleteProviderType = id => del(`${url.DELETE_TIPO_PROVEEDOR}/${id}`);


// Tablas > Proveedores
const getAllProviders = () => get(url.GET_PROVEEDORES);

const postCreateProvider = data => post(url.POST_PROVEEDOR, data);

const putEditProvider = data => put(url.PUT_PROVEEDOR, data);

const deleteDeleteProvider = id => del(`${url.DELETE_PROVEEDOR}/${id}`);


// Tablas > Tipos Vehiculo
const getAllVehicleTypes = () => get(url.GET_TIPOS_VEHICULO);

const postCreateVehicleType = data => post(url.POST_TIPO_VEHICULO, data);

const putEditVehicleType = data => put(url.PUT_TIPO_VEHICULO, data);

const deleteDeleteVehicleType = id => del(`${url.DELETE_TIPO_VEHICULO}/${id}`);


// Tablas > Conceptos Factura
const getAllBillingConcepts = data => get(`${url.GET_CONCEPTOS_FACTURA}?strict=${data.strict?1:0}`);

const postCreateBillingConcept = data => post(url.POST_CONCEPTO_FACTURA, data);

const putEditBillingConcept = data => put(url.PUT_CONCEPTO_FACTURA, data);

const deleteDeleteBillingConcept = id => del(`${url.DELETE_CONCEPTO_FACTURA}/${id}`);


// Tablas > Conceptos Gasto
const getAllSpentConcepts = () => get(url.GET_CONCEPTOS_GASTO);

const postCreateSpentConcept = data => post(url.POST_CONCEPTO_GASTO, data);

const putEditSpentConcept = data => put(url.PUT_CONCEPTO_GASTO, data);

const deleteDeleteSpentConcept = id => del(`${url.DELETE_CONCEPTO_GASTO}/${id}`);


// Tablas > Conceptos Visita
const getAllConceptsVisit = () => get(url.GET_CONCEPTOS_VISITA);

const postCreateConceptVisit = data => post(url.POST_CONCEPTO_VISITA, data);

const putEditConceptVisit = data => put(url.PUT_CONCEPTO_VISITA, data);

const deleteDeleteConceptVisit = id => del(`${url.DELETE_CONCEPTO_VISITA}/${id}`);


// Procesos > Facturas
const getAllBills = (data) => get(`${url.GET_FACTURAS}${data.idHistory?`/${data.idHistory}`:``}${data.idPerson?`?id_person=${data.idPerson}`:``}`);

const getAllBillsDetails = (data) => get(`${url.GET_FACTURAS_DETALLES}${data.idHistory?`/${data.idHistory}`:``}${data.idPerson?`?id_person=${data.idPerson}`:``}`);

const getBillPDFAPI = id => getPDF(`${url.GET_FACTURA_PDF}/${id.idBill}`);

const getBillsPDFAPI = id => getPDF(`${url.GET_FACTURAS_PDF}/${id.idPeriodo}/${id.fisico}`);

const sendBillPDFAPI = id => get(`${url.SEND_FACTURA_PDF}/${id.idBill}`);

const deleteDeleteBill = id => del(`${url.DELETE_FACTURA}/${id}`);

const deleteDeleteBills = id => del(`${url.DELETE_FACTURAS}/${id}`);

// Procesos > Gastos
const getAllSpents = () => get(url.GET_GASTOS);

const postCreateSpent = data => post(url.POST_GASTO, data);

const putEditSpent = data => put(url.PUT_GASTO, data);

const getSpentPDFAPI = id => getPDF(`${url.GET_GASTO_PDF}/${id.idSpent}`);

const deleteDeleteSpent = spentOper => del(`${url.DELETE_GASTO}/${spentOper.spentToDelete}?oper=${spentOper.operSpent}`);

// Procesos > Pagos
const getAllPayments = () => get(url.GET_PAGOS);

const getAllPaymentsAcumulate = () => get(url.GET_PAGOS_ACUMULADO);

const getPaymentsPDFAPI = id => getPDF(`${url.GET_PAGO_PDF}/${id.idPayment}`);

const getExtractPayments = tercero => get(`${url.GET_PAGOS}/extract-nit/${tercero}`);

const postCreatePayments = data => post(url.POST_PAGO, data);

const putEditPayments = data => put(url.PUT_PAGO, data);

const deleteDeletePayments = paymentOper => del(`${url.DELETE_PAGO}/${paymentOper.pagoToDelete}?oper=${paymentOper.operPago}`);

// Procesos > Recibos de Caja
const getAllBillCashReceipts = () => get(url.GET_RECIBOS_CAJA);

const getBillCashReceiptPDFAPI = id => getPDF(`${url.GET_RECIBO_CAJA_PDF}/${id.idBillCashReceipt}`);

const getPeaceAndSafetyPDFAPI = persona => getPDF(`${url.GET_PAZ_Y_SALVO_PDF}/${persona.persona}`);

const getExtractBillCashReceipts = tercero => get(`${url.GET_RECIBOS_CAJA}/extract-nit/${tercero}`);

const postCreateBillCashReceipt = data => post(url.POST_RECIBO_CAJA, data);

const postCreateBillCashReceiptAnticipos = data => post(url.POST_RECIBO_CAJA_ANTICIPOS, data);

const putEditBillCashReceipt = data => put(url.PUT_RECIBO_CAJA, data);

const deleteDeleteBillCashReceipt = reciboOper => del(`${url.DELETE_RECIBO_CAJA}/${reciboOper.reciboCajaToDelete}?oper=${reciboOper.operRecibo}`);

// Procesos > Recibos de Caja > Comprobantes
const getAllVouchersBCR = () => get(url.GET_VOUCHERS_BCR);

const getAllOwnVouchersBCR = () => get(url.GET_VOUCHERS_ENVIADOS);

const postCreateVoucher = data => post(url.POST_VOUCHER, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putEditVoucher = data => put(url.PUT_VOUCHER, data);


// Procesos > Control Visita
const getAllControlVisits = () => get(url.GET_CONTROL_VISITAS);

const getVisitorsControlVisits = search => get(`${url.GET_CONTROL_VISITAS_VISITANTES}/${search}`);

const postCreateControlVisit = (data) => post(url.POST_CONTROL_VISITA, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putEditControlVisit = data => put(url.PUT_CONTROL_VISITA, data);

const deleteDeleteControlVisit = id => del(`${url.DELETE_CONTROL_VISITA}/${id}`);

// Procesos > Clientes Instalados
const getAllCustomers = () => get(url.GET_CLIENTES);

const postCreateCustomer = (data) => post(url.POST_CLIENTE, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putEditCustomer = (data) => post(url.PUT_CLIENTE, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putEditLogoCustomer = (data) => post(url.PUT_LOGO_CLIENTE, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const deleteDeleteCustomer = id => del(`${url.DELETE_CLIENTE}/${id}`);


// Accesos > Roles Usuarios
const getAllUsersRoles = () => get(url.GET_USUARIOS_ROLES);

const getAllRolePermissions = id => get(`${url.GET_ROL_PERMISOS}/${id}`);

const postCreateUserRol = data => post(url.POST_USUARIO_ROL, data);

const putEditUserRol = data => put(url.PUT_USUARIO_ROL, data);

const putEditRolePermissions = data => put(url.PUT_ROL_PERMISOS, data);

const deleteDeleteUserRol = id => del(`${url.DELETE_USUARIO_ROL}/${id}`);

// Accesos > Usuarios
const getAllClientUsers = () => get(url.GET_USUARIOS);

const postCreateClientUser = data => post(url.POST_USUARIO, data);

const putEditClientUser = data => put(url.PUT_USUARIO, data);

const deleteDeleteClientUser = data => post(url.POST_DELETE_USUARIO,data);


// Utilidades > Entorno
const getAllSummaryErp = () => get(url.GET_RESUMEN_ERP);

const postSyncErp = data => post(url.POST_SYNC_DATA_ERP, data);

const putEditApiKeyErp = key => get(`${url.GET_API_KEY_ERP}/${key}`);


const putEnviromentMaximo = data => put(url.PUT_ENTORNO_MAXIMO, data);

const deleteDeleteNotification = id => del(`${url.DELETE_NOTIFICACIONES}/${id}`);

// Utilidades > Logs
const getLogsMaximo = () => get(url.GET_LOGS);

// Utilidades > Importador
const getSpecificTableImporterTemplate = (origin) => get(`${url.GET_IMPORTADOR_TABLA_PLANTILLA}/${origin}`);

const postSpecificTableImporterTemplate = (template) => post(url.POST_IMPORTADOR_TABLA_PLANTILLA, template, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Utilidades > Mensajes Masivos
const getAllReceiveMessages = () => get(url.GET_MENSAJES_RECIBIDOS);

const getAllMassiveMessages = () => get(url.GET_MENSAJES_MASIVOS);

const postCreateMassiveMessage = (data) => post(url.POST_MENSAJE_MASIVO, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const putReadMassiveMessage = id => put(`${url.PUT_MENSAJE_MASIVO}/${id}`);

// Utilidades > Pqrsf
const getAllPqrsf = () => get(url.GET_PQRSF);

const getAllOwnPqrsf = () => get(url.GET_PQRSF_ENVIADOS);

const postCreatePqrsf = (data) => post(url.POST_PQRSF, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


// Utilidades > Tareas
const getAllHomeworks = () => get(url.GET_TAREAS);

const getAllOwnHomeworks = () => get(url.GET_TAREAS_ASIGNADAS);

const postCreateHomework = data => post(url.POST_TAREA, data);

const postCreateHomeworkMassive = data => post(url.POST_TAREA_MASIVA, data);

const putEditHomework = data => put(url.PUT_TAREA, data);

const putCompleteHomework = (data) => post(url.PUT_TAREA_COMPLETAR, data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const deleteDeleteHomework = id => del(`${url.DELETE_TAREA}/${id}`);

const deleteDeleteHomeworkMassive = data => put(url.DELETE_TAREA_MASIVA, data);

export {
  //ERP
  getAllCostsCenter,
  getAllVouchers,
  getAllAccounts,
  getAllCities,
  
  //TABLAS
  getAllCyclicalBills,
  postCreateCyclicalBill,
  postCreateCyclicalBillMassive,
  postProcessCyclicalBill,
  putEditCyclicalBill,
  deleteDeleteCyclicalBill,
  
  getAllCyclicalBillDetails,
  postCreateCyclicalBillDetail,
  putEditCyclicalBillDetail,
  deleteDeleteCyclicalBillDetail,
  deleteDeleteCyclicalBillMassive,
  
  getAllProperties,
  postCreateProperty,
  putEditProperty,
  deleteDeleteProperty,
  
  getAllPropertyOwnersRenters,
  getAllPropertiesOwnerRenter,
  postCreatePropertyOwnerRenter,
  putEditPropertyOwnerRenter,
  deleteDeletePropertyOwnerRenter,
  
  getAllPropertyVisitors,
  postCreatePropertyVisitor,
  putEditPropertyVisitor,
  deleteDeletePropertyVisitor,
  
  getAllPropertyVehicles,
  postCreatePropertyVehicle,
  putEditPropertyVehicle,
  deleteDeletePropertyVehicle,
  postUploadPhotoPropertyVehicle,

  getAllPropertyPets,
  postCreatePropertyPet,
  putEditPropertyPet,
  deleteDeletePropertyPet,
  postUploadPhotoPropertyPet,
  
  getAllPersons,
  getAllPersonsErp,
  postCreatePerson,
  postUploadPhotoPerson,
  putEditPerson,
  putSyncPersonERP,
  deleteDeletePerson,
  
  getAllZones,
  postCreateZone,
  putEditZone,
  deleteDeleteZone,
  
  getAllConceptsVisit,
  postCreateConceptVisit,
  putEditConceptVisit,
  deleteDeleteConceptVisit,
  
  getAllTypesHomework,
  postCreateTypeHomework,
  putEditTypeHomework,
  deleteDeleteTypeHomework,
  
  getAllProviderTypes,
  postCreateProviderType,
  putEditProviderType,
  deleteDeleteProviderType,

  getAllProviders,
  postCreateProvider,
  putEditProvider,
  deleteDeleteProvider,
  
  getAllVehicleTypes,
  postCreateVehicleType,
  putEditVehicleType,
  deleteDeleteVehicleType,
  
  getAllBillingConcepts,
  postCreateBillingConcept,
  putEditBillingConcept,
  deleteDeleteBillingConcept,
  
  getAllSpentConcepts,
  postCreateSpentConcept,
  putEditSpentConcept,
  deleteDeleteSpentConcept,

  //PROCESOS
  getAllBills,
  getAllBillsDetails,
  getBillPDFAPI,
  getBillsPDFAPI,
  sendBillPDFAPI,
  deleteDeleteBill,
  deleteDeleteBills,

  getAllSpents,
  getSpentPDFAPI,
  postCreateSpent,
  putEditSpent,
  deleteDeleteSpent,

  getAllPayments,
  getAllPaymentsAcumulate,
  getPaymentsPDFAPI,
  getExtractPayments,
  postCreatePayments,
  putEditPayments,
  deleteDeletePayments,

  getAllBillCashReceipts,
  getBillCashReceiptPDFAPI,
  getPeaceAndSafetyPDFAPI,
  getExtractBillCashReceipts,
  postCreateBillCashReceipt,
  postCreateBillCashReceiptAnticipos,
  putEditBillCashReceipt,
  deleteDeleteBillCashReceipt,

  getAllVouchersBCR,
  getAllOwnVouchersBCR,
  postCreateVoucher,
  putEditVoucher,

  getAllControlVisits,
  getVisitorsControlVisits,
  postCreateControlVisit,
  putEditControlVisit,
  deleteDeleteControlVisit,

  getAllCustomers,
  postCreateCustomer,
  putEditCustomer,
  putEditLogoCustomer,
  deleteDeleteCustomer,

  getLoggedInUser,
  isUserAuthenticated,
  postLogin,
  updateTokenFBUser,

  //ACCESOS
  getAllUsersRoles,
  getAllRolePermissions,
  postCreateUserRol,
  putEditUserRol,
  putEditRolePermissions,
  deleteDeleteUserRol,

  getAllClientUsers,
  postCreateClientUser,
  putEditClientUser,
  deleteDeleteClientUser,

  //UTILIDADES
  getAllSummaryErp,
  getLogsMaximo,
  postSyncErp,
  putEditApiKeyErp,
  putEnviromentMaximo,
  deleteDeleteNotification,
  getSpecificTableImporterTemplate,
  postSpecificTableImporterTemplate,

  getAllReceiveMessages,
  getAllMassiveMessages,
  postCreateMassiveMessage,
  putReadMassiveMessage,

  getAllPqrsf,
  getAllOwnPqrsf,
  postCreatePqrsf,

  getAllHomeworks,
  getAllOwnHomeworks,
  postCreateHomework,
  postCreateHomeworkMassive,
  putEditHomework,
  putCompleteHomework,
  deleteDeleteHomework,
  deleteDeleteHomeworkMassive
};
