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
} from "reactstrap";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import Dropzone from "react-dropzone";

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
import { getSentPqrsf, createPqrsf, getPropertiesOwnerRenter } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexPQRSFEnviados = props => {

  //meta title
  document.title = "Envio de PQRSF | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesMensajeMasivoForm = {
    'pqrsf-asunto': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [tipoPqrsf, setTipoPqrsf] = useState(null);
  const [pqrsfImage, setPqrsfImage] = useState(null);
  const [descripcion, setDescripcion] = useState(EditorState.createEmpty());
  const [dataProperties, setDataProperties] = useState([]);
  const [propertyComboValue, setPropertyComboValue] = useState(null);
  
  const [modalViewPqrsf, setModalViewPqrsf] = useState(false);
    
  const [confirmModalEnviarMensajeMasivo, setConfirmModalEnviarMensajeMasivo] = useState(false);
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [data, setData] = useState([]);
  const [enableForm, setEnableForm] = useState(false);

  const cancelPqrsf = ()=>{
    setLoadingText(false);
    setDescripcion(EditorState.createEmpty());
    setTipoPqrsf(null);
    setPqrsfImage(null);
    setEnableForm(false);
    setPropertyComboValue(null);

    validation.handleReset();
    loadPQRSF();
  };
  
  const loadPQRSF = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPropertiesOwnerRenter(null,(resp)=>{
      let newDataproperties = [];
      
      resp.data.map(property=>{
        newDataproperties.push({
          value: property.id,
          persona: property.id_persona,
          label: property.tipoText+'-'+property.zonaText+': '+property.numero,
        })
      });

      setDataProperties(newDataproperties);
      
      if(newDataproperties.length){
        setPropertyComboValue(newDataproperties[0]);
      }

      dispatch(getSentPqrsf(null, (pqrsf)=>{ 
        setData(pqrsf.data);
        
        validation.handleReset();
        
        setLoadingText('');

        if(props.onLoad) props.onLoad(pqrsf);
      }));
          
    },JSON.parse(localStorage.getItem("authUser")).email));
    
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesMensajeMasivoForm,
    validationSchema: Yup.object({
      'pqrsf-asunto': Yup.string().required("Por favor ingresa el asunto del PQRSF")
    }),
    onSubmit: (values) => {

      if(!propertyComboValue?.value){
        toastr.error("Seleccione un inmueble.", "Error en la validación");
        return;
      }

      if(!tipoPqrsf?.value){
        toastr.error("Seleccione un tipo.", "Error en la validación");
        return;
      }
      
      let descripcionTextarea = convertToRaw(descripcion.getCurrentContent());

      let validateDescriptionHomework = false;
      descripcionTextarea.blocks.map((block)=>{
        if((block?.text || '').trim()!='') validateDescriptionHomework = true;
      });
      if(!validateDescriptionHomework){
        toastr.error("Digite la descripción del pqrsf.", "Error en la validación");
        return;
      }

      let pqrsfFormValues = {};

      setConfirmModalEnviarMensajeMasivo(false);

      setLoadingText("Guardando ...");

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('pqrsf-','');
        fieldName = fieldName.replaceAll('-','_');

        pqrsfFormValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");

        fieldName = '';
        fieldValue = '';
      });

      let contentRaw = descripcionTextarea;
      contentRaw = JSON.stringify(contentRaw);

      const pqrsfValues = new FormData();
      pqrsfValues.append('id_inmueble', propertyComboValue.value);
      pqrsfValues.append('id_persona', propertyComboValue.persona);
      pqrsfValues.append('tipo', tipoPqrsf.value);
      pqrsfValues.append('image', pqrsfImage);
      pqrsfValues.append('tipo_image', pqrsfImage?.type);
      pqrsfValues.append('asunto', pqrsfFormValues["asunto"]);
      pqrsfValues.append('descripcion', contentRaw);
      
      dispatch(createPqrsf(pqrsfValues, (response)=>{
        if(response.success){
          cancelPqrsf();
          loadPQRSF();
          toastr.success("Nuevo PQRSF Enviado.", "Operación Ejecutada");
        }else{
          setLoadingText('Enviando PQRSF...');
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }
  });

  const viewPqrsf = (titulo, description, imagen)=>{
    let contentRaw = JSON.parse(description);
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));

    if(imagen){
      imagen = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com/')+"/uploads/pqrsf/"+imagen;
    }

    setModalViewPqrsf({titulo, descripcion: contentRaw, imagen});
  };

  const columns = useMemo(
      () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            return (<p className="text-center">
              <Button color={'info'}className="btn-sm" onClick={()=>viewPqrsf(row.asunto, row.descripcion, row.imagen)}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver PQRSF</span>
              </Button>
            </p>);
          }
        },
        {
            Header: '# PQRSF',
            accessor: row => {
              return (<p className="text-center">{row.id}</p>);
            }
        },
        {
            Header: 'Respuestas',
            accessor: row => {
              if(Number(row.respuestas)){
                return (<p className="text-center">
                  <Button color={'info'}className="btn-info" onClick={()=>viewPqrsf(`ÚLTIMA RESPUESTA PQRSF #${row.id}`, row.ultima_respuesta, false)}>
                      <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver última respuesta ({row.respuestas})</span>
                  </Button>
                </p>);
              }else{
                return (<p className="text-center">{row.respuestas}</p>);
              }
            }
        },
        {
            Header: 'Inmueble',
            accessor: row => {
              return (`${row.tipoInmuebleText} ${row.inmuebleText}`);
            }
        },
        {
            Header: 'Tipo',
            accessor: row => {
              let tipoPqrsf = '';
              switch(Number(row.tipo)){
                case 0: tipoPqrsf = 'Pregunta'; break;
                case 1: tipoPqrsf = 'Queja'; break;
                case 2: tipoPqrsf = 'Reclamo'; break;
                case 3: tipoPqrsf = 'Solicitud'; break;
                case 4: tipoPqrsf = 'Felicitación'; break;
              }
              return tipoPqrsf;
            }
        },
        {
            Header: 'Asunto',
            accessor: 'asunto',
        },
        {
            Header: 'Imágen',
            accessor: row => {
              return (row.imagen ? 'SI' : 'NO');
            }
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

  const addImagePqrsf = (image)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      setPqrsfImage(image);
    }else{
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };
  
  useEffect(()=>{
    loadPQRSF();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utilidades" breadcrumbItem="Envio de PQRSF" />


          {false==false && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{'Nuevo PQRSF'}</CardTitle>
                    
                    <Row>
                      <Col sm="12">
                      {/*FORM GENERAL*/}
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              
                              let descripcionTextarea = draftToHtml(convertToRaw(descripcion.getCurrentContent())).replaceAll("<p></p>","").replaceAll(/[\r\n]/g, '');

                              if(validation.values['pqrsf-asunto'].length&&descripcionTextarea!=''){
                                setConfirmModalEnviarMensajeMasivo(true);
                              }else{
                                validation.submitForm();
                              }
                              
                              return false;
                            }}>
                              <Row>    
                                <Col md={4}>
                                  <label className="col-md-12 col-form-label">Inmueble *</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={propertyComboValue}
                                        disabled={(dataProperties.length==0?true:false)}
                                        data={dataProperties}
                                        onChange={(val)=>setPropertyComboValue(val)}
                                      />
                                  </div>
                                </Col>
                                <Col md={2}>
                                    <label className="col-md-12 col-form-label">Tipo</label>
                                    <div className="col-md-12">
                                      <Select
                                          value={tipoPqrsf}
                                          onChange={value=>setTipoPqrsf(value)}
                                          options={[
                                            { label: "Pregunta", value: "0" },
                                            { label: "Queja", value: "1" },
                                            { label: "Reclamo", value: "2" },
                                            { label: "Solicitud", value: "3" },
                                            { label: "Felicitación", value: "4" }
                                          ]}
                                          className="select2-selection"
                                        />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label className="col-md-12 col-form-label">Asunto *</label>
                                    <div className="col-md-12">
                                      <Input
                                          type="text"
                                          className="form-control"
                                          name="pqrsf-asunto"
                                          value={validation.values['pqrsf-asunto'] || ""}
                                          onChange={validation.handleChange}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['pqrsf-asunto'] && validation.errors['pqrsf-asunto'] && !validation.values['pqrsf-asunto'] ? true : false
                                          }
                                        />
                                        {validation.touched['pqrsf-asunto'] && validation.errors['pqrsf-asunto'] && !validation.values['pqrsf-asunto'] ? (
                                          <FormFeedback type="invalid">{validation.errors['pqrsf-asunto']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <label className="col-md-12 col-form-label">Anexar Imágen</label>
                                    <div className="col-md-12">
                                      <Dropzone onDrop={imageFile => addImagePqrsf(imageFile[0])} >
                                        {({ getRootProps, getInputProps }) => (
                                          <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                                            <input {...getInputProps()} />
                                            <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                                            {(pqrsfImage ? 'Cambiar imágen' : 'Seleccionar imágen')}
                                          </Button>
                                        )}
                                      </Dropzone>
                                    </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col md={12}>
                                    <label className="col-md-12 col-form-label">Contenido *</label>
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
                                        <Button type="reset" color="warning" onClick={cancelPqrsf} >
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
          
          {!loadingText && enableForm==false &&(<Card>
              <Row>
                <Col xl={3}>
                  <p className="text-center">
                    <br />
                    <Button onClick={()=>setEnableForm(true)} color="primary">
                      Nuevo PQRSF
                    </Button>
                    <br />
                  </p>
                </Col>
              </Row>
            </Card>)}

          {
            false==false && !loadingText && enableForm==false ?
            (<TableContainer
              columns={columns}
              data={data}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              customPageSizeOptions={true}
              className="custom-header-css"
          />)
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


      {/*MODAL GRABAR PQRSF*/}
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
          <p>¿Estás seguro que deseas enviar el PQRSF <b>{validation.values['pqrsf-asunto']}</b>, <u><b>NO PODRÁS ELIMINARLO O EDITARLO</b></u>?</p>
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
      {/*MODAL GRABAR PQRSF*/}
      
      {/*MODAL VER PQRSF*/}
      <Modal
        isOpen={(modalViewPqrsf?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewPqrsf?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewPqrsf(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewPqrsf.descripcion }} />
        {(
            modalViewPqrsf.imagen ?
            (<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xxl rounded bg-light"
                alt={modalViewPqrsf.imagen}
                src={modalViewPqrsf.imagen}
              />
            </p>)
            :
            (<></>)
        )}
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewPqrsf(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER PQRSF*/}

    </React.Fragment>
  );
};

export default withRouter(IndexPQRSFEnviados);

IndexPQRSFEnviados.propTypes = {
  history: PropTypes.object,
};