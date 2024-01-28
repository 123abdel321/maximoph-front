import React, { useState, useMemo, useRef, useEffect } from "react";
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
} from "reactstrap";

// Notifications
import toastr from "toastr";
import Webcam from 'react-webcam';
import Dropzone from "react-dropzone";
import "toastr/build/toastr.min.css";

import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import Select from "react-select";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getMassiveMessages, createMassiveMessage, getPersons, getZones, getUsersRoles } from "../../../store/actions";

//redux
import { useDispatch, useSelector } from "react-redux";

import { useLocation } from 'react-router-dom';

import withRouter from "components/Common/withRouter";

const IndexMensajesMasivos = props => {

  //meta title
  document.title = "Envio de Mensajes | Maximo PH";

  const location = useLocation();
  const pqrsf = location.state?.pqrsf || null;

  const dispatch = useDispatch();

  const initialValuesMensajeMasivoForm = {
    'mensaje-masivo-titulo': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [push, setPush] = useState({ label: "SI", value: "1" });
  const [zona, setZona] = useState(null);
  const [personaRol, setPersonaRol] = useState(null);
  const [persona, setPersona] = useState(null);
  const [descripcion, setDescripcion] = useState(EditorState.createEmpty());
  const [dataRoles, setDataRoles] = useState([]);
  const [personasErp, setPersonasErp] = useState([]);
  
  const [modalViewMessage, setModalViewMessage] = useState(false);
  const [enableForm, setEnableForm] = useState(false);
    
  const [confirmModalEnviarMensajeMasivo, setConfirmModalEnviarMensajeMasivo] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [data, setData] = useState([]);

  const [messageImage, setMessageImage] = useState(null);

  const { dataZones } = useSelector(state => ({
    dataZones: state.Zones.zones.filter(i=>Number(i.tipo)==1),
  }));

  const cancelMensajeMasivo = ()=>{
    setPush({ label: "SI", value: "1" });
    setZona(null);
    setPersonaRol(null);
    setPersona(null);
    setEnableForm(false);
    setMessageImage(null);

    setLoadingText(false);
    setDescripcion(EditorState.createEmpty());
    validation.handleReset();
    loadMensajesMasivos();
  };
  
  const loadMensajesMasivos = ()=>{
    setLoadingText('Cargando ...');
    dispatch(getZones(null, ()=>{
      dispatch(getUsersRoles(null, (respRoles)=>{
        let newDataRoles = [];

        respRoles.map(role=>newDataRoles.push({value:role.id,label:role.nombre}));

        setDataRoles(newDataRoles);
          
        dispatch(getMassiveMessages(null, (massiveMessages)=>{ 
          
          let newAccessModule = accessModule;
          massiveMessages.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));
    
          setAccessModule(newAccessModule);

          dispatch(getPersons(null, (dPersons)=>{ 
              
              let selectedPerson = null;

              dPersons.map(person=>{
                person.label = `${person.numero_documento} - ${person.label} - ${(person.numero_unidades||'')}`;
                
                if((pqrsf?.id_persona==Number(person.value))&&!selectedPerson) selectedPerson = person;
              });

              setPersonasErp(dPersons);
              
              setPersona(selectedPerson);

              setData(massiveMessages.data);
              
              validation.handleReset();

              if(pqrsf){
                validation.setValues({
                  'mensaje-masivo-titulo': `RESPUESTA PQRSF # ${pqrsf.id}: ${pqrsf.asunto} - ${pqrsf.created_at} `
                });
              }
              
              setLoadingText('');

              if(props.onLoad) props.onLoad(massiveMessages);
            
          },true));
        }));
        
      }));
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesMensajeMasivoForm,
    validationSchema: Yup.object({
      'mensaje-masivo-titulo': Yup.string().required("Por favor ingresa el título del mensaje")
    }),
    onSubmit: (values) => {
      
      let descripcionTextarea = convertToRaw(descripcion.getCurrentContent());
      if(draftToHtml(descripcionTextarea).replaceAll("<p></p>","").replaceAll(/[\r\n]/g, '')==''){
        toastr.error("Digite la descripción del mensaje.", "Error en la validación");
        return;
      }

      let mensajeMasivoValues = {};

      setConfirmModalEnviarMensajeMasivo(false);

      setLoadingText("Guardando ...");

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('mensaje-masivo-','');
        fieldName = fieldName.replaceAll('-','_');

        mensajeMasivoValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");

        fieldName = '';
        fieldValue = '';
      });
      
      mensajeMasivoValues["id_zona"] = (zona?.value||'');

      mensajeMasivoValues["id_persona"] = (persona?.value||'');
      
      mensajeMasivoValues["id_rol_persona"] = (personaRol?.value||'');
      
      mensajeMasivoValues["notificacion_push"] = (push?.value||0);

      let contentRaw = descripcionTextarea;
      contentRaw = JSON.stringify(contentRaw);
      mensajeMasivoValues["descripcion"] = contentRaw;

      const mensajeMasivoValuesFormData = new FormData();

      Object.entries(mensajeMasivoValues).forEach(([key, value]) => {
        mensajeMasivoValuesFormData.append(key, (value==undefined?null:value));
      })

      mensajeMasivoValuesFormData.append('image', messageImage);
      mensajeMasivoValuesFormData.append('tipo_image', messageImage?.type);
      
      dispatch(createMassiveMessage(mensajeMasivoValuesFormData, (response)=>{
        if(response.success){
          cancelMensajeMasivo();
          loadMensajesMasivos();
          toastr.success("Nuevo Mensaje Enviado.", "Operación Ejecutada");
        }else{
          setLoadingText('Enviando Mensaje...');
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }
  });

  const viewMessage = (title, description, image)=>{
    let contentRaw = JSON.parse(description);
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));

    setModalViewMessage({titulo: title, descripcion: contentRaw, image});
  };

  const columns = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: row => {
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/messages/"+row.imagen;
              row.IMAGE_URL = IMAGE_URL;
              return (<p className="text-center">
                <Button color={'info'}className="btn-sm" onClick={()=>viewMessage(row.titulo, row.descripcion, IMAGE_URL)}>
                    <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Ver Mensaje</span>
                </Button>
              </p>);
            }
          },
          {
            Header: 'Imágen mensaje',
              accessor: row =>{
                const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/messages/"+row.imagen;
                row.IMAGE_URL = IMAGE_URL;
                if(row.imagen){
                  return (<p className="text-center" style={{cursor: 'pointer'}} onClick={()=>viewMessage(row.titulo, row.descripcion, IMAGE_URL)}>
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
              Header: 'Zona',
              accessor: 'zona',
          },
          {
              Header: 'Rol Persona',
              accessor: 'rol',
          },
          {
              Header: 'Mensaje Push',
              accessor: (row)=>{
                return (Number(row.notificacion_push)?'SI':'NO')
              },
          },
          {
              Header: 'Inquilino/Propietario',
              accessor: 'persona',
          },
          {
              Header: 'Título',
              accessor: 'titulo',
          },
          {
              Header: 'Fecha',
              accessor: row => {
                return (<p className="text-center">{row.created_at}</p>);
              }
          }
      ],
      []
  );
  
  useEffect(()=>{
    loadMensajesMasivos();
  },[]);

  const toolbarOptions = {
    options: ['inline', 'fontSize', 'fontFamily', 'list', 'textAlign'],
    inline: {
      options: ['bold', 'italic', 'underline'],
    },
    list: {
      options: ['unordered', 'ordered'],
    },
    textAlign: {
      options: ['left', 'center', 'right', 'justify'],
    },
    fontFamily: {
      options: ['Arial', 'Georgia', 'Impact', 'Tahoma', 'Times New Roman', 'Verdana'],
    },
  };

  const onEditorStateChange = (editorState) => {
    setDescripcion(editorState);
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

    setMessageImage(imageFile);

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
          <Breadcrumbs title="Utilidades" breadcrumbItem="Envio de Mensajes" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{'Nuevo Mensaje'}</CardTitle>
                    
                    <Row>
                      <Col sm="12">
                      {/*FORM GENERAL*/}
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              
                              let descripcionTextarea = draftToHtml(convertToRaw(descripcion.getCurrentContent())).replaceAll("<p></p>","").replaceAll(/[\r\n]/g, '');

                              if(validation.values['mensaje-masivo-titulo'].length&&descripcionTextarea!=''){
                                setConfirmModalEnviarMensajeMasivo(true);
                              }else{
                                validation.submitForm();
                              }
                              
                              return false;
                            }}>
                              <Row>
                                <Col md={2}>
                                  <label className="col-md-12 col-form-label">Rol Usuario</label>
                                  <div className="col-md-12">
                                    <RemoteCombo 
                                      value={personaRol}
                                      disabled={(persona||zona)}
                                      data={dataRoles}
                                      onChange={(val)=>{
                                        setPersonaRol(val);
                                        setPersona(null);
                                        setZona(null);
                                      }}
                                    />
                                  </div>
                                </Col>
                                <Col md={2}>
                                    <label className="col-md-12 col-form-label">Zona Inmueble</label>
                                    <div className="col-md-12">
                                      <RemoteCombo 
                                        value={zona}
                                        disabled={(persona||personaRol||!dataZones.length)}
                                        data={dataZones}
                                        onChange={(val)=>{
                                          setPersonaRol(null);
                                          setPersona(null);
                                          setZona(val);
                                        }}
                                      />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <label className="col-md-12 col-form-label">Inquilino/Propietario</label>
                                    <div className="col-md-12">
                                      <RemoteCombo 
                                        value={persona}
                                        disabled={(zona||personaRol)}
                                        data={personasErp}
                                        onChange={(val)=>{
                                          setPersonaRol(null);
                                          setPersona(val);
                                          setZona(null);
                                        }}
                                      />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <label className="col-md-12 col-form-label">Mensaje Push</label>
                                    <div className="col-md-12">
                                      <Select
                                          value={push}
                                          onChange={value=>setPush(value)}
                                          options={[
                                            { label: "SI", value: "1" },
                                            { label: "NO", value: "0" }
                                          ]}
                                          className="select2-selection"
                                        />
                                    </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={9}>
                                    <label className="col-md-12 col-form-label">Título Mensaje *</label>
                                    <div className="col-md-12">
                                      <Input
                                          type="text"
                                          className="form-control"
                                          name="mensaje-masivo-titulo"
                                          value={validation.values['mensaje-masivo-titulo'] || ""}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['mensaje-masivo-titulo'] && validation.errors['mensaje-masivo-titulo'] && !validation.values['mensaje-masivo-titulo'] ? true : false
                                          }
                                        />
                                        {validation.touched['mensaje-masivo-titulo'] && validation.errors['mensaje-masivo-titulo'] && !validation.values['mensaje-masivo-titulo'] ? (
                                          <FormFeedback type="invalid">{validation.errors['mensaje-masivo-titulo']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <label className="col-md-12 col-form-label">Anexar Foto</label>
                                    <div className="col-md-12">
                                      <Dropzone onDrop={imageFile => setMessageImage(imageFile[0])}>
                                        {({ getRootProps, getInputProps }) => (
                                          <div>
                                            <Button color={'primary'} {...getRootProps()} className="btn-m" onClick={handleButtonClick}>
                                              <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} />
                                              {(messageImage ? 'Cambiar foto' : 'Seleccionar foto')}
                                            </Button>
                                          </div>
                                        )}
                                      </Dropzone>
                                    </div>
                                    <br />
                                    {messageImage&&(<img src={URL.createObjectURL(messageImage)} style={{height: '120px', width: '120px'}} />)}
                                </Col>
                              </Row>
                              <Row>
                                <Col md={12}>
                                    <label className="col-md-12 col-form-label">Contenido Mensaje *</label>
                                    <div className="col-md-12">
                                      <Editor 
                                        editorState={descripcion}
                                        toolbar={toolbarOptions}
                                        onEditorStateChange={onEditorStateChange}
                                      />
                                    </div>
                                </Col>
                              </Row>
                              <br />
                              <Row>
                                <Col md={10}>
                                </Col>
                                <Col md={2} className="text-end">
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
                                        <Button type="reset" color="warning" onClick={cancelMensajeMasivo} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A ENVIAR MENSAJES</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR HISTÓRICO DE MENSAJES ENVIADOS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo mensaje
                  </Button>
                  <br/>
                  <br/>
                </Col>
              </Row>
            )}

          {
            accessModule.INGRESAR==true && !loadingText && enableForm==false ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={data}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  customPageSize={10}
                  customPageSizeOptions={true}
                  className="custom-header-css"
                />
              </div>
            )
          :
          (loadingText!="hidden" && loadingText!="" && (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." ?
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

      {/*MODAL ENVIAR MENSAJE MASIVO*/}
      <Modal
        isOpen={confirmModalEnviarMensajeMasivo}
        backdrop={'static'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmModalEnviarMensajeMasivo(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas enviar el mensaje <b>{validation.values['mensaje-masivo-titulo']}</b> <u><b>NO PODRÁS EDITARLO Ó ELIMINARLO</b></u>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            validation.submitForm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
              setConfirmModalEnviarMensajeMasivo(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ENVIAR MENSAJE MASIVO*/}
      
      {/*MODAL VER MENSAJE*/}
      <Modal
        isOpen={(modalViewMessage?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewMessage?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewMessage(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewMessage.descripcion }} />
        <div className="modal-body text-center">
          <img
            data-dz-thumbnail=""
            className="avatar-xxl rounded bg-light"
            src={modalViewMessage.image}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewMessage(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER MENSAJE*/}

    </React.Fragment>
  );
};

export default withRouter(IndexMensajesMasivos);

IndexMensajesMasivos.propTypes = {
  history: PropTypes.object,
};