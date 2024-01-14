import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Table,
  Container,
  Row,
  CardBody,
  Button,
  Form,
  Input,
  Modal,
  Spinner,
  CardTitle,
  FormFeedback,
  Nav, 
  NavItem, 
  NavLink,
  TabContent,
  TabPane
} from "reactstrap";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";


import Select from "react-select";
import classnames from "classnames";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getBillCashReceipts, getExtractTerceroBillCashReceipts, getAccounts, createBillCashReceipt, editBillCashReceipt, deleteBillCashReceipt, getPersons, getBillCashReceiptPDF, getDataSummaryErp, getBillCashVouchers, editBillCashVoucher } from "../../../store/actions";

//redux
import { useDispatch, useSelector } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexRecibosCaja = props => {

  //meta title
  document.title = "Recibos de Caja | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesReciboCajaForm = {
    'recibo-caja-fecha-recibo': '',
    'recibo-caja-valor-recibo': '',
    'recibo-caja-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [persona, setPersona] = useState(null);
  const [personasErp, setPersonasErp] = useState([]);
  const [facturasPersona, setFacturasPersona] = useState([]);
  const [billCashVouchers, setBillCashVouchers] = useState(null);
  const [modalComprobante, setModalComprobante] = useState(null);
  const [controlFechaDigitacion, setControlFechaDigitacion] = useState(null);
  const [cuentaIngresoRecibosCajaComprobante, setCuentaIngresoRecibosCajaComprobante] = useState();
  const [modalComprobanteValidar, setModalComprobanteValidar] = useState(null);
  
  const [editReciboCajaId, setEditReciboCaja] = useState(false);
  const [confirmEliminarReciboCaja, setConfirmEliminarReciboCaja] = useState(false);
  const [confirmModalCancelReciboCaja, setConfirmModalCancelReciboCaja] = useState(false);
  const [confirmModalEliminarReciboCaja, setConfirmModalEliminarReciboCaja] = useState(false);
  
  const [confirmModalAnticipoReciboCaja, setConfirmModalAnticipoReciboCaja] = useState(false);
  const [confirmatedAnticipoReciboCaja, setConfirmatedAnticipoReciboCaja] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [cuentaAnticipoEntorno, setCuentaAnticipoEntorno] = useState(false);
  
  const [data, setData] = useState([]);
  const [cuentaIngresoRecibosCaja, setCuentaIngresoRecibosCaja] = useState();
  
  const [estadoComprobanteValidacion, setEstadoComprobanteValidacion] = useState(null);
  
  const [enableForm, setEnableForm] = useState(false);

  const { dataAccountsIngresos } = useSelector(state => ({
    dataAccountsIngresos: state.Accounts.accounts.filter(i=>
      i.codigo.toLowerCase().indexOf("1105")>=0||
      i.codigo.toLowerCase().indexOf("1110")>=0||
      i.codigo.toLowerCase().indexOf("1120")>=0||
      i.codigo.toLowerCase().indexOf("13050510")>=0
    ),
  }));

  const deleteReciboCajaModal = (reciboCaja, deleteR)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarReciboCaja(reciboCaja);

      if(deleteR){
        setConfirmModalCancelReciboCaja(false);
        setConfirmModalEliminarReciboCaja(true);
      }else{
        setConfirmModalCancelReciboCaja(true);
        setConfirmModalEliminarReciboCaja(false);
      }
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Recibos de Caja", "Permisos");
    }
  };
  
  const deleteReciboCajaConfirm = ()=>{
    const reciboCajaToDelete = confirmEliminarReciboCaja.id;

    let operRecibo = confirmModalCancelReciboCaja ? 'cancel' : 'delete';
    let textLoading = confirmModalCancelReciboCaja ? 'Anulando recibo de caja...' : 'Elimando recibo de caja...';
    let textSuccess = confirmModalCancelReciboCaja ? 'Recibo de Caja Anulado.' : 'Recibo de Caja Eliminado.';
          
    setLoadingText(textLoading)

    cancelReciboCaja();
    setConfirmEliminarReciboCaja(false);
    setConfirmModalCancelReciboCaja(false);
    setConfirmModalEliminarReciboCaja(false);
    
    dispatch(deleteBillCashReceipt({reciboCajaToDelete, operRecibo}, ()=>{
      cancelReciboCaja();
      loadReciboCaja();
      toastr.success(textSuccess, "Operación Ejecutada");
    }));
  };

  const cancelReciboCaja = ()=>{
    setLoadingText(false);
    setEnableForm(false);
    setConfirmatedAnticipoReciboCaja(false);
    setEditReciboCaja(false);
    validation.handleReset();
    
    loadReciboCaja();
  };

  const openPDF = (reciboCaja)=>{
    if(accessModule.INGRESAR==true){
      setLoadingText("Generando PDF ...");

      dispatch(getBillCashReceiptPDF(null,(url)=>{
        setLoadingText(false);
        const pdfTargetBlank = window.open(url, '_blank');
        pdfTargetBlank.focus();
      }, reciboCaja.id));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a ver Recibos de Caja", "Permisos");
    }
  };

  const loadBillsPerson = (person)=>{
    validation.setFieldValue("recibo-caja-valor-recibo", "");
    validation.setFieldValue("recibo-caja-fecha-recibo", new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'));
    validation.setFieldValue("recibo-caja-observacion", "");
    validation.setFieldValue("recibo-caja-saldo", "");
    validation.setFieldValue("recibo-caja-total-anticipos", "");
    validation.setFieldValue("recibo-caja-descuento-pronto-pago", "");
    validation.setFieldValue("recibo-caja-intereses", "");
    
    setLoadingText('Cargando ...');

    dispatch(getExtractTerceroBillCashReceipts(person.id_tercero_erp, (bills)=>{
      let billsFiltered = bills.data;
      setLoadingText(false);
      setFacturasPersona([]);

      validation.setFieldValue("recibo-caja-saldo", Number(bills.totalPendiente).toLocaleString('es-ES'));
      validation.setFieldValue("recibo-caja-total-anticipos", Number(bills.anticipos).toLocaleString('es-ES'));
      validation.setFieldValue("recibo-caja-valor-recibo", Number(bills.totalPendiente).toLocaleString('es-ES'));
      validation.setFieldValue("recibo-caja-descuento-pronto-pago", Number(bills.totalGlobalDescuento).toLocaleString('es-ES'));
      validation.setFieldValue("recibo-caja-intereses", Number(bills.totalGlobalIntereses).toLocaleString('es-ES'));
      
      if(Number(bills.anticipos)>0){
        dataAccountsIngresos.map((filterAccount)=>{
          if(filterAccount.id==cuentaAnticipoEntorno){
            setCuentaIngresoRecibosCaja(filterAccount);
          }
        });
      }

      if(!billsFiltered.length){
        setFacturasPersona([]);
        toastr.options = { positionClass: 'toast-top-right' };
        toastr.warning("Tercero sin saldos pendientes", "Información Cartera");
      }else{
        setFacturasPersona(billsFiltered);
      }

    }));
  };

  const loadReciboCaja = ()=>{
    setLoadingText('Cargando ...');
    dispatch(getBillCashVouchers((dataBillCashVouchers)=>{
      
      setBillCashVouchers(dataBillCashVouchers.data);

      dispatch(getDataSummaryErp(null, (dataSummaryErp)=>{
        let comboERPBase = false;
        dataSummaryErp.erpBases.map(field=>{
          if(!comboERPBase){
            switch(field.campo){
              case "id_cuenta_ingreso_recibos_caja_erp":
                comboERPBase = {label: field.label, value: field.value};

                setCuentaIngresoRecibosCaja(comboERPBase);
              break;
            }
          }
        });

        JSON.parse(localStorage.getItem("enviromentMaximo")).map(enviromentConfig=>{
          if(enviromentConfig.campo=="id_cuenta_anticipos_erp"&&enviromentConfig.valor!=""&&enviromentConfig.valor!=null){
            setCuentaAnticipoEntorno(enviromentConfig.valor);
          }
        })

        dispatch(getBillCashReceipts(null, (billCashReceipts)=>{ 
          
          let newAccessModule = accessModule;
          billCashReceipts.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));
    
          setAccessModule(newAccessModule);

          dispatch(getPersons(null, (dPersons)=>{ 
            dispatch(getAccounts(null, ()=>{
              dPersons.map(person=>{
                person.label = `${person.numero_documento} - ${person.label} - ${(person.numero_unidades||'')}`;
              });

              setPersonasErp(dPersons);
              
              setPersona(null);
              setFacturasPersona([]);

              billCashReceipts.data.map(bill=>{
                bill.fecha_recibo = bill.fecha_recibo.split("T")[0];
              });

              setData(billCashReceipts.data);
              
              validation.handleReset();
              
              setControlFechaDigitacion(billCashReceipts.controlFechaDigitacion);

              validation.setFieldValue("recibo-caja-consecutivo", billCashReceipts.billCashReceiptNextNumber);
              validation.setFieldValue("recibo-caja-saldo", "");
              validation.setFieldValue("recibo-caja-total-anticipos", "");
              validation.setFieldValue("recibo-caja-descuento-pronto-pago", "");
              validation.setFieldValue("recibo-caja-intereses", "");
              validation.setFieldValue("recibo-caja-fecha-recibo", new Date().toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-'));
              validation.setFieldValue("recibo-caja-valor-recibo", "");
              validation.setFieldValue("recibo-caja-observacion", "");

              setLoadingText('');

              if(props.onLoad) props.onLoad(billCashReceipts);
            },true));
          },true));
        }));
      }));
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesReciboCajaForm,
    validationSchema: Yup.object({
      'recibo-caja-fecha-recibo': Yup.string().required("Por favor ingresa la fecha del recibo")
    }),
    onSubmit: (values) => {
      let reciboCajaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('recibo-caja-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","consecutivo","factura_consecutivo","inmuebleText","zonaText","areaText","personaDocumento","personaText","personaId","estado","estadoText","valor_factura","total_anticipos","saldo"].includes(fieldName)==false){
          reciboCajaValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!persona){
        toastr.error("Seleccione una persona", "Error en la validación");
        return;
      }
      
      if(!cuentaIngresoRecibosCaja){
        toastr.error("Seleccione una cuenta de ingeso", "Error en la validación");
        return;
      }

      let saldo = validation.values['recibo-caja-saldo'].replaceAll(",","").replaceAll(".","");
      let anticipos = Number(validation.values['recibo-caja-total-anticipos'].replaceAll(",","").replaceAll(".",""));

      if(!Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))){
        toastr.error("Digite el valor del abono.", "Error en la validación");
        return;
      }

      if(Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))>Number(saldo)&&(!cuentaAnticipoEntorno||cuentaAnticipoEntorno==cuentaIngresoRecibosCaja.value)){
        toastr.error("El valor del abono es superior al saldo pendiente.", "Error en la validación");
        return;
      }else if(Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))>Number(anticipos)&&(cuentaAnticipoEntorno==cuentaIngresoRecibosCaja.value)){
        toastr.error("El valor del recibo es superior a los anticipos disponibles.", "Error en la validación");
        return;
      }else if(Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))>Number(saldo)&&cuentaAnticipoEntorno&&
      !confirmatedAnticipoReciboCaja){
        setConfirmModalAnticipoReciboCaja(true);
        return;
      }
      
      reciboCajaValues["id_persona"] = persona.id;

      reciboCajaValues["id_tercero_erp"] = persona.id_tercero_erp;
      
      reciboCajaValues["id_cuenta_ingreso_recibos_caja_erp"] = cuentaIngresoRecibosCaja.value;
      
      setLoadingText("Guardando ...");

      if(!editReciboCajaId){
        dispatch(createBillCashReceipt(reciboCajaValues, (response)=>{
          if(response.success){
            cancelReciboCaja();
            loadReciboCaja();
            toastr.success("Nuevo Recibo de Caja.", "Operación Ejecutada");
          }else{
            setLoadingText('Creando Recibo de Caja...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editBillCashReceipt(reciboCajaValues, (response)=>{
          if(response.success){
            cancelReciboCaja();
            loadReciboCaja();
            toastr.success("Recibo de Caja editado.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando Recibo de Caja...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const columns = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: reciboCaja => {
              let classViewBtn = accessModule.INGRESAR==true ? "primary" : "secondary";
              let classCancelBtn = accessModule.ELIMINAR==true ? "warning" : "secondary";
              let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";
  
              if(reciboCaja.estado==1){
                return (<div  style={{textAlign: 'center'}}>
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(reciboCaja)}}> 
                  <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">PDF</span>
                </Button>
                {" "}
                <Button color={classCancelBtn} className="btn-sm" onClick={()=>{deleteReciboCajaModal(reciboCaja, false)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Anular</span>
                </Button>
                {' '}
                <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteReciboCajaModal(reciboCaja, true)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
                </div>);
              }else{
                return (<div style={{textAlign: 'center'}}> 
                  <b>ANULADO</b> 
                  {' '}
                  <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(reciboCaja)}}> 
                    <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">PDF</span>
                  </Button>
                  {" "}
                  <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteReciboCajaModal(reciboCaja, true)}}> 
                      <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Eliminar</span>
                  </Button>
                </div>);
              }
            }
          },
          {
              Header: 'Consecutivo Recibo',
              accessor: 'consecutivo',
          },
          {
              Header: 'Fecha Recibo',
              accessor: 'fecha_recibo',
          },
          {
              Header: 'Documento',
              accessor: 'personaDocumento',
          },
          {
              Header: 'Persona',
              accessor: 'personaText',
          },
          {
              Header: 'Total Recibo',
              HeaderClass: 'text-end',
              accessor: row => (<p className="text-end">$ {(row.valor_recibo).toLocaleString()}</p>)
          },
          {
              Header: 'Observación',
              accessor: 'observacion',
          }
      ],
      []
  );
  
  const initValidateVoucher = (voucher)=>{
    if(accessModule.CREAR==true){
      setLoadingText('Cargando ...');

      dispatch(getExtractTerceroBillCashReceipts(voucher.id_tercero_erp, (bills)=>{
      
        setLoadingText('');

        setModalComprobanteValidar(voucher);
        
        validationComprobante.setFieldValue("recibo-caja-comprobante-saldo", Number(bills.totalPendiente).toLocaleString('es-ES'));
        validationComprobante.setFieldValue("recibo-caja-comprobante-valor-recibo", Number(voucher.valor).toLocaleString('es-ES'));
        validationComprobante.setFieldValue("recibo-caja-comprobante-fecha-recibo", voucher.fecha.split('T')[0]);
        validationComprobante.setFieldValue("recibo-caja-comprobante-persona-documento", voucher.personaDocumento);
        validationComprobante.setFieldValue("recibo-caja-comprobante-persona-nombres", voucher.personaText);
        setEstadoComprobanteValidacion({label:'PENDIENTE', value: '0'});
        /*setConfirmEliminarReciboCaja(reciboCaja);

        if(deleteR){
          setConfirmModalCancelReciboCaja(false);
          setConfirmModalEliminarReciboCaja(true);
        }else{
          setConfirmModalCancelReciboCaja(true);
          setConfirmModalEliminarReciboCaja(false);
        }*/
      }));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a crear Recibos de Caja", "Permisos");
    }
  };

  const validationComprobante = useFormik({
    enableReinitialize: true,
    initialValues: {
      'recibo-caja-comprobante-saldo': '',
      'recibo-caja-comprobante-fecha-recibo': '',
      'recibo-caja-comprobante-valor-recibo': '',
      'recibo-caja-comprobante-observacion-administrador': ''
    },
    onSubmit: (values) => {

      let reciboCajaComprobanteValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('recibo-caja-comprobante-','');
        fieldName = fieldName.replaceAll('-','_');

        reciboCajaComprobanteValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");

        fieldName = '';
        fieldValue = '';
      });
      
      if(!estadoComprobanteValidacion){
        toastr.error("Selecciona un estado para el comprobante", "Error de validación");
        return;
      }
      
      if(Number(estadoComprobanteValidacion.value)>0){
        if(estadoComprobanteValidacion.value==1||estadoComprobanteValidacion.value==3){
          if(Number(reciboCajaComprobanteValues["valor_recibo"])>Number(reciboCajaComprobanteValues["saldo"])){
            toastr.error("El valor del abono el superior al saldo", "Error de validación");
            return;
          }
          
          if(!Number(reciboCajaComprobanteValues["valor_recibo"])){
            toastr.error("Digite el valor del abono", "Error de validación");
            return;
          }
          
          if(reciboCajaComprobanteValues["fecha_recibo"]==''){
            toastr.error("Digite la fecha", "Error de validación");
            return;
          }
        }

        if(estadoComprobanteValidacion.value==1){
          if(!cuentaIngresoRecibosCajaComprobante){
            toastr.error("Seleccione la cuenta de ingreso", "Error de validación");
            return;
          }
        }
        
        if(estadoComprobanteValidacion.value==2||estadoComprobanteValidacion.value==3){
          if(reciboCajaComprobanteValues["observacion_administrador"]==''){
            toastr.error("Digite la observación con el motivo", "Error de validación");
            return;
          }
        }

        reciboCajaComprobanteValues["id"] = modalComprobanteValidar.id;
        reciboCajaComprobanteValues["id_persona"] = modalComprobanteValidar.id_persona;
        reciboCajaComprobanteValues["id_tercero_erp"] = modalComprobanteValidar.id_tercero_erp;
        reciboCajaComprobanteValues["fecha_recibo"] = reciboCajaComprobanteValues["fecha_recibo"].split("T")[0];
        reciboCajaComprobanteValues["intereses"] = 0;
        reciboCajaComprobanteValues["descuento_pronto_pago"] = 0;
        reciboCajaComprobanteValues["estado"] = estadoComprobanteValidacion.value;
        reciboCajaComprobanteValues["observacion"] = "VALIDACIÓN COMPROBANTE # "+modalComprobanteValidar.id;
        reciboCajaComprobanteValues["id_cuenta_ingreso_recibos_caja_erp"] = cuentaIngresoRecibosCajaComprobante?.value;
        
        setLoadingText("Guardando ...");
        
        setModalComprobanteValidar(false);
        setCuentaIngresoRecibosCajaComprobante(null);
        setEstadoComprobanteValidacion({ label: "PENDIENTE", value: "0" });
        validationComprobante.handleReset();

        dispatch(editBillCashVoucher(reciboCajaComprobanteValues, (response)=>{
          
          setLoadingText("");

          if(response.success){
            loadReciboCaja();
            toastr.success("Comprobante validado.", "Operación Ejecutada");
          }
        }));
      }else{
        toastr.error("Selecciona un estado para el comprobante", "Error de validación");
      }

    }
  });

  const columnsComprobantes = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            let classViewBtn = accessModule.CREAR==true ? "primary" : "secondary";
            let actions = '';

            switch(row.estado){
              case 0:
                actions = (<p className="text-center">
                  <Button color={'info'} className="btn-sm" onClick={()=>{setModalComprobante(row)}}> 
                      <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver</span>
                  </Button>
                  {' '}
                  <Button color={classViewBtn} className="btn-sm" onClick={()=>{initValidateVoucher(row)}}> 
                      <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Validar</span>
                  </Button>
                </p>);
              break;
              case 1:
                actions = (<p className="text-center">
                  <Button color={'info'} className="btn-sm" onClick={()=>{setModalComprobante(row)}}> 
                      <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver</span>
                  </Button>
                  {' '}
                  <Button color={'primary'} className="btn-sm" onClick={()=>{openPDF({id: row.id_recibo_caja})}}> 
                      <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver Recibo</span>
                  </Button>
                </p>);
              break;
              default:
                actions = (<p className="text-center">
                  <Button color={'info'} className="btn-sm" onClick={()=>{setModalComprobante(row)}}> 
                      <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver</span>
                  </Button>
                </p>);
              break;
            }
            
            return actions;
          }
        },
        {
            Header: '# Comprobante',
            accessor: row => (<p className="text-center">{row.id}</p>)
        },
        {
            Header: 'Documento',
            accessor: 'personaDocumento',
        },
        {
            Header: 'Persona',
            accessor: 'personaText'
        },
        {
            Header: 'Fecha Comprobante',
            accessor: row => (<p className="text-center">{row.fecha.split("T")[0]}</p>)
        },
        {
            Header: 'Valor Comprobante',
            accessor: row => (<p className="text-end">$ {Number(row.valor).toLocaleString('es-Es')}</p>)

        },
        {
            Header: 'Estado',
            accessor: row => {
              let estado = 'PENDIENTE VALIDACIÓN';

              switch(row.estado){
                case 1: estado='ACEPTADO'; break;
                case 2: estado='RECHAZADO'; break;
                case 3: estado='PREVIAMENTE REGISTRADO'; break;
              }
              
              return (<p className="text-center">{estado}</p>);
            }
        },
        {
            Header: 'Fecha Envio',
            accessor: row => (<p className="text-center">{row.created_at}</p>)
        },
        {
            Header: 'Observación',
            accessor: 'observacion_administrador'
        }
    ],
    []
  );
  
  const [activeTab, setactiveTab] = useState("1");
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  useEffect(()=>{
    loadReciboCaja();
  },[]);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Recibos de Caja" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editReciboCajaId===false ? 'Nuevo Recibo de Caja' : 'Editando Recibo de Caja'}</CardTitle>
                    
                    <Row>
                      <Col sm="12">
                      {/*FORM GENERAL*/}
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              
                              validation.submitForm();

                              return false;
                            }}>
                              <Row>
                                  <Col md={3}>
                                      <label className="col-md-12 col-form-label">Consecutivo *</label>
                                      <div className="col-md-12">
                                        <Input
                                          type="numeric"
                                          className="form-control"
                                          name="recibo-caja-consecutivo"
                                          disabled={true}
                                          value={validation.values['recibo-caja-consecutivo'] || ""}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['recibo-caja-consecutivo'] && validation.errors['recibo-caja-consecutivo'] && !validation.values['recibo-caja-consecutivo'] ? true : false
                                          }
                                        />
                                        {validation.touched['recibo-caja-consecutivo'] && validation.errors['recibo-caja-consecutivo'] && !validation.values['recibo-caja-consecutivo'] ? (
                                          <FormFeedback type="invalid">{validation.errors['recibo-caja-consecutivo']}</FormFeedback>
                                        ) : null}
                                      </div>
                                  </Col>
                                  <Col md={5}>
                                      <label className="col-md-12 col-form-label">Cliente *</label>
                                      <div className="col-md-12">
                                        <RemoteCombo 
                                          value={persona}
                                          data={personasErp}
                                          onChange={async (val)=>{
                                            setFacturasPersona([]);
                                            
                                            await loadBillsPerson(val);

                                            setPersona(val);
                                          }}
                                        />
                                      </div>
                                  </Col>
                                  <Col md={2}>
                                      <label className="col-md-12 col-form-label">Fecha Recibo*</label>
                                      <div className="col-md-12">
                                        <Input
                                            type="date"
                                            className="form-control"
                                            name="recibo-caja-fecha-recibo"
                                            value={validation.values['recibo-caja-fecha-recibo'] || ""}
                                            onChange={(e)=>{
                                              if(controlFechaDigitacion==0&&new Date(e.target.value)<=new Date()){
                                                validation.handleChange(e);
                                              }else if(controlFechaDigitacion==1&&new Date(e.target.value)==new Date()){
                                                validation.handleChange(e);
                                              }else if(controlFechaDigitacion==2&&new Date(e.target.value)<=new Date()){
                                                var fechaLimite = new Date();
                                                fechaLimite.setDate(new Date().getDate() - 30);
                                                if(new Date(e.target.value)>fechaLimite){
                                                  validation.handleChange(e);
                                                }
                                              }
                                            }}
                                            onBlur={validation.handleBlur}
                                            invalid={
                                              validation.touched['recibo-caja-fecha-recibo'] && validation.errors['recibo-caja-fecha-recibo'] && !validation.values['recibo-caja-fecha-recibo'] ? true : false
                                            }
                                          />
                                          {validation.touched['recibo-caja-fecha-recibo'] && validation.errors['recibo-caja-fecha-recibo'] && !validation.values['recibo-caja-fecha-recibo'] ? (
                                            <FormFeedback type="invalid">{validation.errors['recibo-caja-fecha-recibo']}</FormFeedback>
                                          ) : null}
                                      </div>
                                  </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Descuento pronto pago*</label>
                                  <div className="col-md-12">
                                      <input
                                          type="text"
                                          readOnly={true}
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          value={validation.values['recibo-caja-descuento-pronto-pago'] || ""}
                                      />
                                  </div>
                                </Col>
                                {/*<Col md={2}>
                                  <label className="col-md-12 col-form-label">Intereses pago extemporáneo*</label>
                                  <div className="col-md-12">
                                      <input
                                          type="text"
                                          readOnly={true}
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          value={validation.values['recibo-caja-intereses'] || ""}
                                      />
                                  </div>
                                </Col>*/}
                              </Row>
                              <Row>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Total Saldo*</label>
                                  <div className="col-md-12">
                                      <input
                                          type="text"
                                          readOnly={true}
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          value={validation.values['recibo-caja-saldo'] || ""}
                                      />
                                  </div>
                                </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Total Anticipos*</label>
                                  <div className="col-md-12">
                                      <input
                                          type="text"
                                          readOnly={true}
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          value={validation.values['recibo-caja-total-anticipos'] || ""}
                                      />
                                  </div>
                                </Col>
                                <Col md={2}>
                                    <label className="col-md-12 col-form-label">Valor Abono*</label>
                                    <div className="col-md-12">
                                      <Input
                                          type="numeric"
                                          className="form-control"
                                          name="recibo-caja-valor-recibo"
                                          value={validation.values['recibo-caja-valor-recibo'] || ""}
                                          onChange={(e)=>{
                                            let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                                            validation.setFieldValue("recibo-caja-valor-recibo", val);
                                          }}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['recibo-caja-valor-recibo'] && validation.errors['recibo-caja-valor-recibo'] && !validation.values['recibo-caja-valor-recibo'] ? true : false
                                          }
                                        />
                                        {validation.touched['recibo-caja-valor-recibo'] && validation.errors['recibo-caja-valor-recibo'] && !validation.values['recibo-caja-valor-recibo'] ? (
                                          <FormFeedback type="invalid">{validation.errors['recibo-caja-valor-recibo']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={3}>
                                  <label className="col-md-12 col-form-label">Cuenta de Ingreso Recibos de Caja *</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={cuentaIngresoRecibosCaja}
                                        data={dataAccountsIngresos}
                                        disabled={!dataAccountsIngresos.length}
                                        onChange={(val)=>setCuentaIngresoRecibosCaja(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Observación</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="recibo-caja-observacion"
                                        value={validation.values['recibo-caja-observacion'] || ""}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched['recibo-caja-observacion'] && validation.errors['recibo-caja-observacion'] && !validation.values['recibo-caja-observacion'] ? true : false
                                        }
                                      />
                                    </div>
                                </Col>
                              </Row>
                              <br />
                              <Row>
                                <Col md={12}>
                                  <div className="table-responsive">
                                    <Table className="table mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th># Cuenta de Cobro</th>
                                          <th>Documento Referencia</th>
                                          <th>Fecha</th>
                                          <th>Concepto</th>
                                          <th style={{textAlign: 'right'}}>Valor Cuenta Cobro</th>
                                          <th style={{textAlign: 'right'}}>Valor Abonos</th>
                                          <th style={{textAlign: 'right'}}>Valor Descuento</th>
                                          <th style={{textAlign: 'right'}}>Saldo Final</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {!facturasPersona&&(<tr><td colSpan={5}><Row>
                                            <Col md={12} style={{textAlign: 'center'}}>
                                              <br />
                                              <Spinner className="ms-12" color="dark" />
                                            </Col>
                                          </Row></td></tr>)}
                                        {facturasPersona&&facturasPersona.map((bill, pos)=>{
                                          return (<tr key={pos}>
                                            <th scope="row">{bill.factura}</th>
                                            <td>{bill.docRef}</td>
                                            <td>{bill.fecha}</td>
                                            <td>{bill.cuenta_nombre}</td>
                                            <td style={{textAlign: 'right'}}>{bill.totalFactura}</td>
                                            <td style={{textAlign: 'right'}}>{bill.totalAbonos}</td>
                                            <td style={{textAlign: 'right'}}>{bill.totalDescuento}</td>
                                            <td style={{textAlign: 'right'}}>{bill.totalPendiente}</td>
                                          </tr>)
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                </Col>
                              </Row>
                              <br />
                              <Row>
                                <Col md={10}>
                                </Col>
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
                                        <Button type="reset" color="warning" onClick={cancelReciboCaja} >
                                          Cancelar
                                        </Button>
                                        {" "}
                                        <Button type="submit" color="primary">
                                          Grabar
                                        </Button>
                                      </>)
                                  }
                                </Col>
                              </Row>
                          </Form>
                      {/*FORM GENERAL*/}
                      </Col>
                    </Row>

                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR RECIBOS DE CAJA</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR RECIBOS DE CAJA</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(<Card>
              <Row>
                <Col xl={3}>
                  <p className="text-center">
                    <br />
                    <Button onClick={()=>setEnableForm(true)} color="primary">
                      Nuevo recibo de caja
                    </Button>
                    <br />
                  </p>
                </Col>
              </Row>
            </Card>)}

          {
            accessModule.INGRESAR==true && !loadingText && enableForm==false ?
            (<>
              {/*TABS*/}
              <Nav pills className="navtab-bg nav-justified">
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "1",
                    })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    Recibos de Caja
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    style={{ cursor: "pointer" }}
                    className={classnames({
                      active: activeTab === "2",
                    })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Comprobantes de Pago
                  </NavLink>
                </NavItem>
              </Nav>
              {/*TABS*/}

              {/*CONTAINER TABS*/}
              <TabContent activeTab={activeTab} className="p-3 text-muted tab-panel-container-custom">
                <TabPane tabId="1">
                  <Row>
                    <Col sm="12">
                      <br />
                      <TableContainer
                        columns={columns}
                        data={data}
                        isGlobalFilter={true}
                        isAddOptions={false}
                        customPageSize={10}
                        customPageSizeOptions={true}
                        className="custom-header-css"
                      />
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tabId="2">
                  <Row>
                    <Col sm="12">
                      <br />
                      <TableContainer
                          columns={columnsComprobantes}
                          data={billCashVouchers}
                          isGlobalFilter={true}
                          isAddOptions={false}
                          customPageSize={10}
                          customPageSizeOptions={true}
                          className="custom-header-css"
                      />
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </>)
          :
          (loadingText!="hidden" && loadingText!="" && (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      ["Generando PDF ...","Cargando ...","Guardando ...","Anulando Recibo de Caja..."].indexOf(loadingText)>=0?
                      (
                        <>
                          <br />
                          <br />
                          <span>{loadingText}</span>
                          <br />
                          <br />
                          <Spinner className="ms-12" color="dark" />
                          <br />
                          <br />
                        </>
                      )
                      :
                      (<></>)
                    }
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>))
          }
        </Container>
      </div>

      {/*MODAL GUARDAR ANTICIPO*/}
      <Modal
        isOpen={confirmModalAnticipoReciboCaja}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmModalAnticipoReciboCaja(false);
              setConfirmatedAnticipoReciboCaja(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas grabar un <u><b>ANTICIPO</b></u> por valor de <u><b>$ {(Number(validation.values['recibo-caja-valor-recibo']?.replaceAll(".",""))-Number(validation.values['recibo-caja-saldo']?.replaceAll(".",""))).toLocaleString('es-ES')}</b></u> en el Recibo de Caja?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
              setConfirmModalAnticipoReciboCaja(false);
              setConfirmatedAnticipoReciboCaja(true);
              validation.submitForm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
              setConfirmModalAnticipoReciboCaja(false);
              setConfirmatedAnticipoReciboCaja(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL GUARDAR ANTICIPO*/}
      
      {/*MODAL DELETE RECIBO CAJA*/}
      <Modal
        isOpen={confirmModalEliminarReciboCaja}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarReciboCaja(false);
              setConfirmModalEliminarReciboCaja(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ELIMINAR</b></u> el Recibo de Caja <b>{(confirmEliminarReciboCaja!==false ? confirmEliminarReciboCaja.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteReciboCajaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarReciboCaja(false);
            setConfirmModalEliminarReciboCaja(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE RECIBO CAJA*/}


      {/*MODAL ANULAR RECIBO CAJA*/}
      <Modal
        isOpen={confirmModalCancelReciboCaja}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarReciboCaja(false);
              setConfirmModalCancelReciboCaja(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ANULAR</b></u> el Recibo de Caja <b>{(confirmEliminarReciboCaja!==false ? confirmEliminarReciboCaja.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteReciboCajaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarReciboCaja(false);
            setConfirmModalCancelReciboCaja(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ANULAR RECIBO CAJA*/}

      {/*MODAL VER COMPROBANTE*/}
      <Modal
        isOpen={(modalComprobante?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">COMPROBANTE DE PAGO #{modalComprobante?.id}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalComprobante(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p className="text-center">
            <img
              data-dz-thumbnail=""
              className="avatar-xxl rounded bg-light"
              alt={modalComprobante?.imagen}
              src={(process.env.REACT_API_URL||'http://24.144.93.62:3002')+"/uploads/vouchers-Bill-cash-receipts/"+modalComprobante?.imagen}
            />
          </p>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalComprobante(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER COMPROBANTE*/}

      {/*MODAL VALIDAR COMPROBANTE*/}
      <Modal
        isOpen={(modalComprobanteValidar?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">COMPROBANTE DE PAGO #{modalComprobanteValidar?.id}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalComprobanteValidar(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form onSubmit={(e) => { e.preventDefault(); validationComprobante.submitForm(); return false; }}>
            <Row>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Documento</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    readOnly={true}
                    className="form-control"
                    value={validationComprobante.values['recibo-caja-comprobante-persona-documento'] || ""}
                  />
                </div>
              </Col>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Persona</label>
                <div className="col-md-12">
                  <input
                    type="text"
                    readOnly={true}
                    className="form-control"
                    value={validationComprobante.values['recibo-caja-comprobante-persona-nombres'] || ""}
                  />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Total Saldo Actual</label>
                <div className="col-md-12">
                    <input
                      type="text"
                      readOnly={true}
                      className="form-control"
                      value={validationComprobante.values['recibo-caja-comprobante-saldo'] || ""}
                      onBlur={validationComprobante.handleBlur}
                      invalid={
                        validationComprobante.touched['recibo-caja-comprobante-saldo'] && validationComprobante.errors['recibo-caja-comprobante-saldo'] && !validationComprobante.values['recibo-caja-comprobante-saldo'] ? true : false
                      }
                    />
                </div>
              </Col>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Fecha Comprobante Pago</label>
                <div className="col-md-12">
                    <input
                      type="date"
                      readOnly={true}
                      className="form-control"
                      value={validationComprobante.values['recibo-caja-comprobante-fecha-recibo'] || ""}
                      onBlur={validationComprobante.handleBlur}
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={3}>
                <label className="col-md-12 col-form-label">Estado *</label>
                <div className="col-md-12">
                  <Select
                      value={estadoComprobanteValidacion}
                      onChange={value=>{
                        setEstadoComprobanteValidacion(value);
                        if(value.value!=1) setCuentaIngresoRecibosCajaComprobante(null);
                      }}
                      options={[
                        { label: "PENDIENTE", value: "0" },
                        { label: "ACEPTADO", value: "1" },
                        { label: "RECHAZADO", value: "2" },
                        { label: "PREVIAMENTE REGISTRADO", value: "3" }
                      ]}
                      className="select2-selection"
                  />
                </div>
              </Col>
              <Col md={3}>
                <label className="col-md-12 col-form-label">Valor Comprobante</label>
                <div className="col-md-12">
                  <Input
                      type="numeric"
                      readOnly={true}
                      className="form-control"
                      name="recibo-caja-comprobante-valor-recibo"
                      value={validationComprobante.values['recibo-caja-comprobante-valor-recibo'] || ""}
                      onChange={(e)=>{
                        let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                        validationComprobante.setFieldValue("recibo-caja-comprobante-valor-recibo", val);
                      }}
                      onBlur={validationComprobante.handleBlur}
                    />
                </div>
              </Col>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Cuenta de Ingreso Recibos de Caja</label>
                <div className="col-md-12">
                    <RemoteCombo 
                      disabled={(estadoComprobanteValidacion?.value==1?false:true)}
                      value={cuentaIngresoRecibosCajaComprobante}
                      data={dataAccountsIngresos}
                      onChange={(val)=>setCuentaIngresoRecibosCajaComprobante(val)}
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <label className="col-md-12 col-form-label">Observación</label>
                <div className="col-md-12">
                    <input
                      type="text"
                      className="form-control"
                      name="recibo-caja-comprobante-observacion-administrador"
                      onChange={validationComprobante.handleChange}
                      value={validationComprobante.values['recibo-caja-comprobante-observacion-administrador'] || ""}
                      onBlur={validationComprobante.handleBlur}
                    />
                </div>
              </Col>
            </Row>
          </Form>
          <br />
          <br />
          <p className="text-center">
            <img
              data-dz-thumbnail=""
              className="avatar-xxl rounded bg-light"
              alt={modalComprobanteValidar?.imagen}
              src={(process.env.REACT_API_URL||'http://24.144.93.62:3002')+"/uploads/vouchers-Bill-cash-receipts/"+modalComprobanteValidar?.imagen}
            />
          </p>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            validationComprobante.submitForm();
          }}>GRABAR</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setModalComprobanteValidar(false);
            setCuentaIngresoRecibosCajaComprobante(null);
            setEstadoComprobanteValidacion({ label: "PENDIENTE", value: "0" });
            validationComprobante.handleReset();
          }}>CANCELAR</button>
        </div>
      </Modal>
      {/*MODAL VALIDAR COMPROBANTE*/}

    </React.Fragment>
  );
};

export default withRouter(IndexRecibosCaja);

IndexRecibosCaja.propTypes = {
  history: PropTypes.object,
};