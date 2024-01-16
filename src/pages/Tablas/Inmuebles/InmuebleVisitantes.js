import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Input,
  Modal,
  Spinner
  
} from "reactstrap";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";
import Dropzone from "react-dropzone";

// Formik validation
import { useFormik } from "formik";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getPropertyVisitors, createPropertyVisitor, editPropertyVisitor, deletePropertyVisitor, getPropertyOwnersRenters, uploadPhotoPerson } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexInmuebleVisitantes = props => {

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataPropertyVisitors } = useSelector(state => ({
    loading: state.PropertyVisitors.loading,
    dataPropertyVisitors: state.PropertyVisitors.propertyVisitors,
    loadingGrid: state.PropertyVisitors.loadingGrid
  }));

  const initialValuesInmuebleVisitante = {
    'visitante-persona-visitante': '',
    'visitante-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };


  
  const [persona, setPersona] = useState(null);
  const [inmueblePropInqui, setInmueblePropInqui] = useState(null);
  const [personaAutoriza, setPersonaAutoriza] = useState(null);
  const [loadingText, setLoadingText] = useState('Cargando ...');


  const [daysChecked, setDaysChecked] = useState(0);
  const [registerNuevoInmuebleVisitante, setRegisterNuevoInmuebleVisitante] = useState(false);
  const [editInmuebleVisitanteId, setEditInmueblevisitante] = useState(false);
  const [confirmEliminarInmuebleVisitante, setConfirmEliminarInmuebleVisitante] = useState(false);
  const [confirmModalEliminarInmuebleVisitante, setConfirmModalEliminarInmuebleVisitante] = useState(false);

  const editInmuebleVisitanteFn = async (inmuebleVisitante)=>{
    dispatch(getPropertyOwnersRenters(null, (persons)=>{
      let newPersons = [];
      
      persons.map((person)=>newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}`, value: person.id_persona}));
      
      setInmueblePropInqui(newPersons);

      let fieldName = '';
      let fieldValue = '';
      let editInmuebleVisitanteObj = {};

      Object.entries(inmuebleVisitante).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');

        if(fieldName=="fecha-autoriza"&&fieldValue){
          fieldValue = fieldValue.split("T")[0];
        }

        fieldName = `visitante-${fieldName}`;
        editInmuebleVisitanteObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditInmueblevisitante(Number(inmuebleVisitante.id));

      setLoadingText('Editando Inmueble Visitante...');
      
      validation.setValues(editInmuebleVisitanteObj);

      setRegisterNuevoInmuebleVisitante(true);

      setDaysChecked(Number(inmuebleVisitante.dias_autorizados));
      setPersonaAutoriza({ label: inmuebleVisitante.personaAutorizaText, value: inmuebleVisitante.id_persona_autoriza });
    }, props.editInmuebleId));
  };

  const deleteInmuebleVisitanteModal = (InmuebleVisitante)=>{
    setConfirmEliminarInmuebleVisitante(InmuebleVisitante);
    setConfirmModalEliminarInmuebleVisitante(true);
  };
  
  const deleteInmuebleVisitanteConfirm = ()=>{
    cancelInmuebleVisitante();
    setConfirmEliminarInmuebleVisitante(false);
    setConfirmModalEliminarInmuebleVisitante(false);
    

    setLoadingText('Eliminando Inmueble Visitante...')

    dispatch(deletePropertyVisitor(confirmEliminarInmuebleVisitante.id, ()=>{
      cancelInmuebleVisitante();
      loadInmuebleVisitante();
      toastr.success("Visitante eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesInmuebleVisitante,
    onSubmit: (values) => {
      
      let inmuebleVisitanteValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('visitante-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","persona_visitante_avatar","avatar"].includes(fieldName)==false){
          inmuebleVisitanteValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!personaAutoriza){
        toastr.error("Seleccione la persona que autorizó", "Error en la validación");
        return;
      }

      if(!daysChecked&&inmuebleVisitanteValues["fecha_autoriza"]==""){
        toastr.error("Marque los días o Fecha específica autorizada para la visita.", "Error en la validación");
        return;
      }
      
      inmuebleVisitanteValues["id_inmueble"] = props.editInmuebleId;
      inmuebleVisitanteValues["id_persona_autoriza"] = personaAutoriza.value;
      inmuebleVisitanteValues["dias_autorizados"] = daysChecked;
      
      setLoadingText("Guardando ...");
      
      if(!editInmuebleVisitanteId){
        dispatch(createPropertyVisitor(inmuebleVisitanteValues, (response)=>{
          if(response.success){
            cancelInmuebleVisitante();
            loadInmuebleVisitante();
            toastr.success("Nuevo Visitante.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editPropertyVisitor(inmuebleVisitanteValues, (response)=>{
          if(response.success){
            cancelInmuebleVisitante();
            loadInmuebleVisitante();
            toastr.success("Visitante editado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelInmuebleVisitante = ()=>{
    setEditInmueblevisitante(false);
    setLoadingText(false);
    validation.handleReset();
    setRegisterNuevoInmuebleVisitante(false);
    
    setDaysChecked(0);
    setPersona(null);
    setPersonaAutoriza(null);
  };

  const columnsVisitante = useMemo(
      () => [
          {
              Header: 'Operaciones',
              sticky: true,
              accessor: row => (<p className="text-center">{row.operaciones}</p>)
          },
          {
            Header: 'Foto',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/avatar/"+row.avatar;
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
              Header: 'Persona Autorizó',
              accessor: 'personaAutorizaText',
          },
          {
              Header: 'Visitante',
              accessor: 'persona_visitante',
          },
          {
              Header: 'Días/Fecha',
              accessor: 'diasText',
          },
          {
              Header: 'Observacion',
              accessor: 'observacion',
          }
      ],
      []
  );


  const [selectedFiles, setselectedFiles] = useState([]);
  const [loadingPhoto, setLoadingPhoto] = useState(false);
  const [editPersonPhoto, setEditPersonPhoto] = useState(false);
  const [uploadInmuebleVisitanteModal, setUploadInmuebleVisitanteModal] = useState(null);

  const handleAcceptedFiles = (files)=>{
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )

    setselectedFiles(files)
  };

  const formatBytes = (bytes, decimals = 2)=>{
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  };

  const uploadPhotoVisitor = async ()=>{
    if(selectedFiles.length){
      const photoPerson = new FormData();
      photoPerson.append('photo', selectedFiles[0]);
      photoPerson.append('peso', selectedFiles[0].size);
      photoPerson.append('tipo', selectedFiles[0].type);
      photoPerson.append('id_visitor', editPersonPhoto);
      
      setLoadingPhoto(true);

      dispatch(uploadPhotoPerson(photoPerson, (response)=>{
        setLoadingPhoto(false);

        if(response.success){
          loadInmuebleVisitante();
          cancelUploadPhotoVisitor();
          toastr.success("La foto ha sido actualizada.", "Operación Ejecutada");
        }else{
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }else{
      toastr.error("Seleccione una imágen", "Error en la validación");
    }
  };

  const cancelUploadPhotoVisitor = ()=>{
    setselectedFiles([]);
    setEditPersonPhoto(false);
    setUploadInmuebleVisitanteModal(false);
  };

  const withButtons = (inmuebleVisitante)=>{
    return (<>
      <Button color="primary" className="btn-sm" onClick={()=>{editInmuebleVisitanteFn(inmuebleVisitante)}}> 
          <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Editar</span>
      </Button>
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteInmuebleVisitanteModal(inmuebleVisitante)}}>
          <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Eliminar</span>
      </Button>
      {' '}
      <Button className="btn btn-info btn-sm" onClick={async ()=>{
        setEditPersonPhoto(Number(inmuebleVisitante.id));
        setUploadInmuebleVisitanteModal(true);

        if(inmuebleVisitante.avatar){
          const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/avatar/"+inmuebleVisitante.avatar;
          const response = await fetch(IMAGE_URL);
          const blob = await response.blob();
          const fileType = blob.type;
          const file = new File([blob], inmuebleVisitante.avatar, { type: fileType });

          handleAcceptedFiles([file]);
        }

      }}>
        <i className="bx bx-camera font-size-14 align-middle el-mobile"></i>
        <span className="el-desktop">{inmuebleVisitante.avatar ? 'Ver/Editar Foto' : 'Subir Foto'}</span>
      </Button>
    </>);
  };

  const loadInmuebleVisitante = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPropertyVisitors(withButtons, ()=>{ 
      setLoadingText('');

    }, props.editInmuebleId));
  };

  const changeDay = (a) => {
    let dayValue = 0;

    switch(a.target.alt){
      case "lunes": dayValue = 1; break;
      case "martes": dayValue = 2; break;
      case "miercoles": dayValue = 4; break;
      case "jueves": dayValue = 8; break;
      case "viernes": dayValue = 16; break;
      case "sabado": dayValue = 32; break;
      case "domingo": dayValue = 64; break;
    }

    if(dayValue>0){
      validation.setFieldValue("visitante-fecha-autoriza", "");
    }

    if(!(daysChecked&dayValue)){
      dayValue = (daysChecked+dayValue);
      setDaysChecked(dayValue);
    }else if((daysChecked&dayValue)){
      dayValue = (daysChecked-dayValue);
      setDaysChecked(dayValue);
    }
  };

  useEffect(()=>{
    loadInmuebleVisitante();
  },[]);

  const newVisitorRegister = async ()=>{
    dispatch(getPropertyOwnersRenters(null, (persons)=>{
      let newPersons = [];
      
      persons.map((person)=>{
        if(props.authDisabled&&(person.email.toLowerCase()==JSON.parse(localStorage.getItem("authUser")).email.toLowerCase())){
          newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}`, value: person.id_persona});
          setPersonaAutoriza(newPersons[0]);
        }else if(!props.authDisabled){
          newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}`, value: person.id_persona});
        }
      });

      setInmueblePropInqui(newPersons);

      setRegisterNuevoInmuebleVisitante(true)
    }, props.editInmuebleId));
  };

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          {/*DATATABLE VISITANTES*/}
            <Button color="primary" onClick={()=>newVisitorRegister()}>
                Nuevo
            </Button>
            <br />
            <br />
            {
              !loadingGrid && !loadingText ?
                (<TableContainer
                    columns={columnsVisitante}
                    data={dataPropertyVisitors}
                    isGlobalFilter={false}
                    isAddOptions={false}
                    customPageSize={1000}
                    removePagination={true}
                    className="custom-header-css"
                />)
              :
                (<Row>
                  <Col xl={12}>
                    <Card>
                      <Row>
                        <Col md={12} style={{textAlign: 'center'}}>
                          <br />
                          <span>{loadingText}</span>
                          <br />
                          {
                            loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando inmueble visitante..." ?
                            (
                              <>
                                <br />
                                <Spinner className="ms-12" color="dark" />
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
          {/*DATATABLE VISITANTES*/}
        </Col>
      </Row>

      {/*MODAL FORM VISITANTE*/}
      <Modal
        isOpen={registerNuevoInmuebleVisitante}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{editInmuebleVisitanteId===false ? 'Nuevo' : 'Editando'} Visitante</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              cancelInmuebleVisitante();
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM VISITANTES*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validation.submitForm();

                return false;
              }}>
                <Row>
                    <Col md={6}>
                      <label className="col-md-12 col-form-label">Persona Autoriza*</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={personaAutoriza}
                          disabled={props.authDisabled}
                          data={inmueblePropInqui}
                          onChange={(val)=>setPersonaAutoriza(val)}
                        />
                      </div>
                    </Col>
                    <Col md={6}>
                      <label className="col-md-12 col-form-label">Visitante*</label>
                      <div className="col-md-12">
                         <Input
                            type="text"
                            className="form-control"
                            name="visitante-persona-visitante"
                            value={validation.values['visitante-persona-visitante'] || ""}
                            onChange={validation.handleChange}
                        />
                      </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                      <label className="col-md-12 col-form-label"></label>
                      <div className="form-check mb-3" style={{paddingLeft: 0}}>
                        <label className="form-check-label">Días recurrentes de visita: </label>
                      </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="lunes"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&1) ? true : false)}
                            id="inmueble-visitante-dia-lunes"
                            name="inmueble-visitante-dia-lunes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-lunes" >
                            Lunes
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="martes"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&2) ? true : false)}
                            id="inmueble-visitante-dia-martes"
                            name="inmueble-visitante-dia-martes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-martes" >
                            Martes
                          </label>
                        </div>
                    </Col>
                    <Col md={1} style={{marginRight: 20}}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="miercoles"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&4) ? true : false)}
                            id="inmueble-visitante-dia-miercoles"
                            name="inmueble-visitante-dia-miercoles"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-miercoles" >
                          Miércoles
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="jueves"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&8) ? true : false)}
                            id="inmueble-visitante-dia-jueves"
                            name="inmueble-visitante-dia-jueves"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-jueves" >
                          Jueves
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="viernes"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&16) ? true : false)}
                            id="inmueble-visitante-dia-viernes"
                            name="inmueble-visitante-dia-viernes"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-viernes" >
                          Viernes
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="sabado"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&32) ? true : false)}
                            id="inmueble-visitante-dia-sabado"
                            name="inmueble-visitante-dia-sabado"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-sabado" >
                          Sábado
                          </label>
                        </div>
                    </Col>
                    <Col md={1}>
                        <label className="col-md-12 col-form-label"></label>
                        <div className="form-check mb-3">
                          <input
                            alt="domingo"
                            className="form-check-input"
                            type="checkbox"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['visitante-fecha-autoriza']}
                            checked={((daysChecked&64) ? true : false)}
                            id="inmueble-visitante-dia-domingo"
                            name="inmueble-visitante-dia-domingo"
                          />
                          <label className="form-check-label" htmlFor="inmueble-visitante-dia-domingo" >
                          Domingo
                          </label>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <label className="col-md-12 col-form-label">Fecha específica de visita</label>
                        <div className="col-md-12">
                          <Input
                            type="date"
                            className="form-control"
                            disabled={daysChecked>0}
                            name="visitante-fecha-autoriza"
                            value={validation.values['visitante-fecha-autoriza'] || ""}
                            onChange={validation.handleChange}
                          />
                        </div>
                    </Col>
                    <Col md={9}>
                        <label className="col-md-12 col-form-label">Observaciones</label>
                        <div className="col-md-12">
                        <Input
                            type="text"
                            className="form-control"
                            name="visitante-observacion"
                            value={validation.values['visitante-observacion'] || ""}
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
                          <Button type="reset" color="warning" onClick={cancelInmuebleVisitante} >
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
        {/*FORM VISITANTES*/}
        </div>
      </Modal>
      {/*MODAL FORM VISITANTE*/}

      {/*MODAL DELETE VISITANTE*/}
      <Modal
        isOpen={confirmModalEliminarInmuebleVisitante}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarInmuebleVisitante(false);
              setConfirmModalEliminarInmuebleVisitante(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el visitante <b>{(confirmEliminarInmuebleVisitante!==false ? confirmEliminarInmuebleVisitante.personaText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteInmuebleVisitanteConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarInmuebleVisitante(false);
            setConfirmModalEliminarInmuebleVisitante(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE VISITANTE*/}

      {/*MODAL UPLOAD PHOTO*/}
      <Modal
        isOpen={uploadInmuebleVisitanteModal}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Carga Foto</h5>
          <button type="button" className="btn-close"
            onClick={() => cancelUploadPhotoVisitor()} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          {
            loadingPhoto ?
              (<Row>
                <Col xl={12}>
                  <Card>
                    <Row>
                      <Col md={12} style={{textAlign: 'center'}}>
                        <br />
                        <span>{'Subiendo Foto...'}</span>
                        <br />
                        <br />
                        <Spinner className="ms-12" color="dark" />
                        <br />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>)
            :
              (<Form>
                <Dropzone
                  onDrop={acceptedFiles => {
                    handleAcceptedFiles(acceptedFiles)
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <div className="dropzone">
                      <div
                        className="dz-message needsclick mt-2"
                        {...getRootProps()}
                      >
                        <input {...getInputProps()} />
                        <div className="mb-3">
                          <i className="display-4 text-muted bx bxs-cloud-upload" />
                        </div>
                        <h4 style={{cursor: 'default'}}><u>Arrasta la foto aquí o <b className="text-primary">PRESIONA CLICK</b> para buscarla.</u></h4>
                      </div>
                    </div>
                  )}
                </Dropzone>
                <div className="dropzone-previews mt-3" id="file-previews">
                  {selectedFiles.map((f, i) => {
                    return (
                      <Card
                        className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                        key={i + "-file"}
                      >
                        <div className="p-2">
                          <Row className="align-items-center">
                            <Col className="col-auto">
                              <img
                                data-dz-thumbnail=""
                                className="avatar-xxl rounded bg-light"
                                alt={f.name}
                                src={f.preview}
                              />
                            </Col>
                            <Col>
                              {f.name}
                              <p className="mb-0">
                                <strong>{f.formattedSize}</strong>
                              </p>
                            </Col>
                          </Row>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </Form>)
          }
        </div>
        {selectedFiles.length?(<div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => uploadPhotoVisitor()}>Subir</button>
          <button type="button" className="btn btn-light" onClick={() => cancelUploadPhotoVisitor()}>Cancelar</button>
        </div>):(<></>)}
      </Modal>
      {/*MODAL UPLOAD PHOTO*/}
    </React.Fragment>
  )
};

export default withRouter(IndexInmuebleVisitantes);

IndexInmuebleVisitantes.propTypes = {
  history: PropTypes.object,
};