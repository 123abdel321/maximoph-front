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
  CardFooter,
  Spinner
} from "reactstrap";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

import Dropzone from "react-dropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import TableContainer from '../../../components/Common/TableContainer';

import logoDark from "../../../assets/images/logo-dark.png";
// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getPropertyPets, createPropertyPet, editPropertyPet, deletePropertyPet, uploadPhotoPet } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexInmuebleMascotas = props => {

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataPropertyPets } = useSelector(state => ({
    loading: state.PropertyPets.loading,
    dataPropertyPets: state.PropertyPets.propertyPets,
    loadingGrid: state.PropertyPets.loadingGrid
  }));

  const initialValuesInmuebleMascota = {
    'mascota-tipo': '',
    'mascota-nombre': '',
    'mascota-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };
  
  const [tipo, setTipo] = useState(null);
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  
  const [registerNuevoInmuebleMascota, setRegisterNuevoInmuebleMascota] = useState(false);
  const [editInmuebleMascotaId, setEditInmuebleMascota] = useState(false);
  const [confirmEliminarInmuebleMascota, setConfirmEliminarInmuebleMascota] = useState(false);
  const [confirmModalEliminarInmuebleMascota, setConfirmModalEliminarInmuebleMascota] = useState(false);

  const editInmuebleMascotaFn = (inmuebleMascota)=>{
    let fieldName = '';
    let fieldValue = '';
    let editInmuebleMascotaObj = {};

    Object.entries(inmuebleMascota).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');

      fieldName = `mascota-${fieldName}`;
      editInmuebleMascotaObj[fieldName] = fieldValue;

      fieldName = '';
      fieldValue = '';
    });

    setEditInmuebleMascota(Number(inmuebleMascota.id));

    setLoadingText('Editando Inmueble Mascota...');
    
    validation.setValues(editInmuebleMascotaObj);

    setRegisterNuevoInmuebleMascota(true);

    let tipoText = '';
                
    switch(inmuebleMascota.tipo){
      case 0: tipoText = 'CANINO'; break;
      case 1: tipoText = 'FELINO'; break;
      case 3: tipoText = 'OTRO'; break;
    }

    setTipo({ label: tipoText, value: inmuebleMascota.tipo });
  };

  const deleteInmuebleMascotaModal = (InmuebleMascota)=>{
    setConfirmEliminarInmuebleMascota(InmuebleMascota);
    setConfirmModalEliminarInmuebleMascota(true);
  };
  
  const deleteInmuebleMascotaConfirm = ()=>{
    cancelInmuebleMascota();
    setConfirmEliminarInmuebleMascota(false);
    setConfirmModalEliminarInmuebleMascota(false);
    

    setLoadingText('Eliminando Inmueble Mascota...')

    dispatch(deletePropertyPet(confirmEliminarInmuebleMascota.id, ()=>{
      cancelInmuebleMascota();
      loadInmuebleMascota();
      toastr.success("Mascota eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesInmuebleMascota,
    validationSchema: Yup.object({
      'mascota-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let inmuebleMascotaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('mascota-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          inmuebleMascotaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!tipo){
        toastr.error("Seleccione un tipo de mascota", "Error en la validación");
        return;
      }
      
      inmuebleMascotaValues["id_inmueble"] = props.editInmuebleId;
      inmuebleMascotaValues["tipo"] = tipo.value;
      
      setLoadingText("Guardando ...");
      
      if(!editInmuebleMascotaId){
        dispatch(createPropertyPet(inmuebleMascotaValues, (response)=>{
          if(response.success){
            cancelInmuebleMascota();
            loadInmuebleMascota();
            toastr.success("Nueva Mascota.", "Operación Ejecutada");
          }else{
            setLoadingText('Creando Inmueble Mascota...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editPropertyPet(inmuebleMascotaValues, (response)=>{
          if(response.success){
            cancelInmuebleMascota();
            loadInmuebleMascota();
            toastr.success("Mascota editada.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando Inmueble Mascota...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelInmuebleMascota = ()=>{
    setEditInmuebleMascota(false);
    setLoadingText(false);
    validation.handleReset();
    setRegisterNuevoInmuebleMascota(false);
    
    setTipo(null);
  };

  const columnsMascotas = useMemo(
      () => [
          {
              Header: 'Operaciones',
              sticky: true,
              accessor: row => (<p className="text-center">{row.operaciones}</p>)
          },
          {
            Header: 'Foto',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/pets/"+row.avatar;
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

  const [editMascotaPhoto, setEditMascotaPhoto] = useState(false);
  const [uploadFotoInmuebleMascotaModal, setUploadFotoInmuebleMascotaModal] = useState(false);

  const cancelUploadPhotoPropertyPet = ()=>{
    setselectedFiles([]);
    setEditMascotaPhoto(false);
    setUploadFotoInmuebleMascotaModal(false);
  };
  
  const formatBytes = (bytes, decimals = 2)=>{
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  };

  const uploadPhotoPropertyPet = async ()=>{
    if(selectedFiles.length){
      const photoPet = new FormData();
      photoPet.append('photo', selectedFiles[0]);
      photoPet.append('peso', selectedFiles[0].size);
      photoPet.append('tipo', selectedFiles[0].type);
      photoPet.append('id_pet', editMascotaPhoto);
      
      setLoadingPhoto(true);

      dispatch(uploadPhotoPet(photoPet, (response)=>{
        setLoadingPhoto(false);

        if(response.success){
          loadInmuebleMascota();
          cancelUploadPhotoPropertyPet();
          toastr.success("La foto ha sido actualizada.", "Operación Ejecutada");
        }else{
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }else{
      toastr.error("Seleccione una imágen", "Error en la validación");
    }
  };

  const withButtons = (inmuebleMascota)=>{
    return (<>
      <Button color="success" className="btn-sm" onClick={()=>{editInmuebleMascotaFn(inmuebleMascota)}}> 
          <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop" style={{ color: 'white' }}>Editar</span>
      </Button>
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteInmuebleMascotaModal(inmuebleMascota)}}>
          <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Eliminar</span>
      </Button>
      {' '}
      <Button className="btn btn-info btn-sm" onClick={async ()=>{
        setEditMascotaPhoto(Number(inmuebleMascota.id));
        setUploadFotoInmuebleMascotaModal(true);

        if(inmuebleMascota.avatar){
          const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/pets/"+inmuebleMascota.avatar;
          const response = await fetch(IMAGE_URL);
          const blob = await response.blob();
          const fileType = blob.type;
          const file = new File([blob], inmuebleMascota.avatar, { type: fileType });

          handleAcceptedFiles([file]);
        }

      }}>
        <i className="bx bx-camera font-size-14 align-middle el-mobile"></i>
        <span className="el-desktop">{inmuebleMascota.avatar ? 'Ver/Editar Foto' : 'Subir Foto'}</span>
      </Button>
    </>);
  };

  const loadInmuebleMascota = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPropertyPets(withButtons, ()=>{
      setLoadingText('');
    }, props.editInmuebleId));
  };

  useEffect(()=>{
    loadInmuebleMascota();
    console.log('dataPropertyPets: ',dataPropertyPets);
  },[]);

  return (
    <React.Fragment>
      <Row>
        <Col xl={12}>
          {/*DATATABLE MASCOTAS*/}
            <Button color="primary" onClick={async ()=>{
              await loadInmuebleMascota();
              setLoadingText('Creando Inmueble Mascota...');
              setRegisterNuevoInmuebleMascota(true);
            }}>
                Nuevo
            </Button>
            <br />
            <br />
            {
              !loadingGrid && !loadingText ?
                (
                  <div>
                    <Row className="align-items-center">
                      {dataPropertyPets.map((data, i) => { 
                        return (
                          <Col lg={4} md={6} sm={12}>
                            <Card
                              className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                              key={i + "-file"}
                              style={{textAlign: "center", padding: '10px'}}
                            >
                              <Row className="align-items-center">
                                <Col lg={4} md={4} sm={4}>
                                <i className="bx bx-camera align-middle" style={{ fontSize: '20px', backgroundColor: 'rgb(0 215 210)', padding: '3px', borderRadius: '30px', position: 'absolute', marginLeft: '10px', color: 'cornsilk !important' }}></i>
                                  {data.avatar ? 
                                    <img
                                      data-dz-thumbnail=""
                                      className=""
                                      alt={data.placa}
                                      style={{maxHeight: '6rem', cursor: 'pointer'}}
                                      src={(process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/pets/"+data.avatar}
                                      onClick={async ()=>{
                                        setEditMascotaPhoto(Number(data.id));
                                        setUploadFotoInmuebleMascotaModal(true);

                                        if(data.avatar){
                                          const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/pets/"+data.avatar;
                                          const response = await fetch(IMAGE_URL);
                                          const blob = await response.blob();
                                          const fileType = blob.type;
                                          const file = new File([blob], data.avatar, { type: fileType });

                                          handleAcceptedFiles([file]);
                                        }
                                      }}
                                    />
                                    :
                                    <img
                                      data-dz-thumbnail=""
                                      className=""
                                      alt={data.placa}
                                      style={{maxHeight: '6rem', cursor: 'pointer'}}
                                      src={logoDark}
                                      onClick={async ()=>{
                                        setEditMascotaPhoto(Number(data.id));
                                        setUploadFotoInmuebleMascotaModal(true);

                                        if(data.avatar){
                                          const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/pets/"+data.avatar;
                                          const response = await fetch(IMAGE_URL);
                                          const blob = await response.blob();
                                          const fileType = blob.type;
                                          const file = new File([blob], data.avatar, { type: fileType });

                                          handleAcceptedFiles([file]);
                                        }
                                      }}
                                    />
                                  }
                                </Col>
                                <Col lg={8} md={8} sm={8}>
                                  <p className="mb-0">
                                    <strong>MASCOTA:</strong> { data.tipo == 1 ? 'FELINO' : data.tipo == 2 ? 'OTRO' : 'PERRO'}<br/>
                                    <strong>Nombre: </strong>{ data.nombre }<br/>
                                    <strong>Observación: </strong>{ data.observacion }
                                  </p>
                                </Col>
                              </Row>
                              <CardFooter>
                                <Row className="align-items-center">
                                  <Col lg={6} md={6} sm={6}>
                                    <Button color="success" className="btn-sm" onClick={()=>{editInmuebleMascotaFn(data)}}> 
                                      <span style={{ color: 'white' }}>Editar</span>
                                    </Button>
                                  </Col>
                                  <Col lg={6} md={6} sm={6}>
                                    <Button className="btn btn-danger btn-sm" onClick={()=>{editInmuebleMascotaFn(data.id)}}>
                                      <span>Eliminar</span>
                                    </Button>
                                  </Col>

                                </Row>
                              </CardFooter>
                            </Card>
                          </Col>
                        )
                      })}
                    </Row>
                  </div>
                // <TableContainer
                //     columns={columnsMascotas}
                //     data={dataPropertyPets}
                //     isGlobalFilter={false}
                //     isAddOptions={false}
                //     customPageSize={1000}
                //     removePagination={true}
                //     className="custom-header-css"
                // />
                )
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
                            loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando inmueble Mascota..." ?
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
          {/*DATATABLE MASCOTAS*/}
        </Col>
      </Row>

      {/*MODAL FORM MASCOTA*/}
      {registerNuevoInmuebleMascota&&(<Modal
        isOpen={registerNuevoInmuebleMascota}
        size="lg"
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{editInmuebleMascotaId===false ? 'Nuevo' : 'Editando'} Mascota</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setLoadingText(false);
              setRegisterNuevoInmuebleMascota(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM MASCOTA*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validation.submitForm();

                return false;
              }}>
                <Row>
                  <Col md={7}>
                      <label className="col-md-12 col-form-label">Nombre *</label>
                      <div className="col-md-12">
                      <Input
                          type="text"
                          className="form-control"
                          name="mascota-nombre"
                          value={validation.values['mascota-nombre'] || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched['mascota-nombre'] && validation.errors['mascota-nombre'] && !validation.values['mascota-nombre'] ? true : false
                          }
                        />
                        {validation.touched['mascota-nombre'] && validation.errors['mascota-nombre'] && !validation.values['mascota-nombre'] ? (
                          <FormFeedback type="invalid">{validation.errors['mascota-nombre']}</FormFeedback>
                        ) : null}
                      </div>
                  </Col>
                  <Col md={5}>
                      <label className="col-md-12 col-form-label">Tipo *</label>
                      <div className="col-md-12">
                        <RemoteCombo 
                          value={tipo}
                          data={[
                            {label: 'CANINO', value: 0},
                            {label: 'FELINO', value: 1},
                            {label: 'OTRO', value: 2}
                          ]}
                          onChange={(val)=>setTipo(val)}
                        />
                      </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                      <label className="col-md-12 col-form-label">Observación</label>
                      <div className="col-md-12">
                      <Input
                          type="text"
                          className="form-control"
                          name="mascota-observacion"
                          value={validation.values['mascota-observacion'] || ""}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
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
                          <Button type="reset" color="warning" onClick={cancelInmuebleMascota} >
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
        {/*FORM MASCOTA*/}
        </div>
      </Modal>)}
      {/*MODAL FORM MASCOTA*/}

      {/*MODAL DELETE MASCOTA*/}
      <Modal
        isOpen={confirmModalEliminarInmuebleMascota}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarInmuebleMascota(false);
              setConfirmModalEliminarInmuebleMascota(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar la mascota <b>{(confirmEliminarInmuebleMascota!==false ? confirmEliminarInmuebleMascota.personaText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteInmuebleMascotaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarInmuebleMascota(false);
            setConfirmModalEliminarInmuebleMascota(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE MASCOTA*/}


      {/*MODAL UPLOAD PHOTO*/}
      <Modal
        isOpen={uploadFotoInmuebleMascotaModal}
        backdrop={'static'}>
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Carga Foto</h5>
          <button type="button" className="btn-close"
            onClick={() => cancelUploadPhotoPropertyPet()} aria-label="Close"></button>
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
          <button type="button" className="btn btn-primary" onClick={() => uploadPhotoPropertyPet()}>Subir</button>
          <button type="button" className="btn btn-light" onClick={() => cancelUploadPhotoPropertyPet()}>Cancelar</button>
        </div>):(<></>)}
      </Modal>
      {/*MODAL UPLOAD PHOTO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexInmuebleMascotas);

IndexInmuebleMascotas.propTypes = {
  history: PropTypes.object,
};