import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  FormFeedback,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  CardTitle
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import Dropzone from "react-dropzone";
import { useFormik } from "formik";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// actions
import { getDataSummaryErp, getVouchers, getAccounts, editApiKeyErp, syncDataERP, editEnviromentMaximo, getBillingConcepts, getConceptsVisit, editLogoCustomer } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexEntorno = props => {

  //meta title
  document.title = "Entorno | Maximo PH";

  const dispatch = useDispatch();
  
  const [conceptoVisita, setConceptoVisita] = useState(false);
  const [conceptoIntereses, setConceptoIntereses] = useState(false);
  const [conceptoAdministracion, setConceptoAdministracion] = useState(false);
  const [conceptoAdministracionParqueadero, setConceptoAdministracionParqueadero] = useState(false);
  const [conceptoAdministracionCuartoUtil, setConceptoAdministracionCuartoUtil] = useState(false);
  const [redondeoConceptos, setRedondeoConceptos] = useState(0);
  const [controlFechaDigitacion, setControlFechaDigitacion] = useState(0);
  const [APIKEYERPValida, setAPIKEYERPValida] = useState(false);
  const [comprobanteVenta, setComprobanteVenta] = useState();
  const [comprobanteReciboCaja, setComprobanteReciboCaja] = useState();
  const [comprobanteGasto, setComprobanteGasto] = useState();
  const [comprobantePago, setComprobantePago] = useState();
  const [cuentaDscto, setCuentaDscto] = useState();
  const [cuentaAnticipo, setCuentaAnticipo] = useState();
  const [cuentaIngresoPasarela, setCuentaIngresoPasarela] = useState();
  const [cuentaIngresoRecibosCaja, setCuentaIngresoRecibosCaja] = useState();
  const [cuentaEgresoPagos, setCuentaEgresoPagos] = useState();

  const [companyLogo, setCompanyLogo] = useState(null);
  const [loadingTextAPI, setLoadingTextAPI] = useState('');
  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const { dataVouchers, dataAccountsDscto, dataAccountsAnticipo, dataAccountsIngresos, dataEnviroment, dataBillingConcepts, dataConceptsVisit } = useSelector(state => ({
    dataVouchers: state.Vouchers.vouchers,
    dataEnviroment: state.Enviroment.summaryErp,
    dataBillingConcepts: state.BillingConcepts.billingConcepts,
    dataConceptsVisit: state.ConceptVisit.conceptsVisit,
    dataAccountsDscto: state.Accounts.accounts.filter(i=>i.nombre.toLowerCase().indexOf("descuento")>=0||i.nombre.toLowerCase().indexOf("dscto")>=0),
    dataAccountsAnticipo: state.Accounts.accounts.filter(i=>i.codigo.toLowerCase().indexOf("130505")>=0||i.codigo.toLowerCase().indexOf("280505")>=0),
    dataAccountsIngresos: state.Accounts.accounts.filter(i=>i.codigo.toLowerCase().indexOf("1105")>=0||i.codigo.toLowerCase().indexOf("1110")>=0||i.codigo.toLowerCase().indexOf("1101")>=0||i.codigo.toLowerCase().indexOf("1120")>=0),
  }));

  const syncDataERPfn = async ()=>{
    setLoadingTextAPI("Obteniendo centros de costos actualziados de su ERP ...");

    dispatch(syncDataERP({origin: 'centro_costos'}, ()=>{
      
      setLoadingTextAPI("Obteniendo comprobantes actualziados de su ERP ...");

      dispatch(syncDataERP({origin: 'comprobantes'}, ()=>{ 
        
        setLoadingTextAPI("Obteniendo cuentas actualziadas de su ERP ...");

        dispatch(syncDataERP({origin: 'cuentas'}, ()=>{ 

          setLoadingTextAPI("Obteniendo personas actualziadas de su ERP ...");

          dispatch(syncDataERP({origin: 'nits'}, ()=>{ 
            toastr.success("Datos desde el ERP actualizados.", "Operación Ejecutada");

            loadInitData();
          }));

        }));

      }));
    }));
  };

  const loadInitData = ()=>{
    setLoadingText('Cargando ...');
    setLoadingTextAPI('Cargando ...');

    dispatch(getDataSummaryErp(null, async (dataSummaryErp)=>{
      let newAccessModule = accessModule;
      dataSummaryErp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      if(dataSummaryErp.logo){
        const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/company-logo/"+dataSummaryErp.logo;
        const response = await fetch(IMAGE_URL);
        const blob = await response.blob();
        const fileType = blob.type;
        const file = new File([blob], dataSummaryErp.logo, { type: fileType });

        addLogoCompany(file, false);
      }
      console.log('newAccessModule: ',newAccessModule);
      setAccessModule(newAccessModule);
      dispatch(getVouchers(null, ()=>{
        dispatch(getAccounts(null, ()=>{
          dispatch(getBillingConcepts(null, ()=>{
            dispatch(getConceptsVisit(null, ()=>{ 
            
            let dataSynced = dataSummaryErp.erpTotalsSynced[0];

            validationAPI.setFieldValue("entorno-centro-costos-sincronizados", dataSynced.centro_costos.toLocaleString());
            validationAPI.setFieldValue("entorno-comprobantes-sincronizados", dataSynced.comprobantes.toLocaleString());
            validationAPI.setFieldValue("entorno-cuentas-sincronizados", dataSynced.cuentas.toLocaleString());

            dataSummaryErp.simpleEnviroment.map(field=>{
              switch(field.campo){
                case "api_key_erp":
                  if(field.valor){ setAPIKEYERPValida(true); }
                  validationAPI.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), field.valor);
                break; 
                case "validacion_estricta_area":
                  validationConfig.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), (Number(field.valor||0) == 1 ? true : false));
                break; 
                case "agrupar_cuenta_cobro":
                  validationConfig.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), (Number(field.valor||0) == 1 ? true : false));
                break;
                case "editar_valor_admon_inmueble":
                  validationConfig.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), (Number(field.valor||0) == 1 ? true : false));
                break;  
                case "valor_total_presupuesto_year_actual":
                  validationConfig.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), Number(field.valor.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES'));
                break; 
                case "redondeo_conceptos":
                  let redondeoConceptos = Number(field.valor||0);
                  let textRedondeoConceptos = 'Sin redondeo';
                  
                  switch(redondeoConceptos){
                    case 50:
                      textRedondeoConceptos = 'A 50 pesos';
                    break;
                    case 100:
                      textRedondeoConceptos = 'A 100 pesos';
                    break;
                  }

                  setRedondeoConceptos({
                    label: textRedondeoConceptos,
                    value: redondeoConceptos
                  });
                break;
                case "control_fecha_digitacion":
                  let controlFechaDigitacionV = Number(field.valor||0);
                  let textControlFechaDigitacion = 'Sin control';

                  switch(controlFechaDigitacionV){
                    case 1:
                      textControlFechaDigitacion = 'Al día';
                    break;
                    case 2:
                      textControlFechaDigitacion = 'Un mes atrás';
                    break;
                  }

                  setControlFechaDigitacion({
                    label: textControlFechaDigitacion,
                    value: controlFechaDigitacionV
                  });
                break;
                default:
                  validationConfig.setFieldValue("entorno-"+field.campo.replaceAll("_","-"), field.valor);
                break;
              }
            });
            
            let comboERPBase = {};
            dataSummaryErp.erpBases.map(field=>{
              
              comboERPBase = {label: field.label, value: field.value};

              switch(field.campo){
                case "id_comprobante_ventas_erp":
                  setComprobanteVenta(comboERPBase);
                break;
                case "id_comprobante_gastos_erp":    
                  setComprobanteGasto(comboERPBase);
                break;
                case "id_comprobante_pagos_erp":    
                  setComprobantePago(comboERPBase);
                break;
                case "id_comprobante_recibos_caja_erp":
                  setComprobanteReciboCaja(comboERPBase);
                break;
                case "id_cuenta_descuento_erp":
                  setCuentaDscto(comboERPBase);
                break;
                case "id_cuenta_anticipos_erp":
                  setCuentaAnticipo(comboERPBase);
                break;
                case "id_cuenta_ingreso_recibos_caja_erp":
                  setCuentaIngresoRecibosCaja(comboERPBase);
                break;
                case "id_cuenta_ingreso_pasarela_erp":
                  setCuentaIngresoPasarela(comboERPBase);
                break;
                case "id_cuenta_egreso_pagos_erp":
                  setCuentaEgresoPagos(comboERPBase);
                break;
              }

              comboERPBase = {};
            });

            let conceptoAdmin = dataSummaryErp.conceptoAdministracion[0];
            let conceptoAdminParqueadero = dataSummaryErp.conceptoAdministracionParqueadero[0];
            let conceptoAdminCuartoUtil = dataSummaryErp.conceptoAdministracionCuartoUtil[0];
            
            if(conceptoAdmin){
              setConceptoAdministracion({
                label: conceptoAdmin.label,
                value: conceptoAdmin.value
              });
            }

            if(conceptoAdminParqueadero){
              setConceptoAdministracionParqueadero({
                label: conceptoAdminParqueadero.label,
                value: conceptoAdminParqueadero.value
              });
            }

            if(conceptoAdminCuartoUtil){
              setConceptoAdministracionCuartoUtil({
                label: conceptoAdminCuartoUtil.label,
                value: conceptoAdminCuartoUtil.value
              });
            }

            let conceptoIntereses = dataSummaryErp.conceptoIntereses[0];
            
            if(conceptoIntereses){
              setConceptoIntereses({
                label: conceptoIntereses.label,
                value: conceptoIntereses.value
              });
            }
            
            let conceptoVisita = dataSummaryErp.conceptoVisita[0];
            
            if(conceptoVisita){
              setConceptoVisita({
                label: conceptoVisita.label,
                value: conceptoVisita.value
              });
            }

            setLoadingText('');
            setLoadingTextAPI('');

            }));
          }));
        }));
      }));
    }));
  };

  useEffect(()=>{
    loadInitData();
  },[]);

  const validationAPI = useFormik({
    enableReinitialize: true,
    initialValues: {
      'entorno-api-key-erp': '',
      'entorno-centro-costos-sincronizados': '0',
      'entorno-comprobantes-sincronizados': '0',
      'entorno-cuentas-sincronizados': '0'
    },
    validationSchema: Yup.object({
      'entorno-api-key-erp': Yup.string().required("Por favor ingresa el API KEY.")
    }),
    onSubmit: (values) => {
      if(accessModule.ACTUALIZAR==true){
        let keyERP = validationAPI.values['entorno-api-key-erp'];

        setLoadingTextAPI("Validando API KEY ...");

        dispatch(editApiKeyErp(keyERP, async (response)=>{
          if(response.success){
            setAPIKEYERPValida(true);

            setLoadingTextAPI("");
            
            toastr.success("API KEY Validada.", "Operación Ejecutada");
            
            await syncDataERPfn();
          }else{
            setAPIKEYERPValida(false);

            setLoadingTextAPI("");

            validationAPI.setFieldValue("entorno-api-key-erp", "");

            toastr.error("API KEY Inválida.", "Error en la operación");
          }
        }));
      }else{
        toastr.options = { positionClass: 'toast-top-right' };
        toastr.warning("No tienes acceso a editar el entorno", "Permisos");
      }
    }
  });

  const validationConfig = useFormik({
    enableReinitialize: true,
    initialValues: {
      'entorno-consecutivo-ventas': '',
      'entorno-agrupar-cuenta-cobro': '',
      'entorno-editar-valor-admon-inmueble': '',
      'entorno-validacion-estricta-area': '',
      'entorno-consecutivo-recibos-caja': '',
      'entorno-consecutivo-gastos': '',
      'entorno-consecutivo-pagos': '',
      'entorno-porcentaje-intereses-mora': '',
      'entorno-dia-limite-pago-sin-interes': '',
      'entorno-dia-limite-descuento-pronto-pago': '',
      'entorno-porcentaje-descuento-pronto-pago': ''
    },
    validationSchema: Yup.object({
      'entorno-consecutivo-ventas': Yup.string().required("Por favor ingresa el consecutivo para ventas."),
      'entorno-consecutivo-recibos-caja': Yup.string().required("Por favor ingresa el consecutivo para recibos de caja."),
      'entorno-consecutivo-gastos': Yup.string().required("Por favor ingresa el consecutivo para gastos."),
      'entorno-consecutivo-pagos': Yup.string().required("Por favor ingresa el consecutivo para pagos."),
      'entorno-porcentaje-intereses-mora': Yup.string().required("Por favor ingresa el porcentaje para interés."),
      'entorno-dia-limite-pago-sin-interes': Yup.string().required("Por favor ingresa el día límite."),
      'entorno-porcentaje-intereses-mora': Yup.string().required("Por favor ingresa el porcentaje para interés."),
      'entorno-dia-limite-descuento-pronto-pago': Yup.string().required("Por favor ingresa el porcentaje de descuento.")
    }),
    onSubmit: (values) => {
      if(accessModule.ACTUALIZAR==true){
        let entornoValues = {};

        let fieldName = '';
        let fieldValue = '';
        Object.entries(values).map((field)=>{
          fieldValue = field[1];
          fieldName = field[0].replace('entorno-','');
          fieldName = fieldName.replaceAll('-','_');

          if(['validacion_estricta_area','agrupar_cuenta_cobro','editar_valor_admon_inmueble'].indexOf(fieldName)>=0){
            fieldValue = fieldValue[0] == 'on' || fieldValue ? true : false;
          }else  if(fieldName=='valor_total_presupuesto_year_actual'){
            fieldValue = Number(fieldValue.replaceAll(",","").replaceAll(".",""));
          }
          
          entornoValues[fieldName] = fieldValue;

          fieldName = '';
          fieldValue = '';
        });

        entornoValues['id_comprobante_ventas_erp'] = comprobanteVenta.value;
        entornoValues['id_comprobante_gastos_erp'] = comprobanteGasto.value;
        entornoValues['id_comprobante_pagos_erp'] = comprobantePago.value;
        entornoValues['id_comprobante_recibos_caja_erp'] = comprobanteReciboCaja.value;
        entornoValues['id_cuenta_descuento_erp'] = cuentaDscto.value;
        entornoValues['id_cuenta_anticipos_erp'] = cuentaAnticipo.value;
        entornoValues['id_cuenta_ingreso_recibos_caja_erp'] = cuentaIngresoRecibosCaja.value;
        entornoValues['id_cuenta_egreso_pagos_erp'] = cuentaEgresoPagos.value;
        entornoValues['id_cuenta_ingreso_pasarela_erp'] = cuentaIngresoPasarela?.value;
        entornoValues['id_concepto_administracion'] = conceptoAdministracion?.value;
        entornoValues['id_concepto_administracion_parqueadero'] = conceptoAdministracionParqueadero?.value;
        entornoValues['id_concepto_administracion_cuarto_util'] = conceptoAdministracionCuartoUtil?.value;
        entornoValues['id_concepto_visita'] = conceptoVisita.value;
        entornoValues['id_concepto_intereses'] = conceptoIntereses.value;
        entornoValues['redondeo_conceptos'] = redondeoConceptos.value;
        entornoValues['control_fecha_digitacion'] = controlFechaDigitacion.value;

        setLoadingText("Guardando ...");

        dispatch(editEnviromentMaximo(entornoValues, (response)=>{
          if(response.success){
            setLoadingText(false);

            loadInitData();
            toastr.success("API KEY Validada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);

            toastr.error("API KEY Inválida.", "Error en la operación");
          }
        }));
      }else{
        toastr.options = { positionClass: 'toast-top-right' };
        toastr.warning("No tienes acceso a editar el entorno", "Permisos");
      }
    }
  });

  const addLogoCompany = (image, upload)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      setCompanyLogo(image);
      if(upload){
        const customerValues = new FormData();
        customerValues.append('image', image);
        customerValues.append('tipo_logo', image?.type);
        customerValues.append('id',JSON.parse(localStorage.getItem("authUser")).id_cliente);
        
        setLoadingText("Guardando ...");

        dispatch(editLogoCustomer(customerValues, (response)=>{
          setLoadingText(false);
          
          localStorage.setItem("logo", response.logo);

          loadInitData();
          
          toastr.success("Logo actualizado.", "Operación Ejecutada");
        }));
      }
    }else if(image&&upload){
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utilidades" breadcrumbItem="Entorno" />
          {accessModule.INGRESAR==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">Configuración Conexión Contabilidad vía API</CardTitle>
                    {
                      loadingTextAPI.length==0 ?
                        (<Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            
                            validationAPI.submitForm();

                            return false;
                          }}>
                          <Row>
                            <Col md={9}>
                                <label className="col-md-12 col-form-label">API KEY CONTABILIDAD</label>
                                <div className="col-md-12">
                                  <Input
                                    type="text"
                                    className="form-control"
                                    disabled={APIKEYERPValida}
                                    name="entorno-api-key-erp"
                                    value={validationAPI.values['entorno-api-key-erp'] || ""}
                                    onChange={validationAPI.handleChange}
                                    onBlur={validationAPI.handleBlur}
                                    invalid={
                                      validationAPI.touched['entorno-api-key-erp'] && validationAPI.errors['entorno-api-key-erp'] && !validationAPI.values['entorno-api-key-erp'] ? true : false
                                    }
                                  />
                                  {validationAPI.touched['entorno-api-key-erp'] && validationAPI.errors['entorno-api-key-erp'] && !validationAPI.values['entorno-api-key-erp'] ? (
                                    <FormFeedback type="invalid">{validationAPI.errors['entorno-api-key-erp']}</FormFeedback>
                                  ) : null}
                                </div>
                            </Col>
                            <Col md={3}>
                              <label className="col-md-12 col-form-label"><br /></label>
                              <Button type="submit" color={!APIKEYERPValida ? "info":"success"} className="btn btn-primary  btn-label">
                                <i className={!APIKEYERPValida ? "bx bx-question-mark label-icon":"bx bx-check label-icon"}></i> {!APIKEYERPValida ? "Validar API KEY": "API KEY Validada"}
                              </Button>
                            </Col>
                          </Row>
                          
                          {
                            APIKEYERPValida &&
                              (<Row>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Comprobantes - Sincronizados en Caché</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="text"
                                        disabled={true}
                                        className="form-control"
                                        onChange={validationAPI.handleChange}
                                        onBlur={validationAPI.handleBlur}
                                        name="entorno-comprobantes-sincronizados"
                                        value={validationAPI.values['entorno-comprobantes-sincronizados'] || "0"}
                                      />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Centro de Costos - Sincronizados en Caché</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="text"
                                        disabled={true}
                                        className="form-control"
                                        onChange={validationAPI.handleChange}
                                        onBlur={validationAPI.handleBlur}
                                        name="entorno-centro-costos-sincronizados"
                                        value={validationAPI.values['entorno-centro-costos-sincronizados'] || "0"}
                                      />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Cuentas - Sincronizadas en Caché</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="text"
                                        disabled={true}
                                        className="form-control"
                                        name="entorno-cuentas-sincronizados"
                                        onChange={validationAPI.handleChange}
                                        onBlur={validationAPI.handleBlur}
                                        value={validationAPI.values['entorno-cuentas-sincronizados'] || "0"}
                                      />
                                    </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label"><br /></label>
                                  <Button type="button" color="info" onClick={()=>{ syncDataERPfn(); }} className="btn btn-primary  btn-label">
                                    <i className="bx bx bx-sync label-icon"></i> Obtener Datos Base Caché ERP
                                  </Button>
                                </Col>
                            </Row>)
                          }
                        </Form>)
                      :
                        (<Row>
                          <Col xl={12}>
                            <Card>
                              <Row>
                                <Col md={12} style={{textAlign: 'center'}}>
                                  <br />
                                  <span>{loadingTextAPI}</span>
                                  
                                  <br />
                                  <br />
                                  <Spinner className="ms-12" color="dark" /> 
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>)
                    }
                  </CardBody>
                </Card>
                  
                <br />

                
                    {
                      loadingText != "Cargando ..." ?
                        (<Form
                          onSubmit={(e) => {
                            e.preventDefault();
                            
                            validationConfig.submitForm();

                            return false;
                          }}>

                          {
                            APIKEYERPValida &&
                            (<Card>
                                <CardBody>
                                  <CardTitle className="h5 mb-4">Configuración General ERP Contabilidad</CardTitle>
                                  <Row>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Comprobante Ventas</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={comprobanteVenta}
                                            data={dataVouchers}
                                            onChange={(val)=>setComprobanteVenta(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Consecutivo Ventas</label>
                                      <div className="col-md-12">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="entorno-consecutivo-ventas"
                                            value={validationConfig.values['entorno-consecutivo-ventas'] || ""}
                                            onChange={validationConfig.handleChange}
                                            onBlur={validationConfig.handleBlur}
                                            invalid={
                                              validationConfig.touched['entorno-consecutivo-ventas'] && validationConfig.errors['entorno-consecutivo-ventas'] && !validationConfig.values['entorno-consecutivo-ventas'] ? true : false
                                            }
                                          />
                                          {validationConfig.touched['entorno-consecutivo-ventas'] && validationConfig.errors['entorno-consecutivo-ventas'] && !validationConfig.values['entorno-consecutivo-ventas'] ? (
                                            <FormFeedback type="invalid">{validationConfig.errors['entorno-consecutivo-ventas']}</FormFeedback>
                                          ) : null}
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Comprobante Recibos de Caja</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={comprobanteReciboCaja}
                                            data={dataVouchers}
                                            onChange={(val)=>setComprobanteReciboCaja(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Consecutivo Recibos de Caja</label>
                                      <div className="col-md-12">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="entorno-consecutivo-recibos-caja"
                                            value={validationConfig.values['entorno-consecutivo-recibos-caja'] || ""}
                                            onChange={validationConfig.handleChange}
                                            onBlur={validationConfig.handleBlur}
                                            invalid={
                                              validationConfig.touched['entorno-consecutivo-recibos-caja'] && validationConfig.errors['entorno-consecutivo-recibos-caja'] && !validationConfig.values['entorno-consecutivo-recibos-caja'] ? true : false
                                            }
                                          />
                                          {validationConfig.touched['entorno-consecutivo-recibos-caja'] && validationConfig.errors['entorno-consecutivo-recibos-caja'] && !validationConfig.values['entorno-consecutivo-recibos-caja'] ? (
                                            <FormFeedback type="invalid">{validationConfig.errors['entorno-consecutivo-recibos-caja']}</FormFeedback>
                                          ) : null}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Comprobante Gastos</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={comprobanteGasto}
                                            data={dataVouchers}
                                            onChange={(val)=>setComprobanteGasto(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Consecutivo Gastos</label>
                                      <div className="col-md-12">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="entorno-consecutivo-gastos"
                                            value={validationConfig.values['entorno-consecutivo-gastos'] || ""}
                                            onChange={validationConfig.handleChange}
                                            onBlur={validationConfig.handleBlur}
                                            invalid={
                                              validationConfig.touched['entorno-consecutivo-gastos'] && validationConfig.errors['entorno-consecutivo-gastos'] && !validationConfig.values['entorno-consecutivo-gastos'] ? true : false
                                            }
                                          />
                                          {validationConfig.touched['entorno-consecutivo-gastos'] && validationConfig.errors['entorno-consecutivo-gastos'] && !validationConfig.values['entorno-consecutivo-gastos'] ? (
                                            <FormFeedback type="invalid">{validationConfig.errors['entorno-consecutivo-gastos']}</FormFeedback>
                                          ) : null}
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Comprobante Pagos</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={comprobantePago}
                                            data={dataVouchers}
                                            onChange={(val)=>setComprobantePago(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Consecutivo Pagos</label>
                                      <div className="col-md-12">
                                        <Input
                                            type="text"
                                            className="form-control"
                                            name="entorno-consecutivo-pagos"
                                            value={validationConfig.values['entorno-consecutivo-pagos'] || ""}
                                            onChange={validationConfig.handleChange}
                                            onBlur={validationConfig.handleBlur}
                                            invalid={
                                              validationConfig.touched['entorno-consecutivo-pagos'] && validationConfig.errors['entorno-consecutivo-pagos'] && !validationConfig.values['entorno-consecutivo-pagos'] ? true : false
                                            }
                                          />
                                          {validationConfig.touched['entorno-consecutivo-pagos'] && validationConfig.errors['entorno-consecutivo-pagos'] && !validationConfig.values['entorno-consecutivo-pagos'] ? (
                                            <FormFeedback type="invalid">{validationConfig.errors['entorno-consecutivo-pagos']}</FormFeedback>
                                          ) : null}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Cuenta de Ingreso Recibos de Caja</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={cuentaIngresoRecibosCaja}
                                            data={dataAccountsIngresos}
                                            onChange={(val)=>setCuentaIngresoRecibosCaja(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Cuenta de Ingreso Pasarela de Pagos</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={cuentaIngresoPasarela}
                                            data={dataAccountsIngresos}
                                            onChange={(val)=>setCuentaIngresoPasarela(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Cuenta de Egreso Pagos</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={cuentaEgresoPagos}
                                            data={dataAccountsIngresos}
                                            onChange={(val)=>setCuentaEgresoPagos(val)}
                                          />
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">% Porcentaje Intereses Mora</label>
                                      <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="entorno-porcentaje-intereses-mora"
                                          value={validationConfig.values['entorno-porcentaje-intereses-mora'] || ""}
                                          onChange={validationConfig.handleChange}
                                          onBlur={validationConfig.handleBlur}
                                          invalid={
                                            validationConfig.touched['entorno-porcentaje-intereses-mora'] && validationConfig.errors['entorno-porcentaje-intereses-mora'] && !validationConfig.values['entorno-porcentaje-intereses-mora'] ? true : false
                                          }
                                        />
                                        {validationConfig.touched['entorno-porcentaje-intereses-mora'] && validationConfig.errors['entorno-porcentaje-intereses-mora'] && !validationConfig.values['entorno-porcentaje-intereses-mora'] ? (
                                          <FormFeedback type="invalid">{validationConfig.errors['entorno-porcentaje-intereses-mora']}</FormFeedback>
                                        ) : null}
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row> 
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Día límite de pago sin intereses</label>
                                      <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="entorno-dia-limite-pago-sin-interes"
                                          value={validationConfig.values['entorno-dia-limite-pago-sin-interes'] || ""}
                                          onChange={validationConfig.handleChange}
                                          onBlur={validationConfig.handleBlur}
                                          invalid={
                                            validationConfig.touched['entorno-dia-limite-pago-sin-interes'] && validationConfig.errors['entorno-dia-limite-pago-sin-interes'] && !validationConfig.values['entorno-dia-limite-pago-sin-interes'] ? true : false
                                          }
                                        />
                                        {validationConfig.touched['entorno-dia-limite-pago-sin-interes'] && validationConfig.errors['entorno-dia-limite-pago-sin-interes'] && !validationConfig.values['entorno-dia-limite-pago-sin-interes'] ? (
                                          <FormFeedback type="invalid">{validationConfig.errors['entorno-dia-limite-pago-sin-interes']}</FormFeedback>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Día limite Descuento pronto pago</label>
                                      <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="entorno-dia-limite-descuento-pronto-pago"
                                          value={validationConfig.values['entorno-dia-limite-descuento-pronto-pago'] || ""}
                                          onChange={validationConfig.handleChange}
                                          onBlur={validationConfig.handleBlur}
                                          invalid={
                                            validationConfig.touched['entorno-dia-limite-descuento-pronto-pago'] && validationConfig.errors['entorno-dia-limite-descuento-pronto-pago'] && !validationConfig.values['entorno-dia-limite-descuento-pronto-pago'] ? true : false
                                          }
                                        />
                                        {validationConfig.touched['entorno-dia-limite-descuento-pronto-pago'] && validationConfig.errors['entorno-dia-limite-descuento-pronto-pago'] && !validationConfig.values['entorno-dia-limite-descuento-pronto-pago'] ? (
                                          <FormFeedback type="invalid">{validationConfig.errors['entorno-dia-limite-descuento-pronto-pago']}</FormFeedback>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Porcentaje Descuento pronto pago</label>
                                      <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="entorno-porcentaje-descuento-pronto-pago"
                                          value={validationConfig.values['entorno-porcentaje-descuento-pronto-pago'] || ""}
                                          onChange={validationConfig.handleChange}
                                          onBlur={validationConfig.handleBlur}
                                          invalid={
                                            validationConfig.touched['entorno-porcentaje-descuento-pronto-pago'] && validationConfig.errors['entorno-porcentaje-descuento-pronto-pago'] && !validationConfig.values['entorno-porcentaje-descuento-pronto-pago'] ? true : false
                                          }
                                        />
                                        {validationConfig.touched['entorno-porcentaje-descuento-pronto-pago'] && validationConfig.errors['entorno-porcentaje-descuento-pronto-pago'] && !validationConfig.values['entorno-porcentaje-descuento-pronto-pago'] ? (
                                          <FormFeedback type="invalid">{validationConfig.errors['entorno-porcentaje-descuento-pronto-pago']}</FormFeedback>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Cuenta de Descuento pronto pago</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={cuentaDscto}
                                            data={dataAccountsDscto}
                                            onChange={(val)=>setCuentaDscto(val)}
                                          />
                                      </div>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col md={3}>
                                      <label className="col-md-12 col-form-label">Cuenta de Anticipo Inquilinos</label>
                                      <div className="col-md-12">
                                          <RemoteCombo 
                                            value={cuentaAnticipo}
                                            data={dataAccountsAnticipo}
                                            onChange={(val)=>setCuentaAnticipo(val)}
                                          />
                                      </div>
                                    </Col>
                                  </Row>
                              </CardBody>
                            </Card>)
                          }
                          
                          <br />
                          <br />
                          
                          <Card>
                            <CardBody>
                              <CardTitle className="h5 mb-4">Configuración General Máximo PH</CardTitle>
                              <Row>
                                <Col md={6}>
                                  <div className="form-check form-switch form-switch-lg mb-3">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="entorno-validacion-estricta-area"
                                      defaultChecked={validationConfig.values['entorno-validacion-estricta-area']==1}
                                      onChange={validationConfig.handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizelg">
                                      Activar validación estricta para área, coeficiente y número de unidades
                                    </label>
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <div className="form-check form-switch form-switch-lg mb-3">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="entorno-agrupar-cuenta-cobro"
                                      defaultChecked={validationConfig.values['entorno-agrupar-cuenta-cobro']==1}
                                      onChange={validationConfig.handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizelg">
                                      Agrupar cartera (cuenta de cobro) en un solo valor por persona cada mes
                                    </label>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={6}>
                                  <div className="form-check form-switch form-switch-lg mb-3">
                                    <input
                                      type="checkbox"
                                      className="form-check-input"
                                      name="entorno-editar-valor-admon-inmueble"
                                      defaultChecked={validationConfig.values['entorno-editar-valor-admon-inmueble']==1}
                                      onChange={validationConfig.handleChange}
                                    />
                                    <label className="form-check-label" htmlFor="customSwitchsizelg">
                                      Permitir editar el valor de administración desde la captura de inmuebles
                                    </label>
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Área total M2</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-area-total-m2"
                                        value={validationConfig.values['entorno-area-total-m2'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-area-total-m2'] && validationConfig.errors['entorno-area-total-m2'] && !validationConfig.values['entorno-area-total-m2'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-area-total-m2'] && validationConfig.errors['entorno-area-total-m2'] && !validationConfig.values['entorno-area-total-m2'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-area-total-m2']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                {/*<Col md={3}>
                                  <label className="col-md-12 col-form-label">Número total Unidades</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-numero-total-unidades"
                                        value={validationConfig.values['entorno-numero-total-unidades'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-numero-total-unidades'] && validationConfig.errors['entorno-numero-total-unidades'] && !validationConfig.values['entorno-numero-total-unidades'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-numero-total-unidades'] && validationConfig.errors['entorno-numero-total-unidades'] && !validationConfig.values['entorno-numero-total-unidades'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-numero-total-unidades']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>*/}
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Redondeo valor conceptos causación</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={redondeoConceptos}
                                        data={[
                                          {value: 0, label: 'Sin redondeo'},
                                          {value: 50, label: 'A 50 pesos'},
                                          {value: 100, label: 'A 100 pesos'}
                                        ]}
                                        onChange={(val)=>setRedondeoConceptos(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Valor total presupuesto {new Date().getFullYear()}</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        style={{textAlign: 'right'}}
                                        name="entorno-valor-total-presupuesto-year-actual"
                                        value={validationConfig.values['entorno-valor-total-presupuesto-year-actual'] || ""}
                                        onChange={(e)=>{
                                          let val = Number(e.target.value.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                                          validationConfig.setFieldValue("entorno-valor-total-presupuesto-year-actual", val);
                                        }}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-valor-total-presupuesto-year-actual'] && validationConfig.errors['entorno-valor-total-presupuesto-year-actual'] && !validationConfig.values['entorno-valor-total-presupuesto-year-actual'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-valor-total-presupuesto-year-actual'] && validationConfig.errors['entorno-valor-total-presupuesto-year-actual'] && !validationConfig.values['entorno-valor-total-presupuesto-year-actual'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-valor-total-presupuesto-year-actual']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Período Facturación Cíclica Mensual</label>
                                  <div className="col-md-12">
                                    <Input
                                      type="date"
                                      className="form-control"
                                        name="entorno-periodo-facturacion"
                                        value={validationConfig.values['entorno-periodo-facturacion'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-periodo-facturacion'] && validationConfig.errors['entorno-periodo-facturacion'] && !validationConfig.values['entorno-periodo-facturacion'] ? true : false
                                        }
                                    />
                                    {validationConfig.touched['entorno-periodo-facturacion'] && validationConfig.errors['entorno-periodo-facturacion'] && !validationConfig.values['entorno-periodo-facturacion'] ? (
                                      <FormFeedback type="invalid">{validationConfig.errors['entorno-periodo-facturacion']}</FormFeedback>
                                    ) : null}
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto de Intereses</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={conceptoIntereses}
                                        disabled={dataBillingConcepts.length?false:true}
                                        data={dataBillingConcepts}
                                        onChange={(val)=>setConceptoIntereses(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto Visita</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={conceptoVisita}
                                        data={dataConceptsVisit}
                                        onChange={(val)=>setConceptoVisita(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto de Administración Inmuebles</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={conceptoAdministracion}
                                        data={dataBillingConcepts}
                                        disabled={dataBillingConcepts.length?false:true}
                                        onChange={(val)=>setConceptoAdministracion(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto de Administración Parqueadero</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={conceptoAdministracionParqueadero}
                                        data={dataBillingConcepts}
                                        disabled={dataBillingConcepts.length?false:true}
                                        onChange={(val)=>setConceptoAdministracionParqueadero(val)}
                                      />
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto de Administración Cuarto Útil</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={conceptoAdministracionCuartoUtil}
                                        data={dataBillingConcepts}
                                        disabled={dataBillingConcepts.length?false:true}
                                        onChange={(val)=>setConceptoAdministracionCuartoUtil(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Control Fecha Digitación</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={controlFechaDigitacion}
                                        data={[
                                          {value: 0, label: 'Sin control'},
                                          {value: 1, label: 'Al día'},
                                          {value: 2, label: 'Un mes atrás'}
                                        ]}
                                        onChange={(val)=>setControlFechaDigitacion(val)}
                                      />
                                  </div>
                                </Col>
                                
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Anexar Logo</label>
                                    <div className="col-md-12">
                                      <Dropzone onDrop={imageFile => addLogoCompany(imageFile[0], true)} >
                                        {({ getRootProps, getInputProps }) => (
                                          <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                                            <input {...getInputProps()} />
                                            <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                                            {(companyLogo ? 'Cambiar logo' : 'Seleccionar logo')}
                                          </Button>
                                        )}
                                      </Dropzone>
                                    </div>
                                </Col>
                              </Row>

                              <br />
                              <br />

                              <CardTitle className="h5 mb-4">Configuración General Condominio</CardTitle>
                              <Row>
                                <Col md={4}>
                                  <label className="col-md-12 col-form-label">Razón Social</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-razon-social"
                                        value={validationConfig.values['entorno-razon-social'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-razon-social'] && validationConfig.errors['entorno-razon-social'] && !validationConfig.values['entorno-razon-social'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-razon-social'] && validationConfig.errors['entorno-razon-social'] && !validationConfig.values['entorno-razon-social'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-razon-social']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">NIT</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-nit"
                                        value={validationConfig.values['entorno-nit'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-nit'] && validationConfig.errors['entorno-nit'] && !validationConfig.values['entorno-nit'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-nit'] && validationConfig.errors['entorno-nit'] && !validationConfig.values['entorno-nit'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-nit']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                <Col md={4}>
                                  <label className="col-md-12 col-form-label">Dirección</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-direccion"
                                        value={validationConfig.values['entorno-direccion'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-direccion'] && validationConfig.errors['entorno-direccion'] && !validationConfig.values['entorno-direccion'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-direccion'] && validationConfig.errors['entorno-direccion'] && !validationConfig.values['entorno-direccion'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-direccion']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Teléfono</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-telefono"
                                        value={validationConfig.values['entorno-telefono'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-telefono'] && validationConfig.errors['entorno-telefono'] && !validationConfig.values['entorno-telefono'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-telefono'] && validationConfig.errors['entorno-telefono'] && !validationConfig.values['entorno-telefono'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-telefono']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={4}>
                                  <label className="col-md-12 col-form-label">Correo Electrónico</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-email"
                                        value={validationConfig.values['entorno-email'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-email'] && validationConfig.errors['entorno-email'] && !validationConfig.values['entorno-email'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-email'] && validationConfig.errors['entorno-email'] && !validationConfig.values['entorno-email'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-email']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                                <Col md={8}>
                                  <label className="col-md-12 col-form-label">Texto pie de Cuenta Cobro</label>
                                  <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="entorno-texto-cuenta-cobro"
                                        value={validationConfig.values['entorno-texto-cuenta-cobro'] || ""}
                                        onChange={validationConfig.handleChange}
                                        onBlur={validationConfig.handleBlur}
                                        invalid={
                                          validationConfig.touched['entorno-texto-cuenta-cobro'] && validationConfig.errors['entorno-texto-cuenta-cobro'] && !validationConfig.values['entorno-texto-cuenta-cobro'] ? true : false
                                        }
                                      />
                                      {validationConfig.touched['entorno-texto-cuenta-cobro'] && validationConfig.errors['entorno-texto-cuenta-cobro'] && !validationConfig.values['entorno-texto-cuenta-cobro'] ? (
                                        <FormFeedback type="invalid">{validationConfig.errors['entorno-texto-cuenta-cobro']}</FormFeedback>
                                      ) : null}
                                  </div>
                                </Col>
                              </Row>
                              

                              <br />
                              <br />
                              <br />
                              <Row>
                                <Col md={12} className="text-end">
                                  {
                                    loadingText=="Guardando ..." ?
                                      (
                                        <>
                                          <br />
                                          <Spinner className="ms-12" color="dark" />
                                        </>
                                      )
                                    :
                                      (<>
                                        <Button type="submit" color={(accessModule.ACTUALIZAR==true ? "primary" : "secondary")}>
                                          Actualizar
                                        </Button>
                                      </>)
                                  }
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Form>)
                      :
                        (<Row>
                          <Col xl={12}>
                            <Card>
                              <Row>
                                <Col md={12} style={{textAlign: 'center'}}>
                                  <br />
                                  <span>{loadingText}</span>
                                  
                                  <br />
                                  <br />
                                  <Spinner className="ms-12" color="dark" /> 
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>)
                    }
              </Col>
            </Row>)
          }

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR EL ENTORNO</b></p></Col></Row></Card>)}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(IndexEntorno);

IndexEntorno.propTypes = {
  history: PropTypes.object,
};