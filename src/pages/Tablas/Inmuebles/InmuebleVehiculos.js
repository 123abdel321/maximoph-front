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

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

import Dropzone from "react-dropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getPropertyVehicles, createPropertyVehicle, editPropertyVehicle, deletePropertyVehicle, getPropertyOwnersRenters, getVehicleTypes, uploadPhotoVehicle } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexInmuebleVehiculos = props => {

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataPropertyVehicles, dataVehicleTypes } = useSelector(state => ({
    loading: state.PropertyVehicles.loading,
    dataVehicleTypes: state.VehicleTypes.vehicleTypes,
    dataPropertyVehicles: state.PropertyVehicles.propertyVehicles,
    loadingGrid: state.PropertyVehicles.loadingGrid
  }));

  const initialValuesInmuebleVehiculo = {
    'vehiculo-placa': '',
    'vehiculo-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };
  
  const [tipo, setTipo] = useState(null);
  const [persona, setPersona] = useState(null);
  const [ownersRentals, setOwnersRentals] = useState(null);
  const [loadingText, setLoadingText] = useState('Cargando ...');


  const [daysChecked, setDaysChecked] = useState(0);
  
  
  const [registerNuevoInmuebleVehiculo, setRegisterNuevoInmuebleVehiculo] = useState(false);
  const [editInmuebleVehiculoId, setEditInmueblevehiculo] = useState(false);
  const [confirmEliminarInmuebleVehiculo, setConfirmEliminarInmuebleVehiculo] = useState(false);
  const [confirmModalEliminarInmuebleVehiculo, setConfirmModalEliminarInmuebleVehiculo] = useState(false);

  const editInmuebleVehiculoFn = (inmuebleVehiculo)=>{
    let fieldName = '';
    let fieldValue = '';
    let editInmuebleVehiculoObj = {};

    Object.entries(inmuebleVehiculo).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');

      if(fieldName=="fecha-autoriza"&&fieldValue){
        fieldValue = fieldValue.split("T")[0];
      }

      fieldName = `vehiculo-${fieldName}`;
      editInmuebleVehiculoObj[fieldName] = fieldValue;

      fieldName = '';
      fieldValue = '';
    });

    setEditInmueblevehiculo(Number(inmuebleVehiculo.id));

    setLoadingText('Editando Inmueble Vehiculo...');
    
    validation.setValues(editInmuebleVehiculoObj);

    setRegisterNuevoInmuebleVehiculo(true);

    setDaysChecked(Number(inmuebleVehiculo.dias_autorizados));
    setTipo({ label: inmuebleVehiculo.tipoText, value: inmuebleVehiculo.id_tipo_vehiculo });
    setPersona({ label: inmuebleVehiculo.personaAutorizaText, value: inmuebleVehiculo.id_persona_autoriza });
  };

  const deleteInmuebleVehiculoModal = (InmuebleVehiculo)=>{
    setConfirmEliminarInmuebleVehiculo(InmuebleVehiculo);
    setConfirmModalEliminarInmuebleVehiculo(true);
  };
  
  const deleteInmuebleVehiculoConfirm = ()=>{
    cancelInmuebleVehiculo();
    setConfirmEliminarInmuebleVehiculo(false);
    setConfirmModalEliminarInmuebleVehiculo(false);
    

    setLoadingText('Eliminando Inmueble Vehiculo...')

    dispatch(deletePropertyVehicle(confirmEliminarInmuebleVehiculo.id, ()=>{
      cancelInmuebleVehiculo();
      loadInmuebleVehiculo();
      toastr.success("Vehiculo eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesInmuebleVehiculo,
    validationSchema: Yup.object({
      'vehiculo-placa': Yup.string().required("Por favor ingresa la placa")
    }),
    onSubmit: (values) => {
      
      let inmuebleVehiculoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('vehiculo-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          inmuebleVehiculoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!persona){
        toastr.error("Seleccione la persona que autorizó", "Error en la validación");
        return;
      }

      if(!tipo){
        toastr.error("Seleccione un tipo de vehículo", "Error en la validación");
        return;
      }

      if(!daysChecked&&inmuebleVehiculoValues["fecha_autoriza"]==""){
        toastr.error("Marque los días o Fecha específica autorizada para la visita.", "Error en la validación");
        return;
      }
      
      inmuebleVehiculoValues["id_inmueble"] = props.editInmuebleId;
      inmuebleVehiculoValues["id_tipo_vehiculo"] = tipo.value;
      inmuebleVehiculoValues["id_persona_autoriza"] = persona.value;
      inmuebleVehiculoValues["dias_autorizados"] = daysChecked;
      
      setLoadingText("Guardando ...");
      
      if(!editInmuebleVehiculoId){
        dispatch(createPropertyVehicle(inmuebleVehiculoValues, (response)=>{
          if(response.success){
            cancelInmuebleVehiculo();
            loadInmuebleVehiculo();
            toastr.success("Nuevo Vehiculo.", "Operación Ejecutada");
          }else{
            setLoadingText('Creando Inmueble Vehiculo...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editPropertyVehicle(inmuebleVehiculoValues, (response)=>{
          if(response.success){
            cancelInmuebleVehiculo();
            loadInmuebleVehiculo();
            toastr.success("Vehiculo editado.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando Inmueble Vehiculo...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelInmuebleVehiculo = ()=>{
    setEditInmueblevehiculo(false);
    setLoadingText(false);
    validation.handleReset();
    setRegisterNuevoInmuebleVehiculo(false);
    
    setDaysChecked(0);
    setTipo(null);
  };

  const columnsVehiculos = useMemo(
      () => [
          {
              Header: 'Operaciones',
              sticky: true,
              accessor: row => (<p className="text-center">{row.operaciones}</p>)
          },
          {
            Header: 'Foto',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/vehicles/"+row.avatar;
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
              Header: 'Persona Autoriza',
              accessor: 'personaAutorizaText',
          },
          {
              Header: 'Tipo Vehículo',
              accessor: 'tipoText',
          },
          {
              Header: 'Placa',
              accessor: 'placa',
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
  
  const handleAcceptedFiles = (files)=>{
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )

    setselectedFiles(files)
  };

  const [editVehiculoPhoto, setEditVehiculoPhoto] = useState(false);
  const [uploadFotoInmuebleVehiculoModal, setUploadFotoInmuebleVehiculoModal] = useState(false);

  const cancelUploadPhotoPropertyVehicle = ()=>{
    setselectedFiles([]);
    setEditVehiculoPhoto(false);
    setUploadFotoInmuebleVehiculoModal(false);
  };
  
  const formatBytes = (bytes, decimals = 2)=>{
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  };

  const uploadPhotoPropertyVehicle = async ()=>{
    if(selectedFiles.length){
      const photoVehicle = new FormData();
      photoVehicle.append('photo', selectedFiles[0]);
      photoVehicle.append('peso', selectedFiles[0].size);
      photoVehicle.append('tipo', selectedFiles[0].type);
      photoVehicle.append('id_vehicle', editVehiculoPhoto);
      
      setLoadingPhoto(true);

      dispatch(uploadPhotoVehicle(photoVehicle, (response)=>{
        setLoadingPhoto(false);

        if(response.success){
          loadInmuebleVehiculo();
          cancelUploadPhotoPropertyVehicle();
          toastr.success("La foto ha sido actualizada.", "Operación Ejecutada");
        }else{
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }else{
      toastr.error("Seleccione una imágen", "Error en la validación");
    }
  };

  const withButtons = (inmuebleVehiculo)=>{
    return (<>
      <Button color="success" className="btn-sm" onClick={()=>{editInmuebleVehiculoFn(inmuebleVehiculo)}}> 
          <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop" style={{ color: 'white' }}>Editar</span>
      </Button>
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteInmuebleVehiculoModal(inmuebleVehiculo)}}>
          <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Eliminar</span>
      </Button>
      {' '}
      <Button className="btn btn-info btn-sm" onClick={async ()=>{
        setEditVehiculoPhoto(Number(inmuebleVehiculo.id));
        setUploadFotoInmuebleVehiculoModal(true);

        if(inmuebleVehiculo.avatar){
          const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/vehicles/"+inmuebleVehiculo.avatar;
          const response = await fetch(IMAGE_URL);
          const blob = await response.blob();
          const fileType = blob.type;
          const file = new File([blob], inmuebleVehiculo.avatar, { type: fileType });

          handleAcceptedFiles([file]);
        }

      }}>
        <i className="bx bx-camera font-size-14 align-middle el-mobile"></i>
        <span className="el-desktop">{inmuebleVehiculo.avatar ? 'Ver/Editar Foto' : 'Subir Foto'}</span>
      </Button>
    </>);
  };

  const loadInmuebleVehiculo = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPropertyVehicles(withButtons, ()=>{ 
      dispatch(getPropertyOwnersRenters(null, (ownersRentalsData)=>{ 
        dispatch(getVehicleTypes(null, ()=>{ 
          let newPersons = [];
          
          ownersRentalsData.map((person)=>{

            if(props.authDisabled&&(person.email.toLowerCase()==JSON.parse(localStorage.getItem("authUser")).email.toLowerCase())){
              newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}`, value: person.id_persona});
              setPersona(newPersons[0]);
            }else if(!props.authDisabled){
              newPersons.push({label: `${person.personaDocumento} - ${person.personaText} | ${person.tipoText}`, value: person.id_persona});
            }
          });

          setOwnersRentals(newPersons);

          setLoadingText('');
        }));
      }, props.editInmuebleId));
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
      validation.setFieldValue("vehiculo-fecha-autoriza", "");
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
    loadInmuebleVehiculo();
  },[]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          {/*DATATABLE VEHICULOS*/}
            <Button color="primary" onClick={async ()=>{
              await loadInmuebleVehiculo();
              setLoadingText('Creando Inmueble Vehiculo...');
              setRegisterNuevoInmuebleVehiculo(true);
            }}>
                Nuevo
            </Button>
            <br />
            <br />
            {
              !loadingGrid && !loadingText ?
                (<TableContainer
                    columns={columnsVehiculos}
                    data={dataPropertyVehicles}
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
                            loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando inmueble Vehículo..." ?
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
          {/*DATATABLE VEHICULOS*/}
        </Col>
      </Row>

      {/*MODAL FORM VEHICULO*/}
      {registerNuevoInmuebleVehiculo&&(<Modal
        isOpen={registerNuevoInmuebleVehiculo}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{editInmuebleVehiculoId===false ? 'Nuevo' : 'Editando'} Vehículo</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setLoadingText(false);
              setRegisterNuevoInmuebleVehiculo(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM VEHICULO*/}
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
                            value={persona}
                            data={ownersRentals}
                            disabled={props.authDisabled}
                            onChange={(val)=>setPersona(val)}
                          />
                        </div>
                    </Col>
                    <Col md={3}>
                        <label className="col-md-12 col-form-label">Tipo Vehículo *</label>
                        <div className="col-md-12">
                          <RemoteCombo 
                            value={tipo}
                            data={dataVehicleTypes}
                            onChange={(val)=>setTipo(val)}
                          />
                        </div>
                    </Col>
                    <Col md={3}>
                        <label className="col-md-12 col-form-label">Placa *</label>
                        <div className="col-md-12">
                        <Input
                            type="text"
                            className="form-control"
                            name="vehiculo-placa"
                            value={validation.values['vehiculo-placa'] || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched['vehiculo-placa'] && validation.errors['vehiculo-placa'] && !validation.values['vehiculo-placa'] ? true : false
                            }
                          />
                          {validation.touched['vehiculo-placa'] && validation.errors['vehiculo-placa'] && !validation.values['vehiculo-placa'] ? (
                            <FormFeedback type="invalid">{validation.errors['vehiculo-placa']}</FormFeedback>
                          ) : null}
                        </div>
                    </Col>
                    
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
                            className="form-check-input"
                            type="checkbox"
                            alt="lunes"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            alt="martes"
                            checked={((daysChecked&2) ? true : false)}
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            checked={((daysChecked&4) ? true : false)}
                            alt="miercoles"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            checked={((daysChecked&8) ? true : false)}
                            alt="jueves"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            checked={((daysChecked&16) ? true : false)}
                            alt="viernes"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            checked={((daysChecked&32) ? true : false)}
                            alt="sabado"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            className="form-check-input"
                            type="checkbox"
                            checked={((daysChecked&64) ? true : false)}
                            alt="domingo"
                            onChange={()=>{}}
                            onClick={changeDay}
                            disabled={validation.values['vehiculo-fecha-autoriza']}
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
                            name="vehiculo-fecha-autoriza"
                            value={validation.values['vehiculo-fecha-autoriza'] || ""}
                            onChange={validation.handleChange}
                          />
                        </div>
                    </Col>
                    <Col md={9}>
                        <label className="col-md-12 col-form-label">Observaciones</label>
                        <div className="col-md-12">
                        <Input
                            type="test"
                            className="form-control"
                            name="vehiculo-observacion"
                            value={validation.values['vehiculo-observacion'] || ""}
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
                          <Button type="reset" color="warning" onClick={cancelInmuebleVehiculo} >
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
        {/*FORM VEHICULO*/}
        </div>
      </Modal>)}
      {/*MODAL FORM VEHICULO*/}

      {/*MODAL DELETE VEHICULO*/}
      <Modal
        isOpen={confirmModalEliminarInmuebleVehiculo}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarInmuebleVehiculo(false);
              setConfirmModalEliminarInmuebleVehiculo(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el vehículo <b>{(confirmEliminarInmuebleVehiculo!==false ? confirmEliminarInmuebleVehiculo.personaText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteInmuebleVehiculoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarInmuebleVehiculo(false);
            setConfirmModalEliminarInmuebleVehiculo(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE VEHICULO*/}


      {/*MODAL UPLOAD PHOTO*/}
      <Modal
        isOpen={uploadFotoInmuebleVehiculoModal}
        backdrop={'static'}>
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Carga Foto</h5>
          <button type="button" className="btn-close"
            onClick={() => cancelUploadPhotoPropertyVehicle()} aria-label="Close"></button>
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
          <button type="button" className="btn btn-primary" onClick={() => uploadPhotoPropertyVehicle()}>Subir</button>
          <button type="button" className="btn btn-light" onClick={() => cancelUploadPhotoPropertyVehicle()}>Cancelar</button>
        </div>):(<></>)}
      </Modal>
      {/*MODAL UPLOAD PHOTO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexInmuebleVehiculos);

IndexInmuebleVehiculos.propTypes = {
  history: PropTypes.object,
};