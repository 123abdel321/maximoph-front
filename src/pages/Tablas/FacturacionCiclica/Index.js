import React, { useState, useMemo, useEffect } from "react";
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
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane
} from "reactstrap";

import classnames from "classnames";

// Formik validation
import * as Yup from "yup";
import { setIn, useFormik } from "formik";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { deleteCyclicalBill, createCyclicalBill, createCyclicalBillMassive, deleteCyclicalBillMassive, editCyclicalBill, getCyclicalBills, getProperties, getPropertyOwnersRenters, getBillingConcepts, getZones } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";


//DETALLE
import FacturacionCiclicaDetalles  from "./FacturacionCiclicaDetalles";
import { property } from "lodash";

const IndexFacturacionCiclica = props => {
  
  const [activeTab1, setactiveTab1] = useState("5");
  
  const [showBaseConcept, setShowBaseConcept] = useState(false);
  const [strictedValidation, setStrictedValidation] = useState(false);
  const [cyclicalBillsTotals, setCyclicalBillsTotals] = useState(null);
  const [dataCyclicalBillsFilter, setDataCyclicalBillsFilter] = useState([]);
  const [errorValidacionEstricta, setErrorValidacionEstricta] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
  
  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };
  
  //meta title
  document.title = "Conceptos Inmuebles | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataCyclicalBills, dataProperties, dataBillingConcepts, dataZones } = useSelector(state => ({
    loading: state.CyclicalBills.loading,
    dataZones: state.Zones.zones.filter(i=>Number(i.tipo)==1),
    dataCyclicalBills: state.CyclicalBills.cyclicalBills,
    dataBillingConcepts: state.BillingConcepts.billingConcepts,
    dataProperties: state.Properties.properties,
    loadingGrid: state.CyclicalBills.loadingGrid
  }));

  const initialValuesCyclicalBillsForm = {
    'factura-ciclica-id-inmueble': '',
    'factura-ciclica-id-concepto': '',
    'factura-ciclica-fecha-inicio': '',
    'factura-ciclica-fecha-fin': '',
    'factura-ciclica-valor-total': '',
    'factura-ciclica-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [inmueble, setInmueble] = useState(null);
  const [persona, setPersona] = useState(null);
  const [concepto, setConcepto] = useState(null);
  const [conceptoMasivo, setConceptoMasivo] = useState(null);
  const [tipoInmuebleMasivo, setTipoInmuebleMasivo] = useState({ label: "TODOS", value: "3" });
  const [tipoConceptoMasivo, setTipoConceptoMasivo] = useState({ label: "POR COEFICIENTE", value: "0" });
  const [zona, setZona] = useState(null);
  
  //CREAR CONCEPTOS MASIVAMENTE
  const [loadingMasivo, setLoadingMasivo] = useState(false);
  const [inmueblePersonas, setInmueblePersonas] = useState(false);
  const [editFacturaCiclicaId, setEditFacturaCiclica] = useState(false);
  const [confirmEliminarFacturaCiclica, setConfirmEliminarFacturaCiclica] = useState(false);
  const [nuevoConceptoMasivoFacturacion, setNuevoConceptoMasivoFacturacion] = useState(false);
  const [confirmModalEliminarFacturaCiclica, setConfirmModalEliminarFacturaCiclica] = useState(false);
  
  //ELIMINAR CONCEPTOS MASIVAMENTE
  const [zonaEliminar, setZonaEliminar] = useState(null);
  const [conceptoEliminarMasivo, setConceptoEliminarMasivo] = useState(null);
  const [loadingEliminarMasivo, setLoadingEliminarMasivo] = useState(false);
  const [tipoInmuebleEliminarMasivo, setTipoInmuebleEliminarMasivo] = useState({ label: "TODOS", value: "3" });
  const [eliminarConceptoMasivoFacturacion, setEliminarConceptoMasivoFacturacion] = useState(false);
  
  const [enableForm, setEnableForm] = useState(false);

  const editFacturaCiclicaFn = (facturaCiclica)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editFacturaCiclicaObj = {};

      Object.entries(facturaCiclica).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `factura-ciclica-${fieldName}`;
        editFacturaCiclicaObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditFacturaCiclica(Number(facturaCiclica.id));

      let inmuebleRec = {label: facturaCiclica.inmuebleText, value: facturaCiclica.id_inmueble};

      let personaRec = (facturaCiclica.id_persona ? {label: facturaCiclica.personaText, value: facturaCiclica.id_persona} : false);

      setInmueble(inmuebleRec);
      selectProperty(inmuebleRec, personaRec);
      
      let conceptoRec = {label: facturaCiclica.conceptoText, value: facturaCiclica.id_concepto_factura};
      setConcepto(conceptoRec);
      setEnableForm(true);
      setLoadingText('Editando factura ciclica...');
      
      validation.setValues(editFacturaCiclicaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Conceptos de Inmuebles", "Permisos");
    }
  };

  const deleteFacturaCiclicaModal = (facturaCiclica)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarFacturaCiclica(facturaCiclica);
      setConfirmModalEliminarFacturaCiclica(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Conceptos de Inmuebles", "Permisos");
    }
  };
  
  const deleteFacturaCiclicaConfirm = ()=>{
    cancelFacturaCiclica();
    setConfirmEliminarFacturaCiclica(false);
    setConfirmModalEliminarFacturaCiclica(false);
    

    setLoadingText('Eliminando tipo tarea...')

    dispatch(deleteCyclicalBill(confirmEliminarFacturaCiclica.id, ()=>{
      cancelFacturaCiclica();
      loadFacturasCiclicas(showBaseConcept);
      toastr.success("Factura Cíclica eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesCyclicalBillsForm,
    validationSchema: Yup.object({
      'factura-ciclica-fecha-inicio': Yup.date().required("Por favor ingrese la fecha de inicio")
    }),
    onSubmit: (values) => {
      let facturaCiclicaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('factura-ciclica-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","personaText","areaText"].includes(fieldName)===false){
          facturaCiclicaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!inmueble){
        toastr.error("Seleccione el inmueble.", "Error en la validación");
        return;
      }

      if(!persona){
        toastr.error("Seleccione la persona.", "Error en la validación");
        return;
      }

      if(!concepto){
        toastr.error("Seleccione un concepto.", "Error en la validación");
        return;
      }
      
      if(!Number(facturaCiclicaValues['valor_total'])){
        toastr.error("Digite el valor del concepto.", "Error en la validación");
        return;
      }

      facturaCiclicaValues["id_inmueble"] = inmueble.value;
      facturaCiclicaValues["id_persona"] = persona.value;
      facturaCiclicaValues["id_concepto"] = concepto.value;
      
      setLoadingText("Guardando ...");

      if(!editFacturaCiclicaId){
        dispatch(createCyclicalBill(facturaCiclicaValues, (response)=>{
          if(response.success){
            cancelFacturaCiclica();
            loadFacturasCiclicas(showBaseConcept);
            toastr.success("Nueva factura ciclica registrada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("La factura ciclica ya está registrada.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editCyclicalBill(facturaCiclicaValues, (response)=>{
          if(response.success){
            cancelFacturaCiclica();
            loadFacturasCiclicas(showBaseConcept);
            toastr.success("Factura Cíclica editada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("La Factura Ciclica ya está registrada.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelFacturaCiclica = ()=>{
    setEditFacturaCiclica(false);
    setLoadingText(false);
    setEnableForm(false);

    setInmueble(null);
    
    setConcepto(null);
    
    setPersona(null);
    setInmueblePersonas([]);

    validation.handleReset();
  };

  const validationConceptoMasivo = useFormik({
    enableReinitialize: true,
    initialValues: {
      'concepto-masivo-valor': '',
      'concepto-masivo-fecha-inicio': '',
      'concepto-masivo-fecha-fin': '',
      'concepto-masivo-descripcion': ''
    },
    validationSchema: Yup.object({
      'concepto-masivo-fecha-inicio': Yup.date().required("Por favor ingrese la fecha de inicio"),
      'concepto-masivo-fecha-fin': Yup.date().required("Por favor ingrese la fecha de finalización")
    }),
    onSubmit: (values) => {
      let conceptoMasivoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-masivo-','');
        fieldName = fieldName.replaceAll('-','_');
        
        if(fieldName=="valor"){
          conceptoMasivoValues[fieldName] = fieldValue.replaceAll(".","").replaceAll("","");
        }else{
          conceptoMasivoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!conceptoMasivo){
        toastr.error("Seleccione el concepto.", "Error en la validación");
        return;
      }
      
      if(conceptoMasivoValues["fecha_fin"]&&!conceptoMasivoValues["fecha_inicio"]){
        toastr.error("Digite la fecha de inicio.", "Error en la validación");
        return;
      }
      
      if(!Number(conceptoMasivoValues['valor'])){
        toastr.error("Digite el valor del concepto.", "Error en la validación");
        return;
      }

      conceptoMasivoValues["tipo_concepto_masivo"] = tipoConceptoMasivo.value;
      conceptoMasivoValues["id_concepto_masivo"] = conceptoMasivo.value;
      conceptoMasivoValues["tipo_inmueble_masivo"] = tipoInmuebleMasivo.value;
      conceptoMasivoValues["id_zona_masiva"] = zona?.value;
      
      setLoadingMasivo(true);

      dispatch(createCyclicalBillMassive(conceptoMasivoValues, (response)=>{
        if(response.success){
          cancelConceptoMasivo();
          loadFacturasCiclicas(showBaseConcept);
          toastr.success("Conceptos creados masivamente.", "Operación Ejecutada");
        }else{
          setLoadingMasivo(false);
          toastr.error((response.error||"Error al intentar registrar los conceptos, por favor intente más tarde."), "Error en la operación");
        }
      }));
    }
  });

  const cancelConceptoMasivo = ()=>{
    setNuevoConceptoMasivoFacturacion(false);
    setLoadingText(false);
    setLoadingMasivo(false);

    setZona(null);
    setConceptoMasivo(null);
    setTipoInmuebleMasivo({ label: "TODOS", value: "3" });
    setTipoConceptoMasivo({ label: "POR COEFICIENTE", value: "0" });

    validationConceptoMasivo.handleReset();
  };


  const validationConceptoEliminarMasivo = useFormik({
    enableReinitialize: true,
    initialValues: {
      'concepto-eliminar-masivo-fecha': ''
    },
    validationSchema: Yup.object({
      'concepto-eliminar-masivo-fecha': Yup.date().required("Por favor ingrese la fecha de creación")
    }),
    onSubmit: (values) => {
      let conceptoEliminarMasivoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-eliminar-masivo-','');
        fieldName = fieldName.replaceAll('-','_');

        conceptoEliminarMasivoValues[fieldName] = fieldValue.replaceAll(".","").replaceAll(",","");

        fieldName = '';
        fieldValue = '';
      });

      if(!conceptoEliminarMasivo){
        toastr.error("Seleccione el concepto.", "Error en la validación");
        return;
      }

      conceptoEliminarMasivoValues["id_concepto_eliminar_masivo"] = conceptoEliminarMasivo.value;
      conceptoEliminarMasivoValues["tipo_inmueble_eliminar_masivo"] = tipoInmuebleEliminarMasivo.value;
      conceptoEliminarMasivoValues["id_zona_eliminar_masiva"] = zonaEliminar?.value;
      
      setLoadingEliminarMasivo(true);

      dispatch(deleteCyclicalBillMassive(conceptoEliminarMasivoValues, (response)=>{
        if(response.success){
          cancelEliminarConceptoMasivo();
          loadFacturasCiclicas(showBaseConcept);
          toastr.success("Conceptos eliminado masivamente.", "Operación Ejecutada");
        }else{
          setLoadingEliminarMasivo(false);
          toastr.error((response.error||"Error al intentar eliminar los conceptos, por favor intente más tarde."), "Error en la operación");
        }
      }));
    }
  });

  const cancelEliminarConceptoMasivo = ()=>{
    setEliminarConceptoMasivoFacturacion(false);
    setLoadingEliminarMasivo(false);
    setEnableForm(false);

    setZonaEliminar(null);
    setConceptoEliminarMasivo(null);
    setTipoInmuebleEliminarMasivo({ label: "TODOS", value: "3" });

    validationConceptoEliminarMasivo.handleReset();
  };

  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

            if(row.concepto_bloqueado==1) return (<p className="text-center"><Button className="btn-sm" color={"secondary"}><b>CONCEPTO BASE - NO EDITABLE</b></Button></p>);

            return (<p className="text-center">
              <Button color={classEditBtn}className="btn-sm" onClick={()=>{editFacturaCiclicaFn(row)}}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteFacturaCiclicaModal(row)}}> 
                <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Eliminar</span>
              </Button>
            </p>);
          }
        },
        {
            Header: 'Zona',
            accessor: 'zonaText',
        },
        {
            Header: 'Inmueble',
            accessor: 'inmuebleText',
        },
        {
            Header: 'Fecha Inicio',
            accessor: 'fecha_inicio',
        },
        {
            Header: 'Fecha Fin',
            accessor: row => row.fecha_fin||'SIN TERMINACIÓN'
        },
        {
            Header: 'Concepto',
            accessor: 'conceptoText',
        },
        {
            Header: 'Persona',
            accessor: 'personaText'
        },
        {
            Header: 'Persona Dcto.',
            accessor: 'personaDocumento'
        },
        {
            Header: 'Persona Tipo',
            accessor: row => (row.personaTipo.replaceAll(':',''))
        },
        {
            Header: 'Área Mt2',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.areaText}</p>)
        },
        {
            Header: 'Coeficiente %',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.coeficiente.toFixed(2)}</p>)
        },
        {
            Header: 'Total',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.valor_total_sum).toLocaleString()}</p>)
        },
        {
            Header: 'Fecha Creación',
            accessor: 'created_format'
        }
    ],
    []
  );

  const loadFacturasCiclicas = (filter)=>{
    setLoadingText('Cargando ...');

    dispatch(getCyclicalBills(null, (resp)=>{ 

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getProperties(null, ()=>{ 
        setStrictedValidation(resp.stricted);
        setCyclicalBillsTotals(resp.totals);
        dispatch(getBillingConcepts(null, ()=>{ 
          dispatch(getZones(null, ()=>{
            
            let dataFiltered = [];

            resp.data.map((bill)=>{
              if(bill.concepto_bloqueado!=1||filter) dataFiltered.push(bill);
            });

            setDataCyclicalBillsFilter(dataFiltered);

            setLoadingText('');

          }));
        }, true));
      }));
    }));
  };

  useEffect(()=>{
    loadFacturasCiclicas(showBaseConcept);
  },[]);

  const selectProperty = (inmueble, personaRec)=>{
    setInmueble(inmueble);
    
    setPersona(null);
    setInmueblePersonas([]);

    dispatch(getPropertyOwnersRenters(null, (persons)=>{
        let newPersons = [];
        
        persons.map((person)=>newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}: ${person.porcentaje_administracion} %`, value: person.id_persona}));
        
        setInmueblePersonas(newPersons);
  
        if(personaRec) setPersona(personaRec);
    }, inmueble.value));
  };

  const FacturacionCiclicaTotales = ()=>{
    return (<Row>
      <Col lg={4}>
        <Card className="mini-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Inmuebles con Factura</b>
                
                <h5 className="mb-0">{Number(cyclicalBillsTotals.unidades_ingresadas).toLocaleString()} de {cyclicalBillsTotals.numero_unidades}</h5>
              </div>

              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                  <i className="bx bx-building-house"></i>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Valor Total Facturas $</b>
                <h5 className="mb-0">$ {Number(cyclicalBillsTotals.valor_total_facturas).toLocaleString()}</h5>
              </div>

              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                  <i className="bx bx-money"></i>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Coeficiente %</b>
                <h5 className="mb-0">% {Number(cyclicalBillsTotals.coeficiente_ingresado).toLocaleString()} de % {Number(cyclicalBillsTotals.coeficiente_entorno).toLocaleString()}</h5>
              </div>

              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                  <i className="bx bx-calculator"></i>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={4}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Valor Total Administraciòn Mensual$</b>
                <h5 className="mb-0">$ {Number(cyclicalBillsTotals.valor_total_administracion).toLocaleString()} de $ {Math.round(Number(cyclicalBillsTotals.ppto_entorno)/12).toLocaleString()}</h5>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>
      
      {cyclicalBillsTotals.concepts.map((concept, index)=>(<Col lg={4} key={index}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Concepto {concept.nombre_concepto} - {((Number(concept.total_concepto)/Number(cyclicalBillsTotals.valor_total_facturas))*100).toFixed(2).toString()}%</b>
                    <h5 className="mb-0">$ {Number(concept.total_concepto).toLocaleString()}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-money"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>))}
    </Row>);
  }
  let classCreateBtn = accessModule.CREAR==true ? "primary" : "secondary";
  let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Conceptos Inmuebles" />
          {accessModule.CREAR==true && enableForm==true && 
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editFacturaCiclicaId===false ? 'Nuevo Concepto Inmueble' : 'Editando Concepto Inmueble'}</CardTitle>
                    
                    {
                      editFacturaCiclicaId===false 
                      ? 
                      (null)
                      :
                      (null)/*<Nav pills className="navtab-bg nav-justified">
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "5",
                            })}
                            onClick={() => {
                              toggle1("5");
                            }}
                          >
                            Información General
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            style={{ cursor: "pointer" }}
                            className={classnames({
                              active: activeTab1 === "6",
                            })}
                            onClick={() => {
                              toggle1("6");
                            }}
                          >
                            Detalle
                          </NavLink>
                        </NavItem>
                      </Nav>*/
                    }

                    <TabContent activeTab={activeTab1} className="p-3 text-muted">
                      <TabPane tabId="5">
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
                                      <Col md={6}>
                                          <label className="col-md-12 col-form-label">Inmueble *</label>
                                          <div className="col-md-12">
                                              <RemoteCombo 
                                                value={inmueble}
                                                data={dataProperties}
                                                disabled={!dataProperties.length}
                                                onChange={(val)=>selectProperty(val)}
                                              />
                                          </div>
                                      </Col>
                                      <Col md={6}>
                                          <label className="col-md-12 col-form-label">Persona *</label>
                                          <div className="col-md-12">
                                              <RemoteCombo 
                                                value={persona}
                                                data={inmueblePersonas}
                                                onChange={(val)=>setPersona(val)}
                                                disabled={!inmueble}
                                                placeholder={!inmueble?'Seleccione un inmueble':'Seleccione una persona'}
                                              />
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Fecha Inicio *</label>
                                          <div className="col-md-12">
                                              <Input
                                                type="date"
                                                className="form-control"
                                                name="factura-ciclica-fecha-inicio"
                                                value={validation.values['factura-ciclica-fecha-inicio'] || ""}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                invalid={
                                                  validation.touched['factura-ciclica-fecha-inicio'] && validation.errors['factura-ciclica-fecha-inicio'] && !validation.values['factura-ciclica-fecha-inicio'] ? true : false
                                                }
                                              />
                                              {validation.touched['factura-ciclica-fecha-inicio'] && validation.errors['factura-ciclica-fecha-inicio'] && !validation.values['factura-ciclica-fecha-inicio'] ? (
                                                <FormFeedback type="invalid">{validation.errors['factura-ciclica-fecha-inicio']}</FormFeedback>
                                              ) : null}
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Fecha Fin</label>
                                          <div className="col-md-12">
                                              <Input
                                                type="date"
                                                className="form-control"
                                                name="factura-ciclica-fecha-fin"
                                                value={validation.values['factura-ciclica-fecha-fin'] || ""}
                                                onChange={validation.handleChange}
                                              />
                                          </div>
                                      </Col>
                                      
                                      <Col md={4}>
                                        <label className="col-md-12 col-form-label">Concepto *</label>
                                        <div className="col-md-12">
                                          <RemoteCombo 
                                            value={concepto}
                                            data={dataBillingConcepts}
                                            onChange={(val)=>{
                                              setConcepto(val);
                                              if(Number(val.valor)){
                                                val = Number(val.valor.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                                                validation.setFieldValue("factura-ciclica-valor-total", val);
                                              }else{
                                                validation.setFieldValue("factura-ciclica-valor-total", "0");
                                              }
                                            }}
                                            disabled={dataBillingConcepts.length==0}
                                          />
                                        </div>
                                      </Col>
                                  
                                      <Col md={4}>
                                        <label className="col-md-12 col-form-label">Valor *</label>
                                        <div className="col-md-12">
                                          <Input
                                            type="numeric"
                                            className="form-control"
                                            name="factura-ciclica-valor-total"
                                            value={validation.values['factura-ciclica-valor-total'] || ""}
                                            onChange={(e)=>{
                                              let val = Number(e.target.value.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                                              validation.setFieldValue("factura-ciclica-valor-total", val);
                                            }}
                                            onBlur={validation.handleBlur}
                                            invalid={
                                              validation.touched['factura-ciclica-valor-total'] && validation.errors['factura-ciclica-valor-total'] && !validation.values['factura-ciclica-valor-total'] ? true : false
                                            }
                                          />
                                          {validation.touched['factura-ciclica-valor-total'] && validation.errors['factura-ciclica-valor-total'] && !validation.values['factura-ciclica-valor-total'] ? (
                                            <FormFeedback type="invalid">{validation.errors['factura-ciclica-valor-total']}</FormFeedback>
                                          ) : null}
                                        </div>
                                      </Col>

                                      <Col md={4}>
                                        <label className="col-md-12 col-form-label">Observación</label>
                                        <div className="col-md-12">
                                          <Input
                                              type="text"
                                              className="form-control"
                                              name="factura-ciclica-observacion"
                                              value={validation.values['factura-ciclica-observacion'] || ""}
                                              onChange={validation.handleChange}
                                            />
                                        </div>
                                      </Col>
                                  </Row>
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
                                            <Button type="reset" color="warning" onClick={cancelFacturaCiclica} >
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
                      </TabPane>
                      <TabPane tabId="6">
                        <Row>
                          <Col sm="12">
                            {/*DATATABLE FACTURA DETALLES*/}
                              {
                                editFacturaCiclicaId ?
                                  (<FacturacionCiclicaDetalles editFacturaCiclicaId={editFacturaCiclicaId} loadFacturasCiclicas={loadFacturasCiclicas}  />)
                                :
                                  (<></>)
                              }
                            {/*DATATABLE FACTURA DETALLES*/}
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                    <br />
                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR CONCEPTOS INMUEBLES</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR CONCEPTOS INMUEBLES</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={4}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo concepto de inmueble
                  </Button>
                </Col>
                <Col xl={4}>
                  <Button color={classCreateBtn} onClick={()=>{ 
                    if(accessModule.CREAR==true){
                      if(strictedValidation==0||strictedValidation==false){
                        setNuevoConceptoMasivoFacturacion(true); 
                      }else{
                        let errors = [];

                        if(Number(cyclicalBillsTotals.unidades_ingresadas)!=Number(cyclicalBillsTotals.unidades_entorno)){
                          errors.push(`Inmuebles con Factura Incompletos: ${Number(cyclicalBillsTotals.unidades_ingresadas).toLocaleString()} de ${Number(cyclicalBillsTotals.unidades_entorno).toLocaleString()}`);
                        }
                        
                        if(Number(cyclicalBillsTotals.coeficiente_ingresado)!=Number(cyclicalBillsTotals.coeficiente_entorno)){
                          errors.push(`Coeficiente total incompleto: ${Number(cyclicalBillsTotals.coeficiente_ingresado).toLocaleString()} de % ${Number(cyclicalBillsTotals.coeficiente_entorno).toLocaleString()}`);
                        }

                        if(Number(cyclicalBillsTotals.valor_total_administracion)!=Number(cyclicalBillsTotals.ppto_entorno)){
                          errors.push(`Valor administración incompleto: $ ${Number(cyclicalBillsTotals.valor_total_administracion).toLocaleString()} de $ ${Number(cyclicalBillsTotals.ppto_entorno).toLocaleString()}`);
                        }
                
                        if(cyclicalBillsTotals.unidades_admon_diff){
                          errors.push(`Unidades con % Administración diferente de 100 : ${cyclicalBillsTotals.unidades_admon_diff}`);
                        }

                        if(errors.length==0){
                          setNuevoConceptoMasivoFacturacion(true);
                        }else{
                          setErrorValidacionEstricta(errors);
                        }
                      }
                      }else{
                        toastr.options = { positionClass: 'toast-top-right' };
                        toastr.warning("No tienes acceso a crear Conceptos de Inmuebles", "Permisos");
                      }
                    }}>
                    <i className="bx bx-add-to-queue" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Asociar concepto masivamente
                  </Button>
                </Col>
                <Col xl={4}>
                  {loadingText=="Guardando ..." ?
                    (<></>)
                  :
                    (<>
                      
                      {" "}
                      {<Button color={classDeleteBtn} onClick={()=>{ 
                        if(accessModule.ELIMINAR==true){
                          setEliminarConceptoMasivoFacturacion(true); 
                        }else{
                          toastr.options = { positionClass: 'toast-top-right' };
                          toastr.warning("No tienes acceso a eliminar Conceptos de Inmuebles", "Permisos");
                        }
                      }}>
                        <i className="bx bx-trash" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Eliminar concepto masivamente
                    </Button>}
                    </>)}
                </Col>
                <br/>
                <br/>
                <br/>
              </Row>
            )}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (<>
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}> 
                <Row>
                  <Col md={6}>
                    <div className="form-check form-switch form-switch-lg mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="mostrar-solo-conceptos-base"
                        defaultChecked={showBaseConcept}
                        onChange={(e)=>{
                          setShowBaseConcept(e.target.checked?true:false);
                          loadFacturasCiclicas((e.target.checked?true:false));
                        }}
                      />
                      <label className="form-check-label" htmlFor="customSwitchsizelg">
                        Mostrar concepto base de administración
                      </label>
                    </div>
                  </Col>
                </Row>
                <TableContainer
                    columns={columns}
                    totalsFnComponent={(dataF)=>{
                      let area = 0;
                      let coeficiente = 0;
                      let valorAdmon = 0;
                      
                      if(dataF.length){
                        dataF.map((row)=>{
                          area += Number(row.original.areaText);
                          coeficiente += Number(row.original.coeficiente);
                          valorAdmon += Number(row.original.valor_total_sum);
                        });

                        area = area.toFixed(2).toLocaleString('es-ES');
                        coeficiente = (coeficiente*100).toFixed(2).toLocaleString('es-ES');
                        valorAdmon = valorAdmon.toLocaleString('es-ES');
                      }

                      return (<tr>
                        <td><p className="text-center"><b>TOTALES</b></p></td>
                        <td colspan={8}></td>
                        <td><p className="text-end"><b>{Number(area).toLocaleString()}</b></p></td>
                        <td><p className="text-end"><b>{Number(coeficiente)} %</b></p></td>
                        <td><p className="text-end" style={{minWidth: '110px'}}><b>$ {valorAdmon}</b></p></td>
                        <td></td>
                      </tr>);
                    }}
                    data={dataCyclicalBillsFilter}
                    isGlobalFilter={true}
                    isAddOptions={false}
                    customPageSize={10}
                    customPageSizeOptions={true}
                    className="custom-header-css"
                />
              </div>
              <br />
              <FacturacionCiclicaTotales />
            </>)
          :
          (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando factrua ciclica..." ?
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
          </Row>)
          }
        </Container>
      </div>

      {/*MODAL ELIMINAR FACTURA CICLICA*/}
      <Modal
        isOpen={confirmModalEliminarFacturaCiclica}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarFacturaCiclica(false);
              setConfirmModalEliminarFacturaCiclica(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar la factura cíclica <b>{(confirmEliminarFacturaCiclica!==false ? confirmEliminarFacturaCiclica.inmuebleText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteFacturaCiclicaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarFacturaCiclica(false);
            setConfirmModalEliminarFacturaCiclica(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR FACTURA CICLICA*/}
      
      {/*MODAL CREAR CONCEPTO MASIVO*/}
      <Modal
        isOpen={nuevoConceptoMasivoFacturacion}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{'Asociar concepto masivamente'}</h5>
          {!loadingMasivo&&(<button type="button" className="btn-close"
            onClick={() => {
              cancelConceptoMasivo();
            }} aria-label="Close"></button>)}
        </div>
        <div className="modal-body">
        {/*FORM CONCEPTO MASIVO*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validationConceptoMasivo.submitForm();

                return false;
              }}>
                <Row>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Tipo Concepto</label>
                      <div className="col-md-12">
                        <RemoteCombo
                            value={tipoConceptoMasivo}
                            onChange={value=>setTipoConceptoMasivo(value)}
                            data={[
                              { label: "POR COEFICIENTE", value: "0" },
                              { label: "POR VALOR INDIVIDUAL", value: "1" }
                            ]}
                          />
                      </div>
                  </Col>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Tipo Inmueble</label>
                      <div className="col-md-12">
                        <RemoteCombo
                            value={tipoInmuebleMasivo}
                            onChange={value=>setTipoInmuebleMasivo(value)}
                            data={[
                              { label: "TODOS", value: "3" },
                              { label: "INMUEBLE", value: "0" },
                              { label: "PARQUEADERO", value: "1" },
                              { label: "CUARTO ÚTIL", value: "2" }
                            ]}
                          />
                      </div>
                  </Col>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Zona</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={zona}
                          data={dataZones}
                          disabled={dataZones.length==0}
                          onChange={(val)=>setZona(val)}
                        />
                      </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Fecha Inicio *</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="concepto-masivo-fecha-inicio"
                            value={validationConceptoMasivo.values['concepto-masivo-fecha-inicio'] || ""}
                            onChange={validationConceptoMasivo.handleChange}
                            onBlur={validationConceptoMasivo.handleBlur}
                            invalid={
                              validationConceptoMasivo.touched['concepto-masivo-fecha-inicio'] && validationConceptoMasivo.errors['concepto-masivo-fecha-inicio'] && !validationConceptoMasivo.values['concepto-masivo-fecha-inicio'] ? true : false
                            }
                          />
                          {validationConceptoMasivo.touched['concepto-masivo-fecha-inicio'] && validationConceptoMasivo.errors['concepto-masivo-fecha-inicio'] && !validationConceptoMasivo.values['concepto-masivo-fecha-inicio'] ? (
                            <FormFeedback type="invalid">{validationConceptoMasivo.errors['concepto-masivo-fecha-inicio']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Fecha Fin *</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="concepto-masivo-fecha-fin"
                            value={validationConceptoMasivo.values['concepto-masivo-fecha-fin'] || ""}
                            onChange={validationConceptoMasivo.handleChange}
                            invalid={
                              validationConceptoMasivo.touched['concepto-masivo-fecha-fin'] && validationConceptoMasivo.errors['concepto-masivo-fecha-fin'] && !validationConceptoMasivo.values['concepto-masivo-fecha-fin'] ? true : false
                            }
                          />
                          {validationConceptoMasivo.touched['concepto-masivo-fecha-fin'] && validationConceptoMasivo.errors['concepto-masivo-fecha-fin'] && !validationConceptoMasivo.values['concepto-masivo-fecha-fin'] ? (
                            <FormFeedback type="invalid">{validationConceptoMasivo.errors['concepto-masivo-fecha-fin']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Concepto *</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={conceptoMasivo}
                          data={dataBillingConcepts}
                          disabled={dataBillingConcepts.length==0}
                          onChange={(val)=>{
                            setConceptoMasivo(val);
                            if(Number(val.valor)){
                              val = Number(val.valor.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                              validationConceptoMasivo.setFieldValue("concepto-masivo-valor", val);
                            }else{
                              validationConceptoMasivo.setFieldValue("concepto-masivo-valor", "0");
                            }
                          }}
                        />
                      </div>
                  </Col>
              
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Valor *</label>
                      <div className="col-md-12">
                      <Input
                          type="numeric"
                          className="form-control"
                          name="concepto-masivo-valor"
                          value={validationConceptoMasivo.values['concepto-masivo-valor'] || ""}
                          onChange={(e)=>{
                            let val = Number(e.target.value.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                            validationConceptoMasivo.setFieldValue("concepto-masivo-valor", val);
                          }}
                          onBlur={validationConceptoMasivo.handleBlur}
                          invalid={
                            validationConceptoMasivo.touched['concepto-masivo-valor'] && validationConceptoMasivo.errors['concepto-masivo-valor'] && !validationConceptoMasivo.values['concepto-masivo-valor'] ? true : false
                          }
                        />
                        {validationConceptoMasivo.touched['concepto-masivo-valor'] && validationConceptoMasivo.errors['concepto-masivo-valor'] && !validationConceptoMasivo.values['concepto-masivo-valor'] ? (
                          <FormFeedback type="invalid">{validationConceptoMasivo.errors['concepto-masivo-valor']}</FormFeedback>
                        ) : null}
                      </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                      <label className="col-md-12 col-form-label">Descripción</label>
                      <div className="col-md-12">
                      <Input
                          type="text"
                          className="form-control"
                          name="concepto-masivo-descripcion"
                          value={validationConceptoMasivo.values['concepto-masivo-descripcion'] || ""}
                          onChange={validationConceptoMasivo.handleChange}
                        />
                      </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} className="text-end">
                    {
                      loadingMasivo ?
                        (
                          <>
                            <br />
                            Creando conceptos masivos
                            <br />
                            <br />
                            <Spinner className="ms-12" color="dark" />
                          </>
                        )
                      :
                        (<>
                          <Button type="reset" color="warning" onClick={()=>{ cancelConceptoMasivo(false); }} >
                            Cancelar
                          </Button>
                          {" "}
                          <Button type="submit" color="primary">
                            Crear masivamente
                          </Button>
                        </>)
                    }
                  </Col>
                </Row>
            </Form>
        {/*FORM CONCEPTO MASIVO*/}
        </div>
      </Modal>
      {/*MODAL CREAR CONCEPTO MASIVO*/}

      {/*MODAL ELIMINAR CONCEPTO MASIVO*/}
      <Modal
        isOpen={eliminarConceptoMasivoFacturacion}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{'Eliminar concepto masivamente'}</h5>
          {!loadingMasivo&&(<button type="button" className="btn-close"
            onClick={() => {
              cancelEliminarConceptoMasivo();
            }} aria-label="Close"></button>)}
        </div>
        <div className="modal-body">
        {/*FORM CONCEPTO MASIVO*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validationConceptoEliminarMasivo.submitForm();

                return false;
              }}>
                <Row>
                  <Col md={4}>
                      <label className="col-md-12 col-form-label">Fecha Ingreso (En la fecha que se creó)*</label>
                      <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            name="concepto-eliminar-masivo-fecha"
                            value={validationConceptoEliminarMasivo.values['concepto-eliminar-masivo-fecha'] || ""}
                            onChange={validationConceptoEliminarMasivo.handleChange}
                            onBlur={validationConceptoEliminarMasivo.handleBlur}
                            invalid={
                              validationConceptoEliminarMasivo.touched['concepto-eliminar-masivo-fecha'] && validationConceptoEliminarMasivo.errors['concepto-eliminar-masivo-fecha'] && !validationConceptoEliminarMasivo.values['concepto-eliminar-masivo-fecha'] ? true : false
                            }
                          />
                          {validationConceptoEliminarMasivo.touched['concepto-eliminar-masivo-fecha'] && validationConceptoEliminarMasivo.errors['concepto-eliminar-masivo-fecha'] && !validationConceptoEliminarMasivo.values['concepto-eliminar-masivo-fecha'] ? (
                            <FormFeedback type="invalid">{validationConceptoEliminarMasivo.errors['concepto-eliminar-masivo-fecha']}</FormFeedback>
                          ) : null}
                      </div>
                  </Col>
                  <Col md={3}>
                      <label className="col-md-12 col-form-label">Concepto *</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={conceptoEliminarMasivo}
                          data={dataBillingConcepts}
                          disabled={dataBillingConcepts.length==0}
                          onChange={(val)=>setConceptoEliminarMasivo(val)}
                        />
                      </div>
                  </Col>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Tipo Inmueble *</label>
                      <div className="col-md-12">
                        <RemoteCombo
                            value={tipoInmuebleEliminarMasivo}
                            onChange={value=>setTipoInmuebleEliminarMasivo(value)}
                            data={[
                              { label: "TODOS", value: "3" },
                              { label: "INMUEBLE", value: "0" },
                              { label: "PARQUEADERO", value: "1" },
                              { label: "CUARTO ÚTIL", value: "2" }
                            ]}
                          />
                      </div>
                  </Col>
                  <Col md={3}>
                      <label className="col-md-12 col-form-label">Zona</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={zonaEliminar}
                          data={dataZones}
                          disabled={dataZones.length==0}
                          onChange={(val)=>setZonaEliminar(val)}
                        />
                      </div>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12} className="text-end">
                    {
                      loadingEliminarMasivo ?
                        (
                          <>
                            <br />
                            Eliminando conceptos masivos
                            <br />
                            <br />
                            <Spinner className="ms-12" color="dark" />
                          </>
                        )
                      :
                        (<>
                          <Button type="reset" color="warning" onClick={()=>{ cancelEliminarConceptoMasivo(false); }} >
                            Cancelar
                          </Button>
                          {" "}
                          <Button type="submit" color="primary">
                            Eliminar masivamente
                          </Button>
                        </>)
                    }
                  </Col>
                </Row>
            </Form>
        {/*FORM CONCEPTO MASIVO*/}
        </div>
      </Modal>
      {/*MODAL ELIMINAR CONCEPTO MASIVO*/}



      {/*MODAL ERROR VALIDACIÓN ESTRICTA*/}
      <Modal
        isOpen={errorValidacionEstricta}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Error de validación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setErrorValidacionEstricta(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>
            Para crear conceptos masivamente debes revisar las siguientes novedades: <br /><br /> 
            {errorValidacionEstricta[0]} <br /> 
            {errorValidacionEstricta[1]} <br />
            {errorValidacionEstricta[2]} <br /> 
          </p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setErrorValidacionEstricta(false);
          }}>Verficiar</button>
        </div>
      </Modal>
      {/*MODAL ERROR VALIDACIÓN ESTRICTA*/}
    </React.Fragment>
  );
};

export default withRouter(IndexFacturacionCiclica);

IndexFacturacionCiclica.propTypes = {
  history: PropTypes.object,
};