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
  FormFeedback,
  Spinner
} from "reactstrap";

import Select from "react-select";
import Dropzone from "react-dropzone";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getPropertyOwnersRenters, createPropertyOwnerRenter, editPropertyOwnerRenter, deletePropertyOwnerRenter, getPersons, uploadPhotoPerson } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";


const IndexInmuebleInquilinoPropietario = props => {  

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataPropertyOwnersRenters } = useSelector(state => ({
    loading: state.PropertyOwnersRenters.loading,
    dataPropertyOwnersRenters: state.PropertyOwnersRenters.propertyOwnersRenters,
    loadingGrid: state.PropertyOwnersRenters.loadingGrid
  }));

  const initialValuesInmuebleInquilinoPropietarioForm = {
    'inqui-prop-id-persona': '',
    'inqui-prop-porcentaje-administracion': '',
    'inqui-prop-paga-administracion': '',
    'inqui-prop-enviar-notificaciones': '',
    'inqui-prop-enviar-notificaciones-mail': '',
    'inqui-prop-enviar-notificaciones-fisica': ''
  };
  
  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  
  const [persona, setPersona] = useState(null);
  const [personasErp, setPersonasErp] = useState(null);
  const [propsInquiDataTable, setPropsInquiDataTable] = useState(null);
  const [uploadInmuebleInquilinoPropietarioModal, setUploadInmuebleInquilinoPropietarioModal] = useState(null);
  const [tipo, setTipo] = useState({ label: "PROPIETARIO", value: "0" });
  const [notificaciones, setNotificaciones] = useState({ label: "NO", value: "0" });
  const [notificacionesMail, setNotificacionesMail] = useState({ label: "NO", value: "0" });
  const [notificacionesFisica, setNotificacionesFisica] = useState({ label: "NO", value: "0" });
  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  const [editPersonPhoto, setEditPersonPhoto] = useState(false);

  const [registerNuevoInmuebleInquilinoPropietario, setRegisterNuevoInmuebleInquilinoPropietario] = useState(false);
  const [editInmuebleInquilinoPropietarioId, setEditInmuebleInquilinoPropietario] = useState(false);
  const [confirmEliminarInmuebleInquilinoPropietario, setConfirmEliminarInmuebleInquilinoPropietario] = useState(false);
  const [confirmModalEliminarInmuebleInquilinoPropietario, setConfirmModalEliminarInmuebleInquilinoPropietario] = useState(false);

  const editInmuebleInquilinoPropietarioFn = (inmuebleInquilinoPropietario)=>{
    let fieldName = '';
    let fieldValue = '';
    let editInmuebleInquilinoPropietarioObj = {};

    Object.entries(inmuebleInquilinoPropietario).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');
      fieldName = `inqui-prop-${fieldName}`;
      editInmuebleInquilinoPropietarioObj[fieldName] = fieldValue;

      fieldName = '';
      fieldValue = '';
    });

    setEditInmuebleInquilinoPropietario(Number(inmuebleInquilinoPropietario.id));

    setLoadingText('Editando Inmueble Propietario/Inquilino...');
    
    validation.setValues(editInmuebleInquilinoPropietarioObj);

    setRegisterNuevoInmuebleInquilinoPropietario(true);

    setPersona({ label: inmuebleInquilinoPropietario.personaText, value: inmuebleInquilinoPropietario.id_persona });
    setTipo({ label: (inmuebleInquilinoPropietario.tipo==0 ? "PROPIETARIO" : "INQUILINO"), value: inmuebleInquilinoPropietario.tipo });
    setNotificaciones({ label: (inmuebleInquilinoPropietario.enviar_notificaciones==0 ? "NO" : "SI"), value: inmuebleInquilinoPropietario.enviar_notificaciones });
    setNotificacionesMail({ label: (inmuebleInquilinoPropietario.enviar_notificaciones_mail==0 ? "NO" : "SI"), value: inmuebleInquilinoPropietario.enviar_notificaciones_mail });
    setNotificacionesFisica({ label: (inmuebleInquilinoPropietario.enviar_notificaciones_fisica==0 ? "NO" : "SI"), value: inmuebleInquilinoPropietario.enviar_notificaciones_fisica });
  };

  const deleteInmuebleInquilinoPropietarioModal = (InmuebleInquilinoPropietario)=>{
    setConfirmEliminarInmuebleInquilinoPropietario(InmuebleInquilinoPropietario);
    setConfirmModalEliminarInmuebleInquilinoPropietario(true);
  };
  
  const deleteInmuebleInquilinoPropietarioConfirm = ()=>{
    cancelInmuebleInquilinoPropietario();
    setConfirmEliminarInmuebleInquilinoPropietario(false);
    setConfirmModalEliminarInmuebleInquilinoPropietario(false);
    

    setLoadingText('Eliminando Inmueble Propietario/Inquilino...')

    dispatch(deletePropertyOwnerRenter(confirmEliminarInmuebleInquilinoPropietario.id, ()=>{
      cancelInmuebleInquilinoPropietario();
      loadInmuebleInquilinoPropietario();
      toastr.success("Propietario/Inquilino eliminado.", "Operación Ejecutada");
    }));
  };

  const [selectedFiles, setselectedFiles] = useState([]);

  const handleAcceptedFiles = (files)=>{
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size)
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

  const uploadPhotoOwnerRental = async ()=>{
    if(selectedFiles.length){
      const photoPropertyOwnerRenter = new FormData();
      photoPropertyOwnerRenter.append('photo', selectedFiles[0]);
      photoPropertyOwnerRenter.append('peso', selectedFiles[0].size);
      photoPropertyOwnerRenter.append('tipo', selectedFiles[0].type);
      photoPropertyOwnerRenter.append('id', editPersonPhoto);
      
      setLoadingPhoto(true);

      dispatch(uploadPhotoPerson(photoPropertyOwnerRenter, (response)=>{
        setLoadingPhoto(false);

        if(response.success){
          loadInmuebleInquilinoPropietario();
          cancelUploadPhotoOwnerRental();
          toastr.success("La foto ha sido actualizada.", "Operación Ejecutada");
        }else{
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }else{
      toastr.error("Seleccione una imágen", "Error en la validación");
    }
  };

  const cancelUploadPhotoOwnerRental = ()=>{
    setselectedFiles([]);
    setEditPersonPhoto(false);
    setUploadInmuebleInquilinoPropietarioModal(false);
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesInmuebleInquilinoPropietarioForm,
    validationSchema: Yup.object({
      'inqui-prop-porcentaje-administracion': Yup.number().required("Por favor ingresa el porcentaje de administración")
    }),
    onSubmit: (values) => {
      
      let inmuebleInquilinoPropietarioValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('inqui-prop-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","avatar"].indexOf(fieldName)<0){
          inmuebleInquilinoPropietarioValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!persona){
        toastr.error("Seleccione una persona", "Error en la validación");
        return;
      }
      
      inmuebleInquilinoPropietarioValues["id_inmueble"] = props.editInmuebleId;
      inmuebleInquilinoPropietarioValues["id_persona"] = persona.value;
      inmuebleInquilinoPropietarioValues["tipo"] = tipo.value;
      inmuebleInquilinoPropietarioValues["enviar_notificaciones"] = notificaciones.value;
      inmuebleInquilinoPropietarioValues["enviar_notificaciones_mail"] = notificacionesMail.value;
      inmuebleInquilinoPropietarioValues["enviar_notificaciones_fisica"] = notificacionesFisica.value;
      inmuebleInquilinoPropietarioValues["paga_administracion"] = (Number(validation.values['inqui-prop-porcentaje-administracion']) > 0 ? 1 : 0);
      
      setLoadingText("Guardando ...");
      
      if(!editInmuebleInquilinoPropietarioId){
        dispatch(createPropertyOwnerRenter(inmuebleInquilinoPropietarioValues, (response)=>{
          if(response.success){
            cancelInmuebleInquilinoPropietario();
            loadInmuebleInquilinoPropietario();
            toastr.success("Nuevo Propietario/Inquilino.", "Operación Ejecutada");
          }else{
            setLoadingText('Creando Inmueble Propietario/Inquilino...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editPropertyOwnerRenter(inmuebleInquilinoPropietarioValues, (response)=>{
          if(response.success){
            cancelInmuebleInquilinoPropietario();
            loadInmuebleInquilinoPropietario();
            toastr.success("Propietario/Inquilino editado.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando Inmueble Propietario/Inquilino...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelInmuebleInquilinoPropietario = ()=>{
    setLoadingText(false);
    setEditInmuebleInquilinoPropietario(false);
    validation.handleReset();
    setRegisterNuevoInmuebleInquilinoPropietario(false);

    setTipo({ label: "PROPIETARIO", value: "0" });
    setNotificaciones({ label: "NO", value: "0" });
    setPersona(null);
  };

  const columnsPropietariosInquilinos = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: row => (<p className="text-center">{row.operaciones}</p>)
          },
          {
            Header: 'Foto',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'http://localhost:3002')+"/uploads/avatar/"+row.avatar;
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
              Header: 'Tipo',
              accessor: 'tipoText',
          },
          {
              Header: 'Nombre',
              accessor: 'personaText',
          },
          {
              Header: '% Admon',
              accessor: 'porcentaje_administracion',
          },
          {
              Header: 'Notificaciones PUSH',
              accessor: 'notificacionesText',
          },
          {
              Header: 'Notificaciones Mail',
              accessor: row => (Number(row.enviar_notificaciones_mail) ? 'SI' : 'NO')
          },
          {
              Header: 'Notificaciones Físicas',
              accessor: row => (Number(row.enviar_notificaciones_fisica) ? 'SI' : 'NO')
          }
      ],
      []
  );

  const withButtons = (inmuebleInquilinoPropietario)=>{
    return (<>
      <Button color="primary" className="btn-sm" onClick={()=>{editInmuebleInquilinoPropietarioFn(inmuebleInquilinoPropietario)}}> 
          <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Editar</span>
      </Button>
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteInmuebleInquilinoPropietarioModal(inmuebleInquilinoPropietario)}}> 
          <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Eliminar</span>
      </Button>
      {' '}
      <Button className="btn btn-info btn-sm" onClick={async ()=>{
        setEditPersonPhoto(Number(inmuebleInquilinoPropietario.id_persona));
        setUploadInmuebleInquilinoPropietarioModal(true);

        if(inmuebleInquilinoPropietario.avatar){
          const IMAGE_URL = (process.env.REACT_API_URL||'http://localhost:3002')+"/uploads/avatar/"+inmuebleInquilinoPropietario.avatar;
          const response = await fetch(IMAGE_URL);
          const blob = await response.blob();
          const fileType = blob.type;
          const file = new File([blob], inmuebleInquilinoPropietario.avatar, { type: fileType });

          handleAcceptedFiles([file]);
        }

      }}>
        <i className="bx bx-camera font-size-14 align-middle el-mobile"></i>
        <span className="el-desktop">{inmuebleInquilinoPropietario.avatar ? 'Ver/Editar Foto' : 'Subir Foto'}</span></Button>
    </>);
  };

  const loadInmuebleInquilinoPropietario = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPropertyOwnersRenters(withButtons, (persons)=>{ 
      dispatch(getPersons(null, (dPersons)=>{ 
        setPersonasErp(dPersons);
        
        setPropsInquiDataTable(persons);
        
        setLoadingText('');

        if(props.onLoad) props.onLoad(persons);
      },true));
    }, props.editInmuebleId));
  };

  useEffect(()=>{
    loadInmuebleInquilinoPropietario();
  },[]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          {/*DATATABLE PROPIETARIOS INQUILINOS*/}
            <Button color="primary" onClick={()=>{
                setLoadingText('Creando Inmueble Propietario/Inquilino...');
                setRegisterNuevoInmuebleInquilinoPropietario(true);
            }}>
                Nuevo
            </Button>
            <br />
            <br />
            {
              !loadingGrid && !loadingText ?
                (<TableContainer
                    columns={columnsPropietariosInquilinos}
                    data={propsInquiDataTable}
                    isGlobalFilter={false}
                    removePagination={true}
                    isAddOptions={false}
                    customPageSize={10}
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
                            loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando inmueble inquilino/propietario..." ?
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
          {/*DATATABLE PROPIETARIOS INQUILINOS*/}
        </Col>
      </Row>

      {/*MODAL FORM PROPIETARIO INQUILINO*/}
      <Modal
        isOpen={registerNuevoInmuebleInquilinoPropietario}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{editInmuebleInquilinoPropietarioId===false ? 'Nuevo' : 'Editando'} Propietario/Inquilino</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              cancelInmuebleInquilinoPropietario();
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM PROPIETARIO INQUILINO*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validation.submitForm();

                return false;
              }}>
              <Row>
                  <Col md={6}>
                      <label className="col-md-12 col-form-label">Persona * <span className="text-muted m-b-15">
                        (Sólo personas con <code>Número de Documento</code>.)
                      </span></label>
                      
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={persona}
                          data={personasErp}
                          onChange={(val)=>setPersona(val)}
                        />
                      </div>
                  </Col>
                  <Col md={6}>
                      <label className="col-md-12 col-form-label">Tipo *</label>
                      <div className="col-md-12">
                      <Select
                        value={tipo}
                        onChange={value=>setTipo(value)}
                        options={[
                          { label: "PROPIETARIO", value: "0" },
                          { label: "INQUILINO", value: "1" }
                        ]}
                        className="select2-selection"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors
                            },
                        })}
                      />
                      </div>
                  </Col>
              </Row>
              <Row>
                  <Col md={6}>
                      <label className="col-md-12 col-form-label">% Administracion *</label>
                      <div className="col-md-12">
                        <Input
                          type="numeric"
                          className="form-control"
                          name="inqui-prop-porcentaje-administracion"
                          value={validation.values['inqui-prop-porcentaje-administracion'] || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched['inqui-prop-porcentaje-administracion'] && validation.errors['inqui-prop-porcentaje-administracion'] && !validation.values['inqui-prop-porcentaje-administracion'] ? true : false
                          }
                        />
                        {validation.touched['inqui-prop-porcentaje-administracion'] && validation.errors['inqui-prop-porcentaje-administracion'] && !validation.values['inqui-prop-porcentaje-administracion'] ? (
                          <FormFeedback type="invalid">{validation.errors['inqui-prop-porcentaje-administracion']}</FormFeedback>
                        ) : null}
                      </div>
                  </Col>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Notificación PUSH *</label>
                      <div className="col-md-12">
                      <Select
                        value={notificaciones}
                        onChange={value=>setNotificaciones(value)}
                        options={[
                          { label: "SI", value: "1" },
                          { label: "NO", value: "0" }
                        ]}
                        className="select2-selection"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors
                            },
                        })}
                      />
                      </div>
                  </Col>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Notificación Mail *</label>
                      <div className="col-md-12">
                      <Select
                        value={notificacionesMail}
                        onChange={value=>setNotificacionesMail(value)}
                        options={[
                          { label: "SI", value: "1" },
                          { label: "NO", value: "0" }
                        ]}
                        className="select2-selection"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors
                            },
                        })}
                      />
                      </div>
                  </Col>
                  <Col md={2}>
                      <label className="col-md-12 col-form-label">Notificación Física *</label>
                      <div className="col-md-12">
                      <Select
                        value={notificacionesFisica}
                        onChange={value=>setNotificacionesFisica(value)}
                        options={[
                          { label: "SI", value: "1" },
                          { label: "NO", value: "0" }
                        ]}
                        className="select2-selection"
                        theme={(theme) => ({
                            ...theme,
                            borderRadius: 0,
                            colors: {
                              ...theme.colors
                            },
                        })}
                      />
                      </div>
                  </Col>
              </Row>
              <br />
              <Row>
                <Col md={9}>
                </Col>
                <Col md={3} className="text-end">
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
                        <Button type="reset" color="warning" onClick={cancelInmuebleInquilinoPropietario} >
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
        {/*FORM PROPIETARIO INQUILINO*/}
        </div>
      </Modal>
      {/*MODAL FORM PROPIETARIO INQUILINO*/}

      {/*MODAL DELETE PROPIETARIO INQUILINO*/}
      <Modal
        isOpen={confirmModalEliminarInmuebleInquilinoPropietario}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarInmuebleInquilinoPropietario(false);
              setConfirmModalEliminarInmuebleInquilinoPropietario(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el inquilino/propietario <b>{(confirmEliminarInmuebleInquilinoPropietario!==false ? confirmEliminarInmuebleInquilinoPropietario.personaText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteInmuebleInquilinoPropietarioConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarInmuebleInquilinoPropietario(false);
            setConfirmModalEliminarInmuebleInquilinoPropietario(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE PROPIETARIO INQUILINO*/}


      {/*MODAL UPLOAD PHOTO*/}
      <Modal
        isOpen={uploadInmuebleInquilinoPropietarioModal}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Carga Foto</h5>
          <button type="button" className="btn-close"
            onClick={() => cancelUploadPhotoOwnerRental()} aria-label="Close"></button>
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
          <button type="button" className="btn btn-primary" onClick={() => uploadPhotoOwnerRental()}>Subir</button>
          <button type="button" className="btn btn-light" onClick={() => cancelUploadPhotoOwnerRental()}>Cancelar</button>
        </div>):(<></>)}
      </Modal>
      {/*MODAL UPLOAD PHOTO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexInmuebleInquilinoPropietario);

IndexInmuebleInquilinoPropietario.propTypes = {
  history: PropTypes.object,
};