import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Col,
  Nav, 
  Card,
  Row,
  Form,
  Alert,
  Modal,
  Input,
  Button,
  Spinner,
  NavItem, 
  NavLink, 
  TabPane,
  CardBody,
  CardTitle,
  Container,
  InputGroup,
  TabContent, 
  FormFeedback,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown
} from "reactstrap";

import classnames from "classnames";

import Select from "react-select";
import Dropzone from "react-dropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getProperties, getPropertyPets, createProperty, editProperty, deleteProperty, getZones, downloadTableImporterTemplate, uploadTableImporterTemplate } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

//PROPIETARIOS - INQUILINOS
import InmuebleInquilinosPropietarios  from "./InmuebleInquilinosPropietarios";

//PROPIETARIOS - VISITANTE
import InmuebleVisitante  from "./InmuebleVisitantes";

//PROPIETARIOS - VEHICULOS
import InmuebleVehiculos  from "./InmuebleVehiculos";

//PROPIETARIOS - MASCOTAS
import InmuebleMascotas  from "./InmuebleMascotas";

const IndexInmuebles = props => {

  
  const [activeTab1, setactiveTab1] = useState("5");
  
  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };
  
  //meta title
  document.title = "Inmuebles | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataProperties, dataZones } = useSelector(state => ({
    loading: state.Properties.loading,
    dataZones: state.Zones.zones.filter(i=>Number(i.tipo)==1),
    dataProperties: state.Properties.properties,
    loadingGrid: state.Properties.loadingGrid
  }));

  const initialValuesPropertiesForm = {
    'inmueble-id-inmueble-zona': '',
    'inmueble-numero-interno-unidad': '',
    'inmueble-area': '',
    'inmueble-coeficiente': '',
    'inmueble-valor-total-administracion': '',
    'inmueble-numero-perros': '0',
    'inmueble-numero-gatos': '0',
    'inmueble-observaciones': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [tipo, setTipo] = useState({ label: "INMUEBLE", value: "0" });
  const [zona, setZona] = useState(null);
  const [dropdowmImporterProperties, setDropdowmImporterProperties] = useState(false);
  const [dropdowmImporterPersons, setDropdowmImporterPersons] = useState(false);
  
  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
  
  const [propertiesTotals, setPropertiesTotals] = useState(null);
  const [propertyEnableEditAdmonValue, setPropertyEnableEditAdmonValue] = useState(false);
  
  const [errorEntorno, setErrorEntorno] = useState(false);
  
  const [errorImportador, setErrorImportador] = useState(false);
  const [errorImportadorExtra, setErrorImportadorExtra] = useState(false);

  const [warningAdmon, setWarningAdmon] = useState(false);
  const [areaTotalM2, setAreaTotalM2] = useState(0);
  const [pptoTotal, setPptoTotal] = useState(0);
  const [periodoFacturacion, setPeriodoFacturacion] = useState(0);
  const [enableForm, setEnableForm] = useState(false);

  const [editInmuebleId, setEditInmueble] = useState(false);
  const [confirmEliminarInmueble, setConfirmEliminarInmueble] = useState(false);
  const [confirmModalEliminarInmueble, setConfirmModalEliminarInmueble] = useState(false);

  const InmuebleTotales = ()=>{
    return (<Row>
      <Col lg={4} md={6} sm={12}>
        <Card className="mini-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Inmuebles Registrados</b>
                <h5 className="mb-0">{Number(propertiesTotals.unidades_ingresadas).toLocaleString()} de {Number(propertiesTotals.unidades_entorno).toLocaleString()}</h5>
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

      <Col lg={4} md={6} sm={12}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Área Registrada M2</b>
                <h5 className="mb-0">{Number(propertiesTotals.area_ingresada).toLocaleString()} de {Number(propertiesTotals.area_entorno).toLocaleString()}</h5>
              </div>

              <div className="avatar-sm ms-auto">
                <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                  <i className="bx bx-font-size"></i>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Col>

      <Col lg={4} md={6} sm={12}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Coeficiente %</b>
                <h5 className="mb-0">{Number(propertiesTotals.coeficiente_ingresado).toLocaleString()} de {Number(propertiesTotals.coeficiente_entorno).toLocaleString()}</h5>
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

      <Col lg={4} md={6} sm={12}>
        <Card className="blog-stats-wid">
          <CardBody>
            <div className="d-flex flex-wrap">
              <div className="me-3">
                <b className="text-muted mb-2">Presupuesto Asignado Mensual$</b>
                <h5 className="mb-0">{Math.round(Number(propertiesTotals.ppto_ingresado)/12).toLocaleString()} de {Math.round(Number(propertiesTotals.ppto_entorno)/12).toLocaleString()}</h5>
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
    </Row>);
  }

  const validateAdmonPercent = (persons)=>{
    let totalAdmonPercent = 0;

    persons.map(person=>{
      totalAdmonPercent += Number(person.porcentaje_administracion);
    });

    setWarningAdmon(totalAdmonPercent < 100 || totalAdmonPercent>100 ? true : false);
  };

  const editInmuebleFn = (inmueble)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editInmuebleObj = {};

      Object.entries(inmueble).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `inmueble-${fieldName}`;
        editInmuebleObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditInmueble(Number(inmueble.id));

      setTipo({label: inmueble.tipoText, value: inmueble.tipo});
      setZona({label: inmueble.zonaText, value: inmueble.id_inmueble_zona});
      setEnableForm(true);

      setLoadingText('Editando inmueble...');
      
      validation.setValues(editInmuebleObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar un inmueble", "Permisos");
    }
  };

  const deleteInmuebleModal = (inmueble)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarInmueble(inmueble);
      setConfirmModalEliminarInmueble(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar un inmueble", "Permisos");
    }
  };
  
  const deleteInmuebleConfirm = ()=>{
    cancelInmueble();
    setConfirmEliminarInmueble(false);
    setConfirmModalEliminarInmueble(false);
    

    setLoadingText('Eliminando tipo tarea...')

    dispatch(deleteProperty(confirmEliminarInmueble.id, ()=>{
      cancelInmueble();
      loadInmuebles();
      toastr.success("Inmueble eliminado.", "Operación Ejecutada");
    }));
  };

  const customHandleBlur = event =>{
    validation.handleBlur(event);

    let areaInmueble = Number(validation.values['inmueble-area']);
    
    let coeficiente = (areaInmueble/areaTotalM2).toFixed(4);
    let valorAdmon = Math.ceil((Math.ceil(pptoTotal*Number(coeficiente))/12));

    validation.setFieldValue("inmueble-coeficiente", coeficiente);
    validation.setFieldValue("inmueble-valor-total-administracion", Number(valorAdmon).toLocaleString('es-ES'));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesPropertiesForm,
    validationSchema: Yup.object({
      'inmueble-numero-interno-unidad': Yup.string().required("Por favor ingresa el número interno de unidad"),
      'inmueble-area': Yup.number().required("Por favor ingresa el área"),
      'inmueble-coeficiente': Yup.number().required("Por favor ingresa el coeficiente"),
      'inmueble-valor-total-administracion': Yup.string().required("Por favor ingresa el valor total de administración")
    }),
    onSubmit: (values) => {
      let inmuebleValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('inmueble-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          if(fieldName=="valor_total_administracion"){
            inmuebleValues[fieldName] = fieldValue.replaceAll(".","").replaceAll(",","");
          }else{
            inmuebleValues[fieldName] = fieldValue;
          }
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!zona){
        toastr.error("Seleccione la zona", "Error de validación");
        return;
      }
      
      inmuebleValues["tipo"] = tipo.value;
      inmuebleValues["id_inmueble_zona"] = zona.value;
      
      initialValuesPropertiesForm["inmueble-id-inmueble-zona"] = zona.value;
      initialValuesPropertiesForm["inmueble-tipo"] = zona.value;
      
      if(inmuebleValues["numero_perros"]=='') inmuebleValues["numero_perros"] = '0';
      if(inmuebleValues["numero_gatos"]=='') inmuebleValues["numero_gatos"] = '0';

      setLoadingText("Guardando ...");

      if(!editInmuebleId){
        dispatch(createProperty(inmuebleValues, (response)=>{
          if(response.success){
            cancelInmueble();
            loadInmuebles();
            toastr.success("Nuevo inmueble registrada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editProperty(inmuebleValues, (response)=>{
          if(response.success){
            cancelInmueble();
            loadInmuebles();
            toastr.success("Inmueble editado.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando inmueble...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelInmueble = ()=>{
    setEnableForm(false);
    setEditInmueble(false);
    setLoadingText(false);

    setTipo({ label: "INMUEBLE", value: "0" });
    setZona(null);

    validation.handleReset();
  };

  const columns = useMemo(
    () => [
        {
            Header: 'Operaciones',
            sticky: true,
            accessor: row => {
              let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
              let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

              return (<p className="text-center">
                <Button color={classEditBtn} className="btn-sm" onClick={()=>{editInmuebleFn(row)}}> 
                    <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Editar</span>
                </Button>
                {' '}
                <Button color={classDeleteBtn} className="btn btn-sm" onClick={()=>{deleteInmuebleModal(row)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
              </p>);
            }
        },
        {
            Header: 'Tipo',
            accessor: 'tipoText',
        },
        {
            Header: 'Código',
            accessor: 'numero_interno_unidad',
        },
        {
            Header: 'Zona',
            accessor: 'zonaText',
        },
        {
            Header: 'Área',
            accessor: row => (<p className="text-end">{Number(row.area).toFixed(2).toLocaleString()}</p>)
        },
        {
            Header: 'Coeficiente',
            accessor: row => (<p className="text-end">{(Number(row.coeficiente)*100).toFixed(2)}</p>)
        },
        {
            Header: 'Valor Admon.',
            accessor: row => (<p className="text-end">{Number(row.valor_total_administracion).toLocaleString()}</p>)
        },
        {
            Header: '% Admon',
            accessor: row => (<p className="text-end" style={{color:Number(row.admon_completed)==100?'green':'red'}}>% {row.admon_completed.toFixed(2)}</p>)
        },
        {
            Header: 'Inquilino',
            accessor: row => (row.inquilino?row.inquilino:(row.propietario ? row.propietario : 'SIN ASIGNAR'))
        }
    ],
    []
  );

  const loadInmuebles = ()=>{
    setLoadingText('Cargando ...');
    
    let enviromentMaximo = JSON.parse(localStorage.getItem("enviromentMaximo"));
    
    let areaTotalValidate = false;
    let pptoTotalValidate = false;
    let periodoFacturacionValidate = false;
    let totalUnidadesValidate = false;
    let conceptoAdmonValidate = false;

    enviromentMaximo.map(config=>{
      switch(config.campo){
        case "area_total_m2":
          setAreaTotalM2(Number(config.valor));
          areaTotalValidate = Number(config.valor);
        break;
        case "periodo_facturacion":
          setPeriodoFacturacion(config.valor);
          periodoFacturacionValidate = config.valor;
        break;
        case "valor_total_presupuesto_year_actual":
          setPptoTotal(Number(config.valor));
          pptoTotalValidate = Number(config.valor);
        break;
        case "numero_total_unidades":
          totalUnidadesValidate = Number(config.valor);
        break;
        case "id_concepto_administracion":
          conceptoAdmonValidate = Number(config.valor);
        break;
      }
    });

    if(!areaTotalValidate||!pptoTotalValidate||!totalUnidadesValidate||!conceptoAdmonValidate||!periodoFacturacionValidate){
      setErrorEntorno(true);
    }else{
      setErrorEntorno(false);
    }

    dispatch(getPropertyPets(null, (respPet)=>{
      
      setDataPropertyPetsAll(respPet.data);

      dispatch(getProperties(null, (resp)=>{
        dispatch(getZones(null, ()=>{

          let newAccessModule = accessModule;
          resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

          setAccessModule(newAccessModule);

          setPropertiesTotals(resp.totals);
          setPropertyEnableEditAdmonValue(resp.editarValorAdmonInmueble||false);

          setLoadingText('');
        }));
      }));
    }, 0));
  };
  
  const downloadCSVImporter = (origin)=>{
    
    setLoadingFile(`descargando-${origin}`);

    dispatch(downloadTableImporterTemplate(origin, (resp)=>{
      let columns = resp.columns.join(";");
      
      const blob = new Blob([columns], { type: 'text/csv' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${resp.template_name}.csv`;
      
      a.click();

      URL.revokeObjectURL(blobUrl);
    
      setLoadingFile(false);
    }));
  };
  
  const uploadCSVImporter = (files, origin)=>{
    if(files[0].type=='text/csv'){
      const templateProperties = new FormData();
      templateProperties.append('template', files[0]);
      templateProperties.append('origin', origin);
      
      setLoadingFile(`importando-${origin}`);

      dispatch(uploadTableImporterTemplate(templateProperties, (response)=>{
        setLoadingFile(false);
        
        if(response.success){
          toastr.success(`Se importaron ${response.registers} registros`, "Operación Ejecutada");
          loadInmuebles();
        }else{
          switch(response.error){
            case "template-format":
              setErrorImportador(`Se cargó una plantilla con un formato incorrecto, por favor descargue la plantilla directamente de Máximo PH, no altere el formato, no le agregue fórmulas de excel, hojas adicionales. e intente cargarla nuevamente.`);
              setErrorImportadorExtra(false);
            break;
            case "template-empty":
              setErrorImportador(`Se cargó una plantilla vacia, por favor valide e intente cargarla nuevamente.`);
              setErrorImportadorExtra(false);
            break;
            case "in-file":
              setErrorImportador(`Se encontraron ${response.errors.length} errores en los registros importados, por favor validar el detalle, corregirlos e intentar cargarlo de nuevo.`);

              //DOWNLOAD FILE WITH ERRORS
              let csvErrors = "Linea;Error\n";
              
              response.errors.map(err=>{ csvErrors += `${err[0]};${err[1]}\n`; })

              setErrorImportadorExtra(csvErrors);
            break;
          }
        }
      }));
    }else{
      toastr.error("Por favor seleccione una plantilla válida", "Error de validación");
    }
  };
  
  useEffect(()=>{
    loadInmuebles();
  },[]);

  const [activeTab, setactiveTab] = useState("1");
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };
  
  const [dataPropertyPetsAll, setDataPropertyPetsAll] = useState([]);
  const columnsMascotas = useMemo(
    () => [
        {
          Header: 'Foto',
          accessor: row =>{
            const IMAGE_URL = (process.env.REACT_API_URL||'https://api.maximoph.com')+"/uploads/pets/"+row.avatar;
            if(row.avatar){
              return (<p className="text-center">
                <img
                  data-dz-thumbnail=""
                  className="avatar-md rounded bg-light"
                  src={IMAGE_URL}
                />
              </p>);
            }else{
              return (<></>);
            }
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        },
        {
            Header: 'Tipo',
            accessor: pet=>{
              let tipoText = '';
              
              switch(pet.tipo){
                case 0: tipoText = 'CANINO'; break;
                case 1: tipoText = 'FELINO'; break;
                case 3: tipoText = 'OTRO'; break;
              }

              return (<p className="text-center">{tipoText}</p>);
            },
        },
        {
            Header: 'Tipo Inmueble',
            accessor: 'inmuebleTipoText'
        },
        {
            Header: 'Código Inmueble',
            accessor: 'inmuebleText'
        },
        {
            Header: 'Observacion',
            accessor: 'observacion',
        }
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Inmuebles" />
          {
            accessModule.CREAR==true && enableForm &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editInmuebleId===false ? 'Nuevo Inmueble' : `Editando Inmueble: ${tipo.label} ${validation.values['inmueble-numero-interno-unidad']}`}</CardTitle>
                    
                    {
                      editInmuebleId===false 
                      ? 
                      (null)
                      :
                      (<>
                        {warningAdmon&&(<Alert color="warning" role="alert">
                          <b>ADVERTENCIA:</b> El 100% de Administración no está asignada en Propietarios/Inquilinos.
                        </Alert>)}

                        <Nav pills className="navtab-bg nav-justified">
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
                              Inquilinos/Propietarios
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: activeTab1 === "7",
                              })}
                              onClick={() => {
                                toggle1("7");
                              }}
                            >
                              Visitantes
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: activeTab1 === "8",
                              })}
                              onClick={() => {
                                toggle1("8");
                              }}
                            >
                              Vehiculos
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              style={{ cursor: "pointer" }}
                              className={classnames({
                                active: activeTab1 === "9",
                              })}
                              onClick={() => {
                                toggle1("9");
                              }}
                            >
                              Mascotas
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </>)
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
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Número Interno Unidad *</label>
                                          <div className="col-md-12">
                                          <Input
                                              type="text"
                                              className="form-control"
                                              name="inmueble-numero-interno-unidad"
                                              value={validation.values['inmueble-numero-interno-unidad'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={
                                                validation.touched['inmueble-numero-interno-unidad'] && validation.errors['inmueble-numero-interno-unidad'] && !validation.values['inmueble-numero-interno-unidad'] ? true : false
                                              }
                                            />
                                            {validation.touched['inmueble-numero-interno-unidad'] && validation.errors['inmueble-numero-interno-unidad'] && !validation.values['inmueble-numero-interno-unidad'] ? (
                                              <FormFeedback type="invalid">{validation.errors['inmueble-numero-interno-unidad']}</FormFeedback>
                                            ) : null}
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Tipo *</label>
                                          <div className="col-md-12">
                                            <Select
                                                value={tipo}
                                                onChange={value=>setTipo(value)}
                                                options={[
                                                  { label: "INMUEBLE", value: "0" },
                                                  { label: "PARQUEADERO", value: "1" },
                                                  { label: "CUARTO ÚTIL", value: "2" }
                                                ]}
                                                className="select2-selection"
                                              />
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Zona *</label>
                                          <div className="col-md-12">
                                            { dataZones.length ? 
                                              <RemoteCombo 
                                                value={zona}
                                                data={dataZones}
                                                disabled={!dataZones.length}
                                                onChange={(val)=>setZona(val)}
                                              /> :
                                              <label className="col-md-12 col-form-label" style={{ color: 'red' }}>No posee zonas de tipo inmueble</label>
                                            }
                                          </div>
                                      </Col>
                                  </Row>
                                  <Row>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Área M2 * (Área Total: {Number(areaTotalM2).toLocaleString()})</label>
                                          <div className="col-md-12">
                                          <Input
                                              type="number"
                                              className="form-control"
                                              name="inmueble-area"
                                              max={areaTotalM2}
                                              value={validation.values['inmueble-area'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={customHandleBlur}
                                              invalid={
                                                validation.touched['inmueble-area'] && validation.errors['inmueble-area'] && !validation.values['inmueble-area'] ? true : false
                                              }
                                            />
                                            {validation.touched['inmueble-area'] && validation.errors['inmueble-area'] && !validation.values['inmueble-area'] ? (
                                              <FormFeedback type="invalid">{validation.errors['inmueble-area']}</FormFeedback>
                                            ) : null}
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Coeficiente *</label>
                                          <div className="col-md-12">
                                          <Input
                                              type="numeric"
                                              readOnly={true}
                                              className="form-control"
                                              name="inmueble-coeficiente"
                                              value={validation.values['inmueble-coeficiente'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={
                                                validation.touched['inmueble-coeficiente'] && validation.errors['inmueble-coeficiente'] && !validation.values['inmueble-coeficiente'] ? true : false
                                              }
                                            />
                                            {validation.touched['inmueble-coeficiente'] && validation.errors['inmueble-coeficiente'] && !validation.values['inmueble-coeficiente'] ? (
                                              <FormFeedback type="invalid">{validation.errors['inmueble-coeficiente']}</FormFeedback>
                                            ) : null}
                                          </div>
                                      </Col>
                                      <Col md={4}>
                                          <label className="col-md-12 col-form-label">Valor Administración * (Ppto Total Anual: {Number(pptoTotal).toLocaleString()})</label>
                                          <div className="col-md-12">
                                          <Input
                                              type="numeric"
                                              className="form-control"
                                              readOnly={(Number(propertyEnableEditAdmonValue) ? false : true)}
                                              name="inmueble-valor-total-administracion"
                                              value={validation.values['inmueble-valor-total-administracion'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                              invalid={
                                                validation.touched['inmueble-valor-total-administracion'] && validation.errors['inmueble-valor-total-administracion'] && !validation.values['inmueble-valor-total-administracion'] ? true : false
                                              }
                                            />
                                            {validation.touched['inmueble-valor-total-administracion'] && validation.errors['inmueble-valor-total-administracion'] && !validation.values['inmueble-valor-total-administracion'] ? (
                                              <FormFeedback type="invalid">{validation.errors['inmueble-valor-total-administracion']}</FormFeedback>
                                            ) : null}
                                          </div>
                                      </Col>
                                      
                                  </Row>
                                  <Row>
                                      {/*<Col md={2}>
                                        <label className="col-md-12 col-form-label">Num. mascotas caninas</label>
                                        <div className="col-md-12">
                                          <InputGroup>
                                              <span className="input-group-append">
                                                <span className="input-group-text input-group-text-24"><i className="mdi mdi-dog font-size-24" /></span>
                                              </span>
                                              <Input
                                                  type="numeric"
                                                  className="form-control"
                                                  name="inmueble-numero-perros"
                                                  disabled={(tipo.value=='0'?false:true)}
                                                  value={validation.values['inmueble-numero-perros'] || ""}
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                  />
                                          </InputGroup>
                                        </div>
                                      </Col>
                                      <Col md={2}>
                                          <label className="col-md-12 col-form-label">Num. mascotas felinas</label>
                                          <div className="col-md-12">
                                            <InputGroup>
                                                <span className="input-group-append">
                                                  <span className="input-group-text input-group-text-24"><i className="mdi mdi-cat font-size-24" /></span>
                                                </span>
                                                <Input
                                                  type="numeric"
                                                  className="form-control"
                                                  name="inmueble-numero-gatos"
                                                  disabled={(tipo.value=='0'?false:true)}
                                                  value={validation.values['inmueble-numero-gatos'] || ""}
                                                  onChange={validation.handleChange}
                                                  onBlur={validation.handleBlur}
                                                />
                                            </InputGroup>
                                          </div>
                                      </Col>*/}
                                      <Col md={12}>
                                          <label className="col-md-12 col-form-label">Observaciones</label>
                                          <div className="col-md-12">
                                          <Input
                                              type="text"
                                              className="form-control"
                                              name="inmueble-observaciones"
                                              value={validation.values['inmueble-observaciones'] || ""}
                                              onChange={validation.handleChange}
                                              onBlur={validation.handleBlur}
                                          />
                                          </div>
                                      </Col>
                                  </Row>
                                  <br />
                                  <Row>
                                    <Col md={10}>
                                    </Col>
                                    <Col md={12} sm={12} lg={12} className="text-end">
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
                                            <Button type="reset" color="warning" onClick={cancelInmueble} >
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
                            {/*DATATABLE PERSONAS*/}
                            {
                              editInmuebleId ?
                                (<InmuebleInquilinosPropietarios
                                  editInmuebleId={editInmuebleId}
                                  onLoad={(persons)=>validateAdmonPercent(persons)}
                                />)
                              :
                                (null)
                            }
                            {/*DATATABLE PERSONAS*/}
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="7">
                        <Row>
                          <Col sm="12">
                            {/*DATATABLE VISITAS*/}
                            {
                              editInmuebleId ?
                                (<InmuebleVisitante editInmuebleId={editInmuebleId}  />)
                              :
                                (null)
                            }
                            {/*DATATABLE VISITAS*/}
                          </Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId="8">
                        <Row>
                          <Col sm="12">
                            {/*DATATABLE VEHICULOS*/}
                            {
                              editInmuebleId ?
                                (<InmuebleVehiculos editInmuebleId={editInmuebleId}  />)
                              :
                                (null)
                            }
                            {/*DATATABLE VEHICULOS*/}
                          </Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId="9">
                        <Row>
                          <Col sm="12">
                            {/*DATATABLE MASCOTAS*/}
                            {
                              editInmuebleId ?
                                (<InmuebleMascotas editInmuebleId={editInmuebleId}  />)
                              :
                                (null)
                            }
                            {/*DATATABLE MASCOTAS*/}
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>

                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR INMUEBLES</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true&&loadingFile==false&& !loadingText && enableForm==false &&(
            <Row>
              <Col xl={4}>
                <Button onClick={()=>setEnableForm(true)} color="primary">
                  <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Nuevo Inmueble
                </Button>
              </Col>
              <Col xl={4}>
                <ButtonDropdown isOpen={dropdowmImporterProperties} toggle={() => setDropdowmImporterProperties(!dropdowmImporterProperties)}>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="btn btn-info"
                  >
                    <i className="bx bx-import" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Importador Inmuebles
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={()=>downloadCSVImporter('inmuebles')}>
                      <Button color={'info'} className="btn-m"> 
                        <i className="bx bx-download font-size-14 align-middle me-2"></i>
                        {'Descargar Plantilla Inmuebles'}
                      </Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Dropzone onDrop={csvFile => {uploadCSVImporter(csvFile, 'inmuebles')}} >
                        {({ getRootProps, getInputProps }) => (
                          <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                            <input {...getInputProps()} />
                            <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                            {'Importar Inmuebles'}
                          </Button>
                        )}
                      </Dropzone>
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </Col>
              <Col xl={4}>
                <ButtonDropdown isOpen={dropdowmImporterPersons} toggle={() => setDropdowmImporterPersons(!dropdowmImporterPersons)}>
                  <DropdownToggle
                    caret
                    color="primary"
                    className="btn btn-info"
                  >
                    <i className="bx bx-import" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Importador Inquilinos/Propietarios
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem onClick={()=>downloadCSVImporter('inmuebles-admon')}>
                      <Button color={'info'} className="btn-m"> 
                        <i className="bx bx-download font-size-14 align-middle me-2"></i>
                        {'Descargar Plantilla Inquilinos/Propietarios'}
                      </Button>
                    </DropdownItem>
                    <DropdownItem>
                      <Dropzone onDrop={csvFile => {uploadCSVImporter(csvFile, 'inmuebles-admon')}} >
                        {({ getRootProps, getInputProps }) => (
                          <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                            <input {...getInputProps()} />
                            <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                            {'Importar Inquilinos/Propietarios'}
                          </Button>
                        )}
                      </Dropzone>
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </Col>
              <br/>
              <br/>
              <br/>
            </Row>
          )}

          {accessModule.CREAR==true&&loadingFile!=false&&(<Card>
            <Row>
              <Col xl={12}>
                <p className="text-center">
                  <br />
                  <Spinner className="ms-12" color="dark" />
                </p>
              </Col>
            </Row>
          </Card>)}
          
          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR INMUEBLES</b></p></Col></Row></Card>)}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (<>
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
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
                      Inmuebles
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
                      Todas las mascotas
                    </NavLink>
                  </NavItem>
                </Nav>
                {/*TABS*/}

                {/*CONTAINER TABS*/}
                <TabContent activeTab={activeTab} className="p-3 text-muted tab-panel-container-custom">
                  <TabPane tabId="1">
                    <br />
                    <TableContainer
                      columns={columns}
                      totalsFnComponent={(dataF)=>{
                        let area = 0;
                        let coeficiente = 0;
                        let valorAdmon = 0;
                        
                        dataF.map((row)=>{
                          area += Number(row.original.area);
                          coeficiente += Number(row.original.coeficiente);
                          valorAdmon += Number(row.original.valor_total_administracion);
                        });

                        area = area.toFixed(2).toLocaleString('es-ES');
                        coeficiente = (coeficiente*100).toFixed(2).toLocaleString('es-ES');
                        valorAdmon = valorAdmon.toLocaleString('es-ES');

                        return (<tr>
                          <td><p className="text-center"><b>TOTALES</b></p></td>
                          <td colspan={3}></td>
                          <td><p className="text-end"><b>{Number(area).toLocaleString()}</b></p></td>
                          <td><p className="text-end"><b>{Number(coeficiente)} %</b></p></td>
                          <td><p className="text-end"><b>$ {valorAdmon}</b></p></td>
                          <td colspan={2}></td>
                        </tr>);
                      }}
                      customPageSizeOptions={true}
                      data={dataProperties}
                      isGlobalFilter={true}
                      isAddOptions={false}
                      customPageSize={10}
                      className="custom-header-css"
                    />
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="12">
                        <br />
                        <br />
                        <TableContainer
                          columns={columnsMascotas}
                          data={dataPropertyPetsAll}
                          isGlobalFilter={true}
                          isAddOptions={false}
                          customPageSize={1000}
                          className="custom-header-css"
                        />
                      </Col>
                    </Row>
                  </TabPane>
                </TabContent>
              </div>
              <br />
              <InmuebleTotales />
              <br />
            </>)
          :
            (<Row>
              <Col xl={12}>
                <Card>
                  <Row>
                    <Col md={12} style={{textAlign: 'center'}}>
                      {
                        loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando inmueble..." ?
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
      
      {/*MODAL ELIMINAR INMUEBLE*/}
      <Modal
        isOpen={confirmModalEliminarInmueble}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarInmueble(false);
              setConfirmModalEliminarInmueble(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el inmueble <b>{(confirmEliminarInmueble!==false ? confirmEliminarInmueble.numero_interno_unidad : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este inmueble en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteInmuebleConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarInmueble(false);
            setConfirmModalEliminarInmueble(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR INMUEBLE*/}
      
      {/*MODAL ERROR IMPORTADOR*/}
      <ModalConfirmAction 
        confirmModal={(errorImportador?true:false)}
        information={true}
        error={true}
        onClose={()=>{
          setErrorImportador(false);

          if(errorImportadorExtra){
            const blob = new Blob([errorImportadorExtra], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `importador_maximoph_errores.csv`;
            
            a.click();
  
            URL.revokeObjectURL(blobUrl);
          }

          setErrorImportadorExtra(false);
        }}
        title={"Error importación"}
        description={(errorImportador||'')}
      />
      {/*MODAL ERROR IMPORTADOR*/}
      
      {/*MODAL ERROR CONFIG ENTORNO*/}
      <ModalConfirmAction 
          confirmModal={(errorEntorno?true:false)}
          information={true}
          error={true}
          title={"Error"}
          onClose={() => {      
            window.location.href="/utilidades/entorno";
          }}
          description={`Antes de crear inmuebles debes configurar en Utilidades > Entorno: Área Total, Presupuesto Anual, Total Unidades, Concepto Administración.`}
        />

      {/*MODAL ERROR CONFIG ENTORNO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexInmuebles);

IndexInmuebles.propTypes = {
  history: PropTypes.object,
};