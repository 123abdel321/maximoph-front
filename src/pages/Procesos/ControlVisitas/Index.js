import React, { useState, useMemo, useRef, useEffect } from "react";
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
  FormFeedback
} from "reactstrap";


// Formik validation
import * as Yup from "yup";
import Webcam from 'react-webcam';
import Dropzone from "react-dropzone";
import { useFormik } from "formik";

import { Link } from "react-router-dom"

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getControlVisits, getControlVisitsVisitors, createControlVisit, editControlVisit, deleteControlVisit, getProperties, getZones, getConceptsVisit, getPropertyOwnersRenters, getVehicleTypes } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexVisitas = props => {

  //meta title
  document.title = "Control Visitas | Maximo PH";

  const dispatch = useDispatch();

  const [zona, setZona] = useState(null);
  const [inmueble, setInmueble] = useState(null);
  const [concepto, setConcepto] = useState(null);
  const [tipoVehiculo, setTipoVehiculo] = useState(null);
  const [personaAutoriza, setPersonaAutoriza] = useState(null);
  
  const [dataZones, setDataZones] = useState([]);
  const [visitorImage, setVisitorImage] = useState(null);
  const [dataProperties, setDataProperties] = useState([]);
  const [dataVehicleTypes, setDataVehicleTypes] = useState([]);
  const [dataConceptsVisit, setDataConceptsVisit] = useState([]);
  const [dataPropertyOwnersRenters, setDataPropertyOwnersRenters] = useState([]);
  
  const [currentVisitor, setCurrentVisitor] = useState(false);
  
  const { loading, loadingGrid, dataControlVisits } = useSelector(state => ({
    loading: state.ControlVisits.loading,
    loadingGrid: state.ControlVisits.loadingGrid,
    dataControlVisits: state.ControlVisits.controlVisits
  }));

  const initialValuesControlVisitsForm = {
    'control-visita-persona-visita': '',
    'control-visita-persona-visita-cedula': '',
    'control-visita-observacion': '',
    'control-visita-placa': '',
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [subLoadingText, setSubLoadingText] = useState('');

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [dataSearchVisitors, setDataSearchVisitors] = useState([]);
  

  const [searchVisitor, setSearchVisitor] = useState("");
  const [warningControlAccess, setWarningControlAccess] = useState(false);
  const [editControlVisitaId, setEditControlVisita] = useState(false);
  const [confirmEliminarControlVisita, setConfirmEliminarControlVisita] = useState(false);
  const [confirmModalEliminarControlVisita, setConfirmModalEliminarControlVisita] = useState(false);

  const editControlVisitaFnFT = async (controlVisita)=>{
    loadControlVisitas((resp)=>{
      editControlVisitaFn(controlVisita, resp);
    });
  };

  const editControlVisitaFn = async (controlVisita, resp)=>{
    let fieldName = '';
    let fieldValue = '';
    let editControlVisitaObj = {};

    Object.entries(controlVisita).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');
      fieldName = `control-visita-${fieldName}`;
      editControlVisitaObj[fieldName] = fieldValue;


      fieldName = '';
      fieldValue = '';
    });

    setEditControlVisita(Number(controlVisita.id));

    setLoadingText('Editando control visita...');

    let propertyComboOption = false;
    if(controlVisita.id_inmueble){
      propertyComboOption = resp.respProperties.data.find(row=>Number(row.id)==Number(controlVisita.id_inmueble));
    }
    
    let zoneComboOption = false;
    if(controlVisita.id_inmueble_zona){
      zoneComboOption = resp.respZones.data.find(row=>Number(row.id)==Number(controlVisita.id_inmueble_zona));
    }

    let vehicleTypeComboOption = false;
    if(controlVisita.id_tipo_vehiculo){
      vehicleTypeComboOption = resp.respVehicleTypes.data.find(row=>Number(row.id)==Number(controlVisita.id_tipo_vehiculo));
    }
    
    let conceptVisitComboOption = false;
    if(controlVisita.id_tipo_vehiculo){
      conceptVisitComboOption = resp.respConceptsVisit.data.find(row=>Number(row.id)==Number(controlVisita.id_concepto_visita));
    }

    if(propertyComboOption){
      changeAccessProperty(propertyComboOption,(persons)=>{
        let personAutorizaComboOption = false;
        if(controlVisita.id_persona_autoriza){
          personAutorizaComboOption = persons.find(row=>Number(row.id)==Number(controlVisita.id_persona_autoriza));
        }

        if(personAutorizaComboOption){
          setPersonaAutoriza(personAutorizaComboOption);
        }
      });
    }else if(zoneComboOption){
      setZona(zoneComboOption);
    }

    if(vehicleTypeComboOption){
      setTipoVehiculo(vehicleTypeComboOption);
    }

    if(conceptVisitComboOption){
      setConcepto(conceptVisitComboOption);
    }
    
    validation.setValues(editControlVisitaObj);
  };

  const deleteControlVisitaModal = (controlVisita)=>{
    setConfirmEliminarControlVisita(controlVisita);
    setConfirmModalEliminarControlVisita(true);
  };
  
  const deleteControlVisitaConfirm = ()=>{
    cancelControlVisita();
    setConfirmEliminarControlVisita(false);
    setConfirmModalEliminarControlVisita(false);

    setLoadingText('Eliminando visita...')

    dispatch(deleteControlVisit(confirmEliminarControlVisita.id, ()=>{
      cancelControlVisita();
      loadControlVisitas();
      toastr.success("Visita eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesControlVisitsForm,
    validationSchema: Yup.object({
      'control-visita-persona-visita': Yup.string().required("Por favor ingrese la persona visitante"),
      'control-visita-observacion': Yup.string().required("Por favor ingrese la observación de la visita")
    }),
    onSubmit: (values) => {
      if(!zona){
        toastr.error("Seleccione una zona", "Error en la operación");
        return;
      }

      if(!concepto){
        toastr.error("Seleccione un concepto de visita", "Error en la operación");
        return;
      }

      let controlVisitaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('control-visita-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          controlVisitaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");

      controlVisitaValues["id_inmueble"] = inmueble?.value;
      controlVisitaValues["id_inmueble_zona"] = zona.value;
      controlVisitaValues["id_concepto_visita"] = concepto.value;
      controlVisitaValues["id_persona_autoriza"] = personaAutoriza?.value;
      controlVisitaValues["id_tipo_vehiculo"] = tipoVehiculo?.value;

      if(!editControlVisitaId){
        
        const controlVisitaValuesFormData = new FormData();

        Object.entries(controlVisitaValues).forEach(([key, value]) => {
          controlVisitaValuesFormData.append(key, (value==undefined?null:value));
        })

        controlVisitaValuesFormData.append('image', visitorImage);
        controlVisitaValuesFormData.append('tipo_image', visitorImage?.type);

        dispatch(createControlVisit(controlVisitaValuesFormData, (response)=>{
          if(response.success){
            cancelControlVisita();
            loadControlVisitas();
            toastr.success("Nueva visita.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("La visita ya fue registrada.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editControlVisit(controlVisitaValues, (response)=>{
          if(response.success){
            cancelControlVisita();
            loadControlVisitas();
            toastr.success("Visita Editada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("La visita ya está registrada.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelControlVisita = ()=>{
    setEditControlVisita(false);
    setLoadingText(false);

    setZona(null);
    setInmueble(null);
    setVisitorImage(null);
    setHasCamera(false);
    setConcepto(null);
    setTipoVehiculo(null);
    setPersonaAutoriza(null);

    validation.handleReset();
  };

  const columns = useMemo(
    () => [,
        {
            sticky: true,
            Header: 'Operaciones',
            accessor: row => {
              return (<p className="text-center">{row.operaciones}</p>);
            }
        },
        {
            Header: 'Foto Visita',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/visitors/"+row.imagen;
              row.IMAGE_URL = IMAGE_URL;
              if(row.imagen){
                return (<p className="text-center" style={{cursor: 'pointer'}} onClick={()=>setCurrentVisitor(row)}>
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
            Header: 'Inmueble',
            accessor: 'inmuebleText',
        },
        {
            Header: 'Zona',
            accessor: 'zonaText',
        },
        {
            Header: 'Concepto Visita',
            accessor: 'conceptoText',
        },
        {
            Header: 'Fecha Ingreso',
            accessor: 'fecha_ingreso',
        },
        {
            Header: 'Placa',
            accessor: 'placa',
        },
        {
            Header: 'Persona Visitante',
            accessor: 'personaVisitanteText',
        },
        {
            Header: 'Persona Nro. Dcto.',
            accessor: 'persona_visita_cedula',
        },
        {
            Header: 'Observación Ingreso',
            accessor: 'observación',
        }
    ],
    []
  );

  const withButtons = (row)=>{
    return (<>
      {<Button color="primary" className="btn-sm" onClick={()=>editControlVisitaFnFT(row)}> 
          <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Editar</span>
    </Button>}
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteControlVisitaModal(row)}}> 
          <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Eliminar</span>
      </Button>
    </>);
  };

  const loadControlVisitas = (cb)=>{ 
    setSubLoadingText('Cargando datos...');


    dispatch(getControlVisits(withButtons, ()=>{ 
      dispatch(getZones(null, (respZones)=>{ 
        dispatch(getProperties(null, (respProperties)=>{ 
          dispatch(getVehicleTypes(null, (respVehicleTypes)=>{ 
            dispatch(getConceptsVisit(null, (respConceptsVisit)=>{ 
              
              setDataZones(respZones.data);
              setDataProperties(respProperties.data.filter(p=>p.tipo==0));
              setDataVehicleTypes(respVehicleTypes.data);
              setDataConceptsVisit(respConceptsVisit.data);
              
              setSubLoadingText('');
              setLoadingText('');

              if(cb){
                cb({
                  respZones,
                  respProperties: {data: respProperties.data.filter(p=>p.tipo==0)},
                  respVehicleTypes,
                  respConceptsVisit
                });
              }else if(respConceptsVisit.default.length){
                setConcepto(respConceptsVisit.data.filter(c=>c.value==respConceptsVisit.default[0].valor)[0]);
              }

            }));

          }));

        }));

      }));

    }));
  };

  const searchVisitors = ()=>{
    setDataSearchVisitors([]);
    
    if(searchVisitor){
      setSubLoadingText('Buscando coincidencias...');
      
      
      setTimeout(()=>{
        dispatch(getControlVisitsVisitors((dataControl)=>{
          setSubLoadingText('');
          setDataSearchVisitors(dataControl);
          if(dataControl.length==0){
            toastr.options = { positionClass: 'toast-top-right' };
            toastr.warning("Término de búsqueda sin resultados", "Información Buscador");
          }
        }, searchVisitor));
      },500);
    }
  };

  const changeAccessProperty = (val, cb)=>{
    setDataPropertyOwnersRenters([]);

    setInmueble(val);
    setZona({value: val.id_inmueble_zona, label: val.zonaText});

    dispatch(getPropertyOwnersRenters(null, (persons)=>{
      persons.map(person=>{
        person.value = person.id;
        person.label = `${person.personaText} - TEL: ${person.telefono} | CEL: ${person.celular}`;
      });

      setDataPropertyOwnersRenters(persons);

      if(cb) cb(persons);
    }, val.id));
  };
  
  const cacelSearchVisitors = ()=>{
    setSearchVisitor('');
    setDataSearchVisitors([]);
  };

  useEffect(()=>{
    loadControlVisitas();
  },[]);

  const startAccessControlFT = async (controlVisita)=>{
    if(controlVisita.diaAutorizado){
      loadControlVisitas((resp)=>{
        startAccessControl(controlVisita, resp);
      });
    }else{
      setWarningControlAccess(controlVisita);
    }
  };
  
  const startAccessControl = async (controlVisita, resp)=>{
    let propertyComboOption = false;
    if(controlVisita.id_inmueble){
      propertyComboOption = resp.respProperties.data.find(row=>Number(row.id)==Number(controlVisita.id_inmueble));

      await changeAccessProperty(propertyComboOption,(persons)=>{
          let ownerRenterComboOption = false;
          if(controlVisita?.id_persona_autoriza){
            ownerRenterComboOption = persons.find(row=>Number(row.id_persona)==Number(controlVisita.id_persona_autoriza));
            
            setPersonaAutoriza(ownerRenterComboOption);
          }
      });
    }

    let vehicleTypeComboOption = false;
    if(controlVisita?.id_tipo_vehiculo){
      vehicleTypeComboOption = resp.respVehicleTypes.data.find(row=>Number(row.id)==Number(controlVisita.id_tipo_vehiculo));
      
      setTipoVehiculo(vehicleTypeComboOption);
    }

    if(resp.respConceptsVisit.data.length==1){
      setConcepto(resp.respConceptsVisit.data[0]);
    }

    let editControlVisitaObj = {
      'control-visita-persona-visita': '',
      'control-visita-observacion': '',
      'control-visita-placa': '',
    };

    if(controlVisita.placa){
      editControlVisitaObj['control-visita-placa'] = controlVisita.placa;
    }

    if(controlVisita.observacion){
      editControlVisitaObj['control-visita-observacion-visita-previa'] = controlVisita.observacion;
    }
    
    if(controlVisita.persona_visitante){
      editControlVisitaObj['control-visita-persona-visita'] = controlVisita.persona_visitante;
    }
    
    validation.setValues(editControlVisitaObj);

    setSearchVisitor('');
    setDataSearchVisitors([]);
  };

  
  const [hasCamera, setHasCamera] = useState(false);
  const webcamRef = useRef(null);

  const checkCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasCamera(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (error) {
      setHasCamera(false);
      document.getElementById('fileInput').click();
    }
  };

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = dataURItoBlob(imageSrc);
    const imageFile = new File([blob], 'captured_photo.png', { type: 'image/png' });

    setVisitorImage(imageFile);

    setHasCamera(false);
  };

  const handleButtonClick = () => {
    checkCamera();
  };

  const dataURItoBlob = dataURI => {
    const byteString = atob(dataURI.split(',')[1]);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  };
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Control de Ingresos" />
          <Row>
              <Col xxl={dataSearchVisitors.length?7:9} lg={dataSearchVisitors.length?7:9}>
                  <div className="position-relative">
                      <Input 
                        type="text" 
                        className="form-control" 
                        value={searchVisitor} 
                        disabled={editControlVisitaId} 
                        onChange={search=>setSearchVisitor(search.target.value)} 
                        onKeyDown={e=>(e.key=='Enter')&&searchVisitors()} 
                        placeholder="Busca por nombres, placa, número de inmueble, fecha, observación" 
                      />
                  </div>
              </Col>

              <Col xxl={3} lg={3}>
                  <div className="position-relative h-100 hstack gap-3">
                      <button type="submit" onClick={()=>searchVisitors()} className="btn btn-primary h-100 w-100"><i className="bx bx-search-alt align-middle"></i> Busca en libro de visitas autorizadas</button>
                  </div>
              </Col>

              {dataSearchVisitors.length>0&&(<Col xxl={2} lg={2}>
                  <div className="position-relative h-100 hstack gap-3">
                      <button type="submit" onClick={()=>cacelSearchVisitors()} className="btn btn-info h-100 w-100"><i className="bx bxs-user-rectangle align-middle"></i> Ingreso manual</button>
                  </div>
              </Col>)}
          </Row>
          {(dataSearchVisitors.length>0 || subLoadingText!="")&&(<br />)}
          <Row>
            {subLoadingText!="" && (<Row>
              <Col xl={12}>
                <Card>
                  <Row>
                    <Col md={12} style={{textAlign: 'center'}}>
                      <br />
                      <Spinner className="ms-12" color="dark" />
                      <br />
                      <br />
                      <span>{subLoadingText}</span>
                      <br />
                      <br />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>)}
            {dataSearchVisitors.map((visitor,index)=>(
              <Col xl={4}  key={index}>
                <Card>
                {(visitor.tipoPatern=='PROPIETARIO'||visitor.tipoPatern=='INQUILINO')&&(<Row>
                    <Col sm="12">
                      <div class="modal-header system" style={{padding: 10, borderRadius: '15px 15px 0 0'}}>
                        <h7 class="modal-title text-white" id="staticBackdropLabel" style={{fontWeight: 'normal'}}><b>{visitor.tipoPatern}:</b> {visitor.nombre}</h7>
                      </div>
                    </Col>
                  </Row>)}

                  <CardBody className="pt-0">

                      <Row>
                      <Col sm="4">
                        <br />
                        <div className="avatar-xl mb-4">
                          {
                            ['VISITANTE','PROPIETARIO','INQUILINO'].indexOf(visitor.tipoPatern)>=0 || visitor.avatar ?
                              (
                                visitor.avatar ?
                                (<img
                                  src={(process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+(`/uploads/${visitor.tipoPatern=='VEHICULO'?'vehicles':'avatar'}/`)+visitor.avatar}
                                  alt=""
                                  style={{height: "130px"}}
                                  className="img-thumbnail"
                                />)
                                :
                                (<i className={"bx bx-user-pin ms-1 font-size-100"}></i>)
                              )
                            :
                              (<i className={"mdi ms-1 font-size-100 "+(visitor?.tipoText=="CARRO"?"mdi-car-hatchback":"mdi-motorbike")}></i>)
                          }
                        </div>
                        <Row>
                          <Col xs="12">
                            <p className="text-muted mb-0">{visitor.zonaText} - {visitor.numero_interno_unidad}</p>
                          </Col>
                        </Row>
                        
                        {(visitor.tipoPatern=='VISITANTE'||visitor.tipoPatern=='VEHICULO')&&(<>
                          <br />
                          <Row>
                            <Col xs="12">
                              <Button className="btn btn-primary  btn-sm" color="primary" onClick={()=>startAccessControlFT(visitor)}>
                                Iniciar Ingreso <i className="mdi mdi-arrow-right ms-1"></i>
                              </Button>
                            </Col>
                          </Row>
                        </>)}
                       
                        <br />
                        
                      </Col>

                      <Col sm="8">
                        <div className="pt-4">
                          <Row>
                            <Col xs="12">
                              <b className="text-muted mb-0 text-truncate"><u>{visitor.tipoPatern}</u></b>
                              <h5 className="font-size-14">{
                                  visitor.tipoPatern=='VISITANTE'
                                ?
                                  (visitor.persona_visitante||'-')
                                :
                                  (
                                    visitor.tipoPatern=='VEHICULO' ? 
                                      (visitor?.tipoText+" - "+visitor?.placa)
                                    :
                                      visitor.nombre
                                  )
                                }</h5>
                            </Col>
                          </Row>
                          <br />
                          {(visitor.tipoPatern=='VISITANTE'||visitor.tipoPatern=='VEHICULO')&&(<>
                            <Row>
                              <Col xs="12">
                                <p className="text-muted mb-0">Autorizado por</p>
                                <h5 className="font-size-14">{visitor.personaAutorizaText}</h5>
                              </Col>
                            </Row>
                            <br />
                            <Row>
                            <Col xs="12">
                                {
                                  !visitor.fecha_autoriza ?
                                  (<Col xs="12">
                                    <p className="text-muted mb-0">Días autorizados</p>
                                    <h5 className="font-size-14">{visitor.diasText}</h5>
                                  </Col>)
                                  :
                                  (<Col xs="12">
                                    <p className="text-muted mb-0">Fecha autorizada</p>
                                    <h5 className="font-size-14">{visitor.fecha_autoriza?.split("T")[0]||'-'}</h5>
                                  </Col>)
                                }
                              </Col>
                            </Row>
                            <br />
                            <Row>
                              <Col xs="12">
                                <p className="text-muted mb-0">Observación</p>
                                <h5 className="font-size-14">{visitor.observacion}</h5>
                                <hr />
                                <b className="mb-0 font-size-12" style={{color:visitor.diaAutorizado?'green':'red'}}>{visitor.diaAutorizado?'HOY ESTÁ AUTORIZADO':'HOY NO ESTÁ AUTORIZADO'}</b> 
                              </Col>
                            </Row>
                          </>)}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
          <br />
          
          {!dataSearchVisitors.length&&!subLoadingText.length&&(<>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editControlVisitaId===false ? 'Nueva Visita' : 'Editando Visita'}</CardTitle>
                    
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
                                      <label className="col-md-12 col-form-label">Inmueble</label>
                                      <div className="col-md-12">
                                        <RemoteCombo 
                                          value={inmueble}
                                          disabled={dataProperties.length?false:true}
                                          data={dataProperties}
                                          onChange={(val)=>{ changeAccessProperty(val) } }
                                        />
                                      </div>
                                  </Col>
                                  <Col md={2}>
                                      <label className="col-md-12 col-form-label">Zona *</label>
                                      <div className="col-md-12">
                                        <RemoteCombo 
                                          value={zona}
                                          data={dataZones}
                                          disabled={(inmueble?.value||!dataZones.length)}
                                          onChange={(val)=>setZona(val)}
                                        />
                                      </div>
                                  </Col>
                                  <Col md={2}>
                                      <label className="col-md-12 col-form-label">Concepto Visita *</label>
                                      <div className="col-md-12">
                                        <RemoteCombo 
                                          value={concepto}
                                          data={dataConceptsVisit}
                                          onChange={(val)=>setConcepto(val)}
                                        />
                                      </div>
                                  </Col>
                                  <Col md={5}>
                                      <label className="col-md-12 col-form-label">Persona Autoriza</label>
                                      <div className="col-md-12">
                                        <RemoteCombo 
                                          value={personaAutoriza}
                                          data={dataPropertyOwnersRenters}
                                          disabled={!inmueble?.value}
                                          onChange={(val)=>setPersonaAutoriza(val)}
                                        />
                                      </div>
                                  </Col>
                              </Row>
                              <Row>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Persona Visitante *</label>
                                    <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="control-visita-persona-visita"
                                          onBlur={validation.handleBlur}
                                          onChange={validation.handleChange}
                                          value={validation.values['control-visita-persona-visita'] || ""}
                                          invalid={
                                            validation.touched['control-visita-persona-visita'] && validation.errors['control-visita-persona-visita'] && !validation.values['control-visita-persona-visita'] ? true : false
                                          }
                                        />
                                        {validation.touched['control-visita-persona-visita'] && validation.errors['control-visita-persona-visita'] && !validation.values['control-visita-persona-visita'] ? (
                                          <FormFeedback type="invalid">{validation.errors['control-visita-persona-visita']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Tipo Vehículo Visitante</label>
                                  <div className="col-md-12">
                                    <RemoteCombo 
                                      value={tipoVehiculo}
                                      data={dataVehicleTypes}
                                      onChange={(val)=>setTipoVehiculo(val)}
                                    />
                                  </div>
                                </Col>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Placa Vehículo Visitante</label>
                                  <div className="col-md-12">
                                      <input
                                          className="form-control"
                                          name="control-visita-placa"
                                          value={validation.values['control-visita-placa'] || ""}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          type="text"
                                          />
                                  </div>
                                </Col>
                                <Col md={5}>
                                    <label className="col-md-12 col-form-label">Observación visita previamente autorizada</label>
                                    <div className="col-md-12">
                                        <input
                                            className="form-control"
                                            name="control-visita-observacion-visita-previa"
                                            readOnly={true}
                                            value={validation.values['control-visita-observacion-visita-previa'] || ""}
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            type="text"
                                            />
                                    </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Número Documento Visitante</label>
                                    <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          name="control-visita-persona-visita-cedula"
                                          onBlur={validation.handleBlur}
                                          onChange={validation.handleChange}
                                          value={validation.values['control-visita-persona-visita-cedula'] || ""}
                                          invalid={
                                            validation.touched['control-visita-persona-visita-cedula'] && validation.errors['control-visita-persona-visita-cedula'] && !validation.values['control-visita-persona-visita-cedula'] ? true : false
                                          }
                                        />
                                        {validation.touched['control-visita-persona-visita-cedula'] && validation.errors['control-visita-persona-visita-cedula'] && !validation.values['control-visita-persona-visita-cedula'] ? (
                                          <FormFeedback type="invalid">{validation.errors['control-visita-persona-visita-cedula']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <label className="col-md-12 col-form-label">Observación ingreso *</label>
                                    <div className="col-md-12">
                                        <Input
                                          type="text"
                                          className="form-control"
                                          onBlur={validation.handleBlur}
                                          onChange={validation.handleChange}
                                          name="control-visita-observacion"
                                          value={validation.values['control-visita-observacion'] || ""}
                                          invalid={
                                            validation.touched['control-visita-observacion'] && validation.errors['control-visita-observacion'] && !validation.values['control-visita-observacion'] ? true : false
                                          }
                                        />
                                        {validation.touched['control-visita-observacion'] && validation.errors['control-visita-observacion'] && !validation.values['control-visita-observacion'] ? (
                                          <FormFeedback type="invalid">{validation.errors['control-visita-observacion']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                
                                {editControlVisitaId===false&&(<Col md={3}>
                                    <label className="col-md-12 col-form-label">Anexar Foto</label>
                                    <div className="col-md-12">
                                      <Dropzone onDrop={imageFile => setVisitorImage(imageFile[0])}>
                                        {({ getRootProps, getInputProps }) => (
                                          <div>
                                            <Button color={'primary'} {...getRootProps()} className="btn-m" onClick={handleButtonClick}>
                                              <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
                                              {(visitorImage ? 'Cambiar foto' : 'Seleccionar foto')}
                                            </Button>
                                          </div>
                                        )}
                                      </Dropzone>
                                    </div>
                                    <br />
                                    {visitorImage&&(<img src={URL.createObjectURL(visitorImage)} style={{height: '120px', width: '120px'}} />)}
                                </Col>)}
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
                                        <Button type="submit" color="primary">
                                          Grabar
                                        </Button>
                                        {" "}
                                        <Button type="reset" color="warning" onClick={cancelControlVisita} >
                                          Cancelar
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
            </Row>

            {
              !loadingGrid && !loadingText ?
              (
                <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                  <TableContainer
                      columns={columns}
                      data={dataControlVisits}
                      isGlobalFilter={true}
                      isAddOptions={false}
                      customPageSize={10}
                      customPageSizeOptions={true}
                      className="custom-header-css"
                  />
                </div>
              )
            :
              (<Row>
                <Col xl={12}>
                  <Card>
                    <Row>
                      <Col md={12} style={{textAlign: 'center'}}>
                        {
                          loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando visita..." ?
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
          </>)}
        </Container>
      </div>
      
      {/*MODAL VER FOTO*/}
      <Modal
        isOpen={(currentVisitor?true:false)}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Foto visita: {currentVisitor.inmuebleText} {currentVisitor.fecha_ingreso}</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setCurrentVisitor(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body text-center">
          <img
            data-dz-thumbnail=""
            className="avatar-xxl rounded bg-light"
            src={currentVisitor.IMAGE_URL}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setCurrentVisitor(false);
          }}>OK</button>
        </div>
      </Modal>
      {/*MODAL VER FOTO*/}
      
      {/*MODAL CAPTURAR FOTO*/}
      <Modal
        isOpen={hasCamera}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Capturar foto</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setHasCamera(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Webcam
            audio={false}
            width={'100%'}
            ref={webcamRef}
            screenshotFormat="image/png"
            className="webcam-preview"
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            capturePhoto();
          }}>CAPTURAR</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setHasCamera(false);
          }}>CANCELAR</button>
        </div>
      </Modal>
      {/*MODAL CAPTURAR FOTO*/}

      {/*MODAL ELIMINAR VISITA*/}
      <Modal
        isOpen={confirmModalEliminarControlVisita}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarControlVisita(false);
              setConfirmModalEliminarControlVisita(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar la visita <b>{(confirmEliminarControlVisita!==false ? confirmEliminarControlVisita.id : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteControlVisitaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarControlVisita(false);
            setConfirmModalEliminarControlVisita(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ELIMINAR VISITA*/}
      
      <ModalConfirmAction 
        confirmModal={(warningControlAccess?true:false)}
        error={true}
        onYes={() => {
          loadControlVisitas((resp)=>{
            let warningControlAccessH = warningControlAccess;
            setWarningControlAccess(false);
            startAccessControl(warningControlAccessH, resp);
          });
        }}
        title={"¡ATENCIÓN!"}
        onClose={() => {      
          setWarningControlAccess(false);
        }}
        description={`Esta persona no tiene autorización el dia de hoy. ¿Desea continuar con el ingreso?`}
      />
    </React.Fragment>
  );
};

export default withRouter(IndexVisitas);

IndexVisitas.propTypes = {
  history: PropTypes.object,
};