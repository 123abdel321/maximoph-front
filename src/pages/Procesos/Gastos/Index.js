import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
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
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";


//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// actions
import { getSpents, createSpent, editSpent, deleteSpent, getSpentConcepts, getPersons, getCostsCenter, getSpentPDF, getAccounts } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexGastos = props => {

  //meta title
  document.title = "Gastos | Maximo PH";

  const dispatch = useDispatch();
  
  const inputRefValue = useRef(null);

  const { loading, loadingGrid, dataSpents, spentNextNumber, controlFechaDigitacion, dataSpentConcepts, dataCostsCenter, dataAccountsEgresosXPagar } = useSelector(state => ({
    loading: state.Spents.loading,
    dataSpents: state.Spents.spents,
    spentNextNumber: state.Spents.spentNextNumber,
    controlFechaDigitacion: state.Spents.controlFechaDigitacion,
    dataCostsCenter: state.CostsCenter.costsCenter,
    dataSpentConcepts: state.SpentConcepts.spentConcepts,
    loadingGrid: state.Spents.loadingGrid,
    dataAccountsEgresosXPagar: state.Accounts.accounts.filter(i=>
      i.codigo.toLowerCase().indexOf("1105")>=0||
      i.codigo.toLowerCase().indexOf("1110")>=0||
      i.codigo.toLowerCase().indexOf("1120")>=0||
      i.codigo.toLowerCase().indexOf("2205")>=0
    ),
  }));
  
  const date = new Date();
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const formattedDate = `${year}-${month}-${day}`;
  
  let initialValuesGastoForm = {
    'gasto-consecutivo': spentNextNumber,
    'gasto-numero-factura-proveedor': '',
    'gasto-id-persona-proveedor': '',
    'gasto-fecha-documento': formattedDate,
    'gasto-porcentaje-retencion': '0',
    'gasto-valor-total-retencion': '0',
    'gasto-valor-total-iva': '',
    'gasto-valor': '',
    'gasto-valor-total': '',
    'gasto-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [personasErp, setPersonasErp] = useState([]);
  const [proveedor, setProveedor] = useState(null);
  const [centroCostos, setCentroCostos] = useState([]);

  const [editGastoId, setEditGasto] = useState(false);
  const [confirmEliminarGasto, setConfirmEliminarGasto] = useState(false);
  const [confirmModalCancelGasto, setConfirmModalCancelGasto] = useState(false);
  const [confirmModalEliminarGasto, setConfirmModalEliminarGasto] = useState(false);
  const [cuentaxPagarEgresoGasto, setCuentaxPagarEgresoGasto] = useState();
  
  const [dataConceptosGasto, setDataConceptosGasto] = useState([]);
  
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editGastoFn = (gasto)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editGastoObj = {};
      
      Object.entries(gasto).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `gasto-${fieldName}`;
        
        if(["gasto-valor-total-iva","gasto-valor-total-retencion","gasto-valor-total"].indexOf(fieldName)>=0){
          editGastoObj[fieldName] = Number(fieldValue).toLocaleString('es-ES');
        }else{
          editGastoObj[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      editGastoObj["gasto-valor"] = (Number(gasto.valor_total)+Number(gasto.valor_total_retencion||0)).toLocaleString('es-ES');

      setProveedor({label: gasto.proveedorText, value: gasto.id_persona_proveedor});
      
      let coneptoDetalle = gasto.detalles[0];
      
      setConcepto({label: `${coneptoDetalle.id_concepto_gasto} - ${coneptoDetalle.conceptoText} - ${coneptoDetalle.porcentaje_iva} %`, value: coneptoDetalle.id_concepto_gasto, iva: Number(coneptoDetalle.porcentaje_iva), id: coneptoDetalle.id_concepto_gasto });
      setCentroCostos({label: coneptoDetalle.centroCostosText, value: coneptoDetalle.id_centro_costos_erp, id: coneptoDetalle.id_centro_costos_erp  });

      /*gasto.detalles.forEach((detalle, detPos) => {
        gasto.detalles[detPos].id = (detPos+1);
        gasto.detalles[detPos].iva = detalle.porcentaje_iva;
        gasto.detalles[detPos].valor_iva = detalle.valor_total_iva;
        gasto.detalles[detPos].operaciones = (<div className={"text-center"}>
          <Button color="primary" className="btn-sm" onClick={()=>{ editConceptoGasto((detPos+1), gasto.detalles) }}> Editar </Button>
          {' '}
          <Button className="btn btn-danger btn-sm" onClick={()=>{ deleteConceptoModal(detPos) }}> Eliminar </Button>
        </div>);
      });*/

      const dataDetailSpent = gasto.detalles;

      setDataConceptosGasto(dataDetailSpent);

      setEditGasto(Number(gasto.id));
      setEnableForm(true);
      setLoadingText('hidden');
      
      validation.setValues(editGastoObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Gastos", "Permisos");
    }
  };

  const deleteGastoModal = (gasto, deleteG)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarGasto(gasto);

      if(deleteG){
        setConfirmModalCancelGasto(false);
        setConfirmModalEliminarGasto(true);
      }else{
        setConfirmModalCancelGasto(true);
        setConfirmModalEliminarGasto(false);
      }
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Gastos", "Permisos");
    }
  };
  
  const deleteGastoConfirm = ()=>{
    const spentToDelete = confirmEliminarGasto.id;
    
    let operSpent = confirmModalCancelGasto ? 'cancel' : 'delete';
    let textLoading = confirmModalCancelGasto ? 'Anulando gasto...' : 'Eliminando gasto...';
    let textSuccess = confirmModalCancelGasto ? 'Gasto Anulado.' : 'Gasto Eliminado.';

    setLoadingText(textLoading);

    cancelGasto();
    setConfirmEliminarGasto(false);
    setConfirmModalCancelGasto(false);
    setConfirmModalEliminarGasto(false);

    dispatch(deleteSpent({spentToDelete, operSpent}, ()=>{
      loadGastos();
      toastr.success(textSuccess, "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesGastoForm,
    validationSchema: Yup.object({
      'gasto-consecutivo': Yup.string().required("Por favor ingresa el consecutivo"),
      'gasto-numero-factura-proveedor': Yup.string().required("Por favor ingresa el número de la factura"),
      'gasto-fecha-documento': Yup.date().required("Por favor ingresa la fecha")
    }),
    onSubmit: (values) => {
      
      let gastoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('gasto-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","detalles","proveedorText","valor_total_iva","valor","valor_total","anulado"].includes(fieldName)==false){
          gastoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!proveedor){
        toastr.error("Seleccione un proveedor", "Error en la validación");
        return;
      }
      
      if(!concepto){
        toastr.error("Seleccione un concepto", "Error en la validación");
        return;
      }

      if(!centroCostos){
        toastr.error("Seleccione un centro de costos", "Error en la validación");
        return;
      }
      
      gastoValues["id_persona_proveedor"] = proveedor.value;
      
      gastoValues["id_cuenta_x_pagar_egreso_gasto_erp"] = cuentaxPagarEgresoGasto?.value;

      setLoadingText("Guardando ...");

      let valorTotalIVA = Number(values["gasto-valor-total-iva"].toString().replaceAll(".","").replaceAll(",",""));
      let valorTotal = Number(values["gasto-valor"].toString().replaceAll(".","").replaceAll(",",""));

      let dataConceptosGastoDetail = [{
        id_concepto_gasto: concepto.value,
        id_centro_costos_erp: centroCostos.value,
        porcentaje_iva: concepto.iva,
        valor_total_iva: valorTotalIVA,
        total: valorTotal,
        descripcion: ''
      }];

      /*dataConceptosGasto.forEach((conceptoG)=>{
        dataConceptosGastoDetail.push({
          id_concepto_gasto: conceptoG.id_concepto_gasto,
          id_centro_costos_erp: conceptoG.id_centro_costos_erp,
          porcentaje_iva: conceptoG.iva.replaceAll(" %",""),
          valor_total_iva: conceptoG.valor_iva.toString().replaceAll(".","").replaceAll(",",""),
          total: conceptoG.total.toString().replaceAll(".","").replaceAll(",",""),
          descripcion: conceptoG.descripcion
        });
      });*/

      gastoValues["detalle"] = JSON.stringify(dataConceptosGastoDetail);
      
      if(!editGastoId){
        dispatch(createSpent(gastoValues, (response)=>{
          if(response.success){
            cancelGasto();
            loadGastos();
            toastr.success("Nuevo gasto registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El gasto ya está registrado.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editSpent(gastoValues, (response)=>{
          if(response.success){
            cancelGasto();
            loadGastos();
            toastr.success("Gasto editado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El gasto ya está registrado.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelGasto = async ()=>{
    await loadGastos();
    setConcepto(null);
    setCentroCostos(null);
    setProveedor(null);
    setEditGasto(false);
    setLoadingText(false);
    setEnableForm(false);
    setCuentaxPagarEgresoGasto(false);
    validation.handleReset();
    setDataConceptosGasto([]);
  };
  
  const columnsGastos = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: gasto => {
            let classViewBtn = accessModule.INGRESAR==true ? "primary" : "secondary";
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classCancelBtn = accessModule.ELIMINAR==true ? "warning" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

            if(!gasto.anulado){
              return (<div  style={{textAlign: 'center'}}>
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(gasto)}}> 
                  <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">PDF</span>
                </Button>
                {" "}
                <Button color={classEditBtn} className="btn-sm" onClick={()=>{editGastoFn(gasto)}}>
                    <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Editar</span>
                </Button>
                {' '}
                <Button color={classCancelBtn} className="btn-sm" onClick={()=>{deleteGastoModal(gasto, false)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Anular</span>
                </Button>
                {' '}
                <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteGastoModal(gasto, true)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
              </div>);
            }else{
              return (<div style={{textAlign: 'center'}}> 
                <b>ANULADO</b> 
                {' '}
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(gasto)}}> 
                  <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">PDF</span>
                </Button>
                {" "}
                <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteGastoModal(gasto, true)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
              </div>);
            }
          }
        },
        {
            Header: 'Documento Proveedor',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.proveedorDocumento}</p>)
        },
        {
            Header: 'Proveedor',
            accessor: 'proveedorText',
        },
        {
            Header: 'Consecutivo',
            accessor: 'consecutivo',
        },
        {
            Header: 'Número Factura',
            accessor: 'numero_factura_proveedor',
        },
        {
            Header: 'Fecha',
            accessor: 'fecha_documento',
        },
        {
            Header: 'Valor IVA',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.valor_total_iva).toLocaleString()}</p>)
        },
        {
            Header: 'Valor Rete Fuente',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.valor_total_retencion).toLocaleString()}</p>)
        },
        {
            Header: 'Total Gasto',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.valor_total).toLocaleString()}</p>)
        }
    ],
    []
  );

  const openPDF = (gasto)=>{
    if(accessModule.INGRESAR==true){
      setLoadingText("Generando PDF ...");

      dispatch(getSpentPDF(null,(url)=>{
        setLoadingText(false);
        const pdfTargetBlank = window.open(url, '_blank');
        pdfTargetBlank.focus();
      }, gasto.id));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a visualizar gastos", "Permisos");
    }
  };

  const loadGastos = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getSpents(null, (resp)=>{ 

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getPersons(null, (dPersons)=>{ 
        
        dispatch(getAccounts(null, ()=>{
          dispatch(getCostsCenter(null, ()=>{

            
            dPersons.map(person=>{
              person.label = `${person.numero_documento} - ${person.label}`;
            });

            setPersonasErp(dPersons);

            dispatch(getSpentConcepts(null, ()=>{
              setLoadingText('');
            }));
          }));
        }));
      },true));
    }));
  };

  useEffect(()=>{
    loadGastos();
  },[]);
  
  const [loadingTextConcepto, setLoadingTextConcepto] = useState();
  const [concepto, setConcepto] = useState(null);
  const [registerNuevoConceptoGasto, setRegisterNuevoConceptoGasto] = useState(false);
  const [editConceptoGastoId, setEditConceptoGasto] = useState(false);

  const [confirmEliminarConcepto, setConfirmEliminarConcepto] = useState(false);
  const [confirmModalEliminarConcepto, setConfirmModalEliminarConcepto] = useState(false);

  const deleteConceptoModal = (concepto)=>{
    setConfirmEliminarConcepto(concepto);
    setConfirmModalEliminarConcepto(true);
  };

  let initialValuesGastoConceptoForm = {
    'concepto-total': '0',
    'concepto-descripcion': ''
  };

  const editConceptoGasto = (concepto, details)=>{
    let fieldName = '';
    let fieldValue = '';
    let editConceptoGastoObj = {};

    let detailSpent = dataConceptosGasto.length ? dataConceptosGasto : details;
    let toEditConcepto = detailSpent.findIndex((conceptoIterate)=>{
      return conceptoIterate?.id === concepto;
    });
    concepto = detailSpent[toEditConcepto];

    Object.entries(concepto).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');
      fieldName = `concepto-${fieldName}`;
      
      if(fieldName=="concepto-total"){
        editConceptoGastoObj[fieldName] = Number(fieldValue).toLocaleString('es-ES');
      }else{
        editConceptoGastoObj[fieldName] = fieldValue;
      }

      fieldName = '';
      fieldValue = '';
    });

    setConcepto({label: concepto.conceptoText, value: concepto.id_concepto_gasto, iva: Number(concepto.iva.replaceAll("%","")), id: concepto.id_concepto_gasto });
    setCentroCostos({label: concepto.centroCostosText, value: concepto.id_centro_costos_erp, id: concepto.id_centro_costos_erp  });

    setEditConceptoGasto(Number(concepto.id));

    setLoadingTextConcepto('Editando concepto...');
      
    setRegisterNuevoConceptoGasto(true);

    validationConcepto.setValues(editConceptoGastoObj);
  };
  
  const recalcIndexDetailGasto = (dataAlter)=>{
    let newDataConceptosGasto = [];

    dataAlter.map((concepto)=>{
      if(concepto!="" && concepto !== undefined && concepto !== 'empty'){
        let newId = (newDataConceptosGasto.length+1);
        newDataConceptosGasto.push({
          "id": newId,
          "id_concepto_gasto": concepto.id_concepto_gasto,
          "conceptoText": concepto.conceptoText,
          "id_centro_costos_erp": concepto.id_centro_costos_erp,
          "centroCostosText": concepto.centroCostosText,
          "iva": concepto.iva,
          "valor_iva": concepto.valor_iva,
          "total": concepto.total,
          "descripcion": concepto.descripcion,
          "operaciones": (<div className={"text-center"}>
            <Button color="primary" className="btn-sm" onClick={()=>{editConceptoGasto(newId)}}> Editar </Button>
            {' '}
            <Button className="btn btn-danger btn-sm" onClick={()=>{deleteConceptoModal((newId-1))}}> Eliminar </Button>
          </div>)
        });
      }
    });

    setDataConceptosGasto(newDataConceptosGasto);
  };

  // Form validation 
  const validationConcepto = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesGastoConceptoForm,
    validationSchema: Yup.object({
      'concepto-total': Yup.string().required("Por favor ingrese el valor")
    }),
    onSubmit: (values) => {
      
      let conceptoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          conceptoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      if(!concepto){
        toastr.error("Seleccione el concepto.", "Error en la validación");
        return;
      }
      
      if(!centroCostos){
        toastr.error("Seleccione el centro de costos.", "Error en la validación");
        return;
      }

      conceptoValues["id_concepto_gasto"] = concepto.value;
      
      conceptoValues["id_centro_costos_erp"] = centroCostos.value;

      let newDataConceptosGasto = dataConceptosGasto;

      if(!editConceptoGastoId){
        let totalIVA = Number(conceptoValues["total"].replaceAll(".","").replaceAll(",",""));

            totalIVA = totalIVA/((Number(concepto.iva)/100)+1);
            totalIVA = Math.round(totalIVA*((Number(concepto.iva)/100)));
        
        let idConcept = newDataConceptosGasto.length+1;

        newDataConceptosGasto.push({
            "id": idConcept,
            "id_concepto_gasto": concepto.id,
            "conceptoText": concepto.label,
            "id_centro_costos_erp": centroCostos.id,
            "centroCostosText": centroCostos.label,
            "iva": `${concepto.iva} %`,
            "valor_iva": totalIVA,
            "total": Number(conceptoValues["total"].replaceAll(".","").replaceAll(",","")),
            "descripcion": conceptoValues["descripcion"],
            "operaciones": (<div className={"text-center"}>
              <Button color="primary" className="btn-sm" onClick={()=>{editConceptoGasto(idConcept)}}> Editar </Button>
              {' '}
              <Button className="btn btn-danger btn-sm" onClick={()=>{deleteConceptoModal(idConcept-1)}}> Eliminar </Button>
            </div>)
        });
        setDataConceptosGasto(newDataConceptosGasto);
      }else{
        let toEditConceptoGasto = newDataConceptosGasto.findIndex((concepto)=>{
          return concepto.id === editConceptoGastoId;
        });

        let totalIVA = Number(conceptoValues["total"].replaceAll(".","").replaceAll(",",""));
            totalIVA = totalIVA/((Number(concepto.iva)/100)+1);
            totalIVA = Math.round(totalIVA*((Number(concepto.iva)/100)));
        
        newDataConceptosGasto[toEditConceptoGasto] = {
          "id": editConceptoGastoId,
          "id_concepto_gasto": concepto.id,
          "conceptoText": concepto.label,
          "id_centro_costos_erp": centroCostos.id,
          "centroCostosText": centroCostos.label,
          "iva": `${concepto.iva} %`,
          "valor_iva": totalIVA,
          "total": conceptoValues["total"].replaceAll(".","").replaceAll(",",""),
          "descripcion": conceptoValues["descripcion"],
          "operaciones": (<div className={"text-center"}>
            <Button color="primary" className="btn-sm" onClick={()=>{editConceptoGasto(editConceptoGastoId)}}> Editar </Button>
            {' '}
            <Button className="btn btn-danger btn-sm" onClick={()=>{deleteConceptoModal(toEditConceptoGasto)}}> Eliminar </Button>
          </div>)
        };

        setDataConceptosGasto(newDataConceptosGasto);
      }

      setLoadingTextConcepto("Guardando ...");
      
      setTimeout(()=>{
        setLoadingTextConcepto("");
        setEditConceptoGasto(false);
        validationConcepto.handleReset();
      },250)

      let totalSpent = 0;
      let totalSpentIVA = 0;
      
      newDataConceptosGasto.map(concept=>{
        totalSpent += Number(concept.total.toString().replaceAll(".","").replaceAll(",",""));
        totalSpentIVA += Number(concept.valor_iva.toString().replaceAll(".","").replaceAll(",",""));
      });
      
      validation.setFieldValue("gasto-valor-total",totalSpent.toLocaleString('es-ES'));
      validation.setFieldValue("gasto-valor-total-iva",totalSpentIVA.toLocaleString('es-ES'));

      if(validation.values["gasto-porcentaje-retencion"]){
        calcReteFuenteSpent(Number(validation.values["gasto-porcentaje-retencion"]), totalSpent);
      }

      setRegisterNuevoConceptoGasto(false);
    }
  });

  const calcReteFuenteSpent = (percent, totalSpent)=>{
    percent = percent || 0;
    
    percent = (Number(percent)/100);
    
    if(concepto){
      totalSpent = Number(totalSpent.replaceAll(".","").replaceAll(",",""));

      let totalIVA = totalSpent;
          totalIVA = totalIVA/((Number(concepto?.iva)/100)+1);
          totalIVA = Math.round(totalIVA*((Number(concepto?.iva)/100)));

      validation.setFieldValue("gasto-valor-total-iva", Number(totalIVA).toLocaleString('es-ES'));

      let valueRete = Number(totalSpent)-Number(totalIVA);
          valueRete = Math.round((valueRete*percent));

      validation.setFieldValue("gasto-valor-total-retencion",valueRete.toLocaleString('es-ES'));
      
      let newTotal = Math.round((Number(totalSpent)-valueRete));

      validation.setFieldValue("gasto-valor-total",newTotal.toLocaleString('es-ES'));
    }else{
      validation.setFieldValue("gasto-valor-total", 0);
      validation.setFieldValue("gasto-valor-total-iva", 0);
      validation.setFieldValue("gasto-valor-total-retencion", 0);
    }
  };

  const columnsConceptosGasto = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: 'operaciones'
          },
          {
              Header: 'Concepto',
              accessor: 'conceptoText',
          },
          {
              Header: 'Centro Costos',
              accessor: 'centroCostosText',
          },
          {
              Header: '% IVA',
              accessor: 'iva',
          },
          {
              Header: 'V. IVA',
              HeaderClass: 'text-end',
              accessor: row => (<p className="text-end">$ {Number(row.valor_iva).toLocaleString()}</p>)
          },
          {
              Header: 'Total',
              HeaderClass: 'text-end',
              accessor: row => (<p className="text-end">$ {Number(row.total).toLocaleString()}</p>)
          },
          {
              Header: 'Descripción',
              accessor: 'descripcion',
          }
      ],
      []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Gastos" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editGastoId===false ? 'Nuevo Gasto' : 'Editando Gasto'}</CardTitle>
                    
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
                                      <label className="col-md-12 col-form-label">Consecutivo</label>
                                      <div className="col-md-12">
                                          <input
                                              className="form-control"
                                              name="gasto-consecutivo"
                                              value={validation.values['gasto-consecutivo'] || spentNextNumber}
                                              disabled={true}
                                              onChange={validation.handleChange}
                                              type="text"
                                          />
                                      </div>
                                  </Col>
                                  <Col md={3}>
                                      <div className="col-md-12">
                                        <label className="col-md-12 col-form-label">Proveedor *</label>
                                        
                                        <div className="col-md-12">
                                          <RemoteCombo 
                                            value={proveedor}
                                            data={personasErp}
                                            onChange={(val)=>setProveedor(val)}
                                          />
                                        </div>
                                      </div>
                                  </Col>
                                  <Col md={3}>
                                      <label className="col-md-12 col-form-label">Fecha *</label>
                                      <div className="col-md-12">
                                          <input
                                              type="date"
                                              className="form-control"
                                              name="gasto-fecha-documento"
                                              value={validation.values['gasto-fecha-documento'] || ""}
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
                                                validation.touched['gasto-fecha-documento'] && validation.errors['gasto-fecha-documento'] && !validation.values['gasto-fecha-documento'] ? true : undefined
                                              }
                                            />
                                            {validation.touched['gasto-fecha-documento'] && validation.errors['gasto-fecha-documento'] && !validation.values['gasto-fecha-documento'] ? (
                                              <FormFeedback type="invalid">{validation.errors['gasto-fecha-documento']}</FormFeedback>
                                            ) : null}
                                      </div>
                                  </Col>
                                  <Col md={3}>
                                    <label className="col-md-12 col-form-label">Cuenta x Pagar/Egreso</label>
                                    <div className="col-md-12">
                                        <RemoteCombo 
                                          value={cuentaxPagarEgresoGasto}
                                          data={dataAccountsEgresosXPagar}
                                          disabled={!dataAccountsEgresosXPagar.length}
                                          onChange={(val)=>setCuentaxPagarEgresoGasto(val)}
                                        />
                                    </div>
                                  </Col>
                                  <Col md={3}>
                                      <label className="col-md-12 col-form-label">Número Factura Proveedor *</label>
                                      <div className="col-md-12">
                                          <input
                                              type="text"
                                              className="form-control"
                                              name="gasto-numero-factura-proveedor"
                                              value={validation.values['gasto-numero-factura-proveedor'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={
                                                validation.touched['gasto-numero-factura-proveedor'] && validation.errors['gasto-numero-factura-proveedor'] && !validation.values['gasto-numero-factura-proveedor'] ? true : false
                                              }
                                            />
                                            {validation.touched['gasto-numero-factura-proveedor'] && validation.errors['gasto-numero-factura-proveedor'] && !validation.values['gasto-numero-factura-proveedor'] ? (
                                              <FormFeedback type="invalid">{validation.errors['gasto-numero-factura-proveedor']}</FormFeedback>
                                            ) : null}
                                      </div>
                                  </Col>


                                  <Col md={3}>
                                  <label className="col-md-12 col-form-label">Concepto *</label>
                                  <div className="col-md-12">
                                    <RemoteCombo 
                                      value={concepto}
                                      data={dataSpentConcepts}
                                      disabled={!dataSpentConcepts}
                                      onChange={(val, b, c)=>{
                                        setConcepto(val);
                                        calcReteFuenteSpent(validation.values['gasto-porcentaje-retencion'], validation.values['gasto-valor']);
                                        setTimeout(()=>{ inputRefValue.current.focus(); },250);
                                      }}
                                    />
                                  </div>
                                </Col>
                          
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Valor *</label>
                                    <div className="col-md-12">
                                      <input
                                          type="numeric"
                                          ref={inputRefValue}
                                          disabled={(!concepto)}
                                          className="form-control"
                                          name="gasto-valor"
                                          value={validation.values['gasto-valor'] || ""}
                                          onChange={(e)=>{
                                            let val = Number(e.target.value.replaceAll(".","").replaceAll(",","")).toLocaleString('es-ES');
                                            validation.setFieldValue("gasto-valor", val);
                                            calcReteFuenteSpent(validation.values['gasto-porcentaje-retencion'], e.target.value);
                                          }}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['gasto-valor'] && validation.errors['gasto-valor'] && !validation.values['gasto-valor'] ? true : false
                                          }
                                      />
                                      {validation.touched['gasto-valor'] && validation.errors['gasto-valor'] && !validation.values['gasto-valor'] ? (
                                          <FormFeedback type="invalid">{validation.errors['gasto-valor']}</FormFeedback>
                                      ) : null}
                                    </div>
                                </Col>

                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Centro de Costos *</label>
                                    <div className="col-md-12">
                                        <RemoteCombo 
                                            value={centroCostos}
                                            data={dataCostsCenter}
                                            disabled={!dataCostsCenter}
                                            onChange={(val)=>setCentroCostos(val)}
                                        />
                                    </div>
                                </Col>
                                
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">% Rete Fuente</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="gasto-porcentaje-retencion"
                                            value={validation.values['gasto-porcentaje-retencion'] || ""}
                                            onChange={(e)=>{
                                              validation.setFieldValue("gasto-porcentaje-retencion", e.target.value);
                                              
                                              calcReteFuenteSpent(e.target.value, validation.values['gasto-valor'])
                                            }}
                                            type="number"
                                        />
                                    </div>
                                </Col>

                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Valor Rete Fuente</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="gasto-valor-total-retencion"
                                            value={validation.values['gasto-valor-total-retencion'] || ""}
                                            onChange={validation.handleChange}
                                            disabled={true}
                                            type="text"
                                        />
                                    </div>
                                </Col>

                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Valor Total IVA</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="gasto-valor-total-iva"
                                            value={validation.values['gasto-valor-total-iva'] || ""}
                                            onChange={validation.handleChange}
                                            disabled={true}
                                            type="text"
                                        />
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Valor Total Gasto</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="gasto-valor-total"
                                            value={validation.values['gasto-valor-total'] || ""}
                                            onChange={validation.handleChange}
                                            disabled={true}
                                            type="text"
                                        />
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <label className="col-md-12 col-form-label">Observación</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="gasto-observacion"
                                            value={validation.values['gasto-observacion'] || ""}
                                            onChange={validation.handleChange}
                                            type="text"
                                        />
                                    </div>
                                </Col>

                              </Row>
                          </Form>
                      {/*FORM GENERAL*/}
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
                                <Button type="reset" color="warning" onClick={cancelGasto} >
                                  Cancelar
                                </Button>
                                {" "}
                                <Button type="submit" onClick={()=>validation.submitForm()} color="primary">
                                  Grabar
                                </Button>
                              </>)
                          }
                        </Col>
                      </Row>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR GASTOS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR GASTOS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(<Row>
              <Col xl={3}>
                <Button onClick={()=>setEnableForm(true)} color="primary">
                  <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Nuevo gasto
                </Button>
                <br/>
                <br/>
              </Col>
            </Row>)}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (
            <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
              <TableContainer
                columns={columnsGastos}
                data={dataSpents}
                isGlobalFilter={true}
                isAddOptions={false}
                customPageSize={10}
                className="custom-header-css"
              />
            </div>
            )
          :
          (loadingText!="hidden" && loadingText!=""  && (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Anulando Gasto..." || loadingText=="Eliminando Gasto..." || loadingText=="Generando PDF ..." ?
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

      {/*MODAL CONCEPTOS*/}
      <Modal
        isOpen={registerNuevoConceptoGasto}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{editConceptoGastoId===false ? 'Nuevo Concepto' : 'Editando Concepto'}</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setRegisterNuevoConceptoGasto(false);
              setEditConceptoGasto(false);   
              validationConcepto.handleReset();       
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM CONCEPTO*/}
            <Form>
                <Row>
                    <Col md={4}>
                        <label className="col-md-12 col-form-label">Concepto *</label>
                        <div className="col-md-12">
                          <RemoteCombo 
                            value={concepto}
                            data={dataSpentConcepts}
                            disabled={!dataSpentConcepts}
                            onChange={(val, b, c)=>{
                              setConcepto(val);
                            }}
                          />
                        </div>
                    </Col>

                    <Col md={3}>
                      <label className="col-md-12 col-form-label">Centro de Costos *</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={centroCostos}
                          data={dataCostsCenter}
                          disabled={!dataCostsCenter}
                          onChange={(val)=>setCentroCostos(val)}
                        />
                      </div>
                    </Col>
                
                    <Col md={2}>
                        <label className="col-md-12 col-form-label">Valor *</label>
                        <div className="col-md-12">
                        <Input
                            type="numeric"
                            className="form-control"
                            name="concepto-total"
                            value={validationConcepto.values['concepto-total'] || ""}
                            onChange={(e)=>{
                              let val = Number(e.target.value.replaceAll(".","").replaceAll(",","")).toLocaleString('es-ES');
                              validationConcepto.setFieldValue("concepto-total", val);
                            }}
                            onBlur={validationConcepto.handleBlur}
                            invalid={
                              validationConcepto.touched['concepto-total'] && validationConcepto.errors['concepto-total'] && !validationConcepto.values['concepto-total'] ? true : false
                            }
                          />
                          {validationConcepto.touched['concepto-total'] && validationConcepto.errors['concepto-total'] && !validationConcepto.values['concepto-total'] ? (
                            <FormFeedback type="invalid">{validationConcepto.errors['concepto-total']}</FormFeedback>
                          ) : null}
                        </div>
                    </Col>
                
                    <Col md={3}>
                        <label className="col-md-12 col-form-label">Descripción</label>
                        <div className="col-md-12">
                        <Input
                            type="text"
                            className="form-control"
                            name="concepto-descripcion"
                            value={validationConcepto.values['concepto-descripcion'] || ""}
                            onChange={validationConcepto.handleChange}
                          />
                        </div>
                    </Col>
                </Row>
            </Form>
        {/*FORM CONCEPTO*/}
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={() => {
            setRegisterNuevoConceptoGasto(false);
            setEditConceptoGasto(false);
            validationConcepto.handleReset();
          }}>Cancelar</button>
          <button type="button" className="btn btn-primary" onClick={() => {
            validationConcepto.submitForm();
          }}>Guardar</button>
        </div>
      </Modal>
      {/*MODAL CONCEPTOS*/}
      
      
      
      {/*MODAL ELIMINAR GASTO*/}
      <Modal
        isOpen={confirmModalEliminarGasto}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarGasto(false);
              setConfirmModalEliminarGasto(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ELIMINAR</b></u> el Gasto con Consecutivo # <b>{(confirmEliminarGasto!==false ? confirmEliminarGasto.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteGastoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarGasto(false);
            setConfirmModalEliminarGasto(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR GASTO*/}
      
      {/*MODAL ANULAR GASTO*/}
      <Modal
        isOpen={confirmModalCancelGasto}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarGasto(false);
              setConfirmModalEliminarGasto(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ANULAR</b></u> el Gasto con Consecutivo # <b>{(confirmEliminarGasto!==false ? confirmEliminarGasto.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteGastoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarGasto(false);
            setConfirmModalCancelGasto(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ANULAR GASTO*/}
      
      
      {/*MODAL ELIMINAR CONCEPTO*/}
      <Modal
        isOpen={confirmModalEliminarConcepto}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarConcepto(false);
              setConfirmModalEliminarConcepto(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el Concepto <b>{(confirmEliminarConcepto!==false ? dataConceptosGasto[confirmEliminarConcepto]?.conceptoText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setConfirmModalEliminarConcepto(false);

            let newDataConceptosGasto = dataConceptosGasto;
            delete(newDataConceptosGasto[confirmEliminarConcepto]);
            
            recalcIndexDetailGasto(newDataConceptosGasto);

            setLoadingTextConcepto(false);
            setConfirmEliminarConcepto(false);
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarConcepto(false);
            setConfirmModalEliminarConcepto(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR CONCEPTO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexGastos);

IndexGastos.propTypes = {
  history: PropTypes.object,
};