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
  CardTitle
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import Select from "react-select";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Dropzone from "react-dropzone";

import draftToHtml from 'draftjs-to-html';
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

// actions
import { getOwnHomeworks, completeHomework } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

const TareasRecibidas = props => {
  //meta title
  document.title = "Mis Tareas | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesHomeWork = {
    'tarea-fecha-completada': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [tipoTarea, setTipoTarea] = useState(null);

  const [dataTareas, setDataTareas] = useState([]);

  const [estado, setEstado] = useState({ label: "PENDIENTE", value: "0" });
  
  const [prioridad, setPrioridad] = useState({ label: "BAJA", value: "0" });

  const [zone, setZone] = useState(null);

  const [property, setProperty] = useState(null);

  const [tareaImage, setTareaImage] = useState(null);
  
  const [modalViewTarea, setModalViewTarea] = useState(null);
  
  const [editTareaId, setEditTarea] = useState(false);
  const [descripcion, setDescripcion] = useState(EditorState.createEmpty());

  const editTareaFn = (tarea)=>{
    let editTareaObj = {
      'tarea-fecha-completada': (tarea.completada_at ? tarea.completada_at : '')
    };

    setEditTarea(Number(tarea.id));

    setTipoTarea({
      value: tarea.id_tipo_tarea,
      label: tarea.tipoTareaText
    });

    let estadoText = 'PENDIENTE';

    switch(tarea.estado){
      case 1: estadoText='COMPLETADA'; break;
      case 2: estadoText='CANCELADA'; break;
    }

    setEstado({
      value: tarea.estado,
      label: estadoText
    });

    let prioridadText = 'BAJA';

    switch(tarea.prioridad){
      case 1: prioridadText='MEDIA'; break;
      case 2: prioridadText='ALTA'; break;
    }

    setPrioridad({
      value: tarea.prioridad,
      label: prioridadText
    });

    if(tarea.id_inmueble_zona){
      setZone({
        value: tarea.id_inmueble_zona,
        label: tarea.zonaText
      });
    }
    
    if(tarea.id_inmueble){
      setProperty({
        value: tarea.id_inmueble,
        label: tarea.tipoInmuebleText+' '+tarea.inmuebleText
      });
    }
    
    if(tarea.observacion_completada){
      let contentRaw = JSON.parse(tarea.observacion_completada);
          contentRaw = convertFromRaw(contentRaw);
          contentRaw = EditorState.createWithContent(contentRaw);

      setDescripcion(contentRaw);
    }

    setLoadingText('Actualizando tarea...');

    validation.setValues(editTareaObj);
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesHomeWork,
    onSubmit: (values) => {

      if(!estado){
        toastr.error("Seleccione el estado de la tarea", "Error de validación");
        return;
      }

      if(estado.value==1&&validation.values['tarea-fecha-completada']==''){
        toastr.error("Ingrese la fecha en la que completó la tarea", "Error de validación");
        return;
      }

      let descripcionTextarea = convertToRaw(descripcion.getCurrentContent());
      let contentRaw = descripcionTextarea;
      let lastBlock = (contentRaw.blocks.length-1);

      contentRaw.blocks[lastBlock].text = `${contentRaw.blocks[lastBlock].text} NOTA AGREGADA EL: ${new Date().toISOString().slice(0, 19).replace("T", " ")}.\n`;

      contentRaw = JSON.stringify(contentRaw);
      
      const tareaValues = new FormData();
      tareaValues.append('id', editTareaId);
      tareaValues.append('estado', estado.value);
      tareaValues.append('image', tareaImage);
      tareaValues.append('tipo_image', tareaImage?.type);
      tareaValues.append('fecha_completada', validation.values['tarea-fecha-completada']);
      tareaValues.append('observacion_completada', contentRaw);
      
      setLoadingText("Guardando ...");
      
      dispatch(completeHomework(tareaValues, (response)=>{
        if(response.success){
          cancelTarea();
          loadTareas();
          toastr.success("Tarea actualizada.", "Operación Ejecutada");
        }else{
          setLoadingText("Actualizando tarea...");
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }
  });

  const cancelTarea = ()=>{
    setZone(null);
    setProperty(null);
    setTipoTarea(null);
    setTareaImage(null);
    setEditTarea(false);
    setDescripcion(EditorState.createEmpty());
    setEstado({ label: "PENDIENTE", value: "0" });
    setPrioridad({ label: "BAJA", value: "0" });
    setLoadingText(false);
    validation.handleReset();
  };

  const viewTarea = (tarea)=>{
    let contentRaw = JSON.parse(tarea.descripcion_tarea);
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));
    
    let contentRawCompleted = JSON.parse(tarea.observacion_completada);
        contentRawCompleted = convertFromRaw(contentRawCompleted);
        contentRawCompleted = EditorState.createWithContent(contentRawCompleted);
        contentRawCompleted = draftToHtml(convertToRaw(contentRawCompleted.getCurrentContent()));
      
    tarea.estadoText = 'PENDIENTE';

    switch(tarea.estado){
      case 1: tarea.estadoText='COMPLETADA'; break;
      case 2: tarea.estadoText='CANCELADA'; break;
    }

    if(tarea.imagen){
      tarea.imagenView = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/homeworks/"+tarea.imagen;
    }

    let aTiempo = '-';
    let aTiempoColor = '';
    
    if(tarea.completada_at){
      if(new Date(tarea.completada_at)<=new Date(tarea.programada_at_end)){
        aTiempo = 'SI';
        aTiempoColor = 'text-primary';
      }else{
        aTiempo = 'NO';
        aTiempoColor = 'text-warning';
      }
    }else if(new Date()>new Date(tarea.programada_at_end)){
      aTiempo = 'EN MORA';
      aTiempoColor = 'error';
    }

    tarea.aTiempo = aTiempo;
    tarea.aTiempoColor = aTiempoColor;

    setModalViewTarea({titulo: tarea.tipoTareaText, descripcion: contentRaw, observacion_completada: contentRawCompleted, tarea});
  };

  const getDateDayName = (_date)=>{
    _date = new Date(_date);

    const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sáb'];

    const dayOfWeekNumber = _date.getDay();

    return daysOfWeek[dayOfWeekNumber];
  }
  
  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            return (<p className="text-center">
              {(row.estado==0||row.estado==3)&&(<Button color={"primary"} className="btn-sm" onClick={()=>{editTareaFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Completar/Seguimiento</span>
              </Button>)}
              {' '}
              <Button color={'info'} className="btn-sm" onClick={()=>{viewTarea(row)}}> 
                  <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver Tarea</span>
              </Button>
            </p>)
          }
        },
        {
            Header: 'Tipo Tarea',
            accessor: 'tipoTareaText'
        },
        {
            Header: 'Estado',
            accessor: row => {
              let estado = 'PENDIENTE';

              switch(row.estado){
                case 1: estado='COMPLETADA'; break;
                case 2: estado='CANCELADA'; break;
              }
              
              return (<p className="text-center">{estado}</p>);
            }
        },
        {
            Header: 'Prioridad',
            accessor: row => {
              let prioridad = 'BAJA';

              switch(row.prioridad){
                case 1: prioridad='MEDIA'; break;
                case 2: prioridad='ALTA'; break;
              }
              
              return (<p className="text-center">{prioridad}</p>);
            }
        },
        {
            Header: 'Fecha Programación Inicial',
            accessor: row => {
              let dayName = getDateDayName(row.programada_at_init);
              return (<p className="text-center">{row.programada_at_init}, {dayName}</p>)
            }
        },
        {
            Header: 'Fecha Programación Final',
            accessor: row => {
              let dayName = getDateDayName(row.programada_at_end);
              return (<p className="text-center">{row.programada_at_end}, {dayName}</p>)
            }
        },
        {
            Header: 'Fecha Inicio',
            accessor: row => {
              if(row.started_at){
                let dayName = row.started_at ? getDateDayName(row.started_at) : '';
                return (<p className="text-center">{row.started_at}, {dayName}</p>);
              }else if(row.completada_at&&row.estado>1){
                let dayName = row.completada_at ? getDateDayName(row.completada_at) : '';
                return (<p className="text-center">{row.completada_at}, {dayName}</p>);
              }
            }
        },
        {
            Header: 'Fecha Completada',
            accessor: row => {
              let dayName = row.completada_at ? getDateDayName(row.completada_at) : '';
              return (<p className="text-center">{row.completada_at}, {dayName}</p>)
            }
        },
        {
            Header: 'A Tiempo',
            accessor: tarea => {
              return (<p className={`text-center ${tarea.aTiempoColor}`}><b>{tarea.aTiempo}</b></p>);
            }
        },
        {
            Header: 'Fecha Creación',
            accessor: row => {
              let dayName = getDateDayName(row.created_at);
              return (<p className="text-center">{row.created_at}, {dayName}</p>)
            }
        },
        {
            Header: 'A Tiempo',
            hide: true,
            accessor: 'aTiempo'
        }
    ],
    []
  );

  const loadTareas = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getOwnHomeworks(null, (respHW)=>{         
      setDataTareas(respHW.data);
      setLoadingText(false);
    }));
  };

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

  useEffect(()=>{
    loadTareas();
  },[]);

  const addImageTarea = (image)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      setTareaImage(image);
    }else{
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="CRM" breadcrumbItem="Mis Tareas" />
          {editTareaId &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{'Completar Tarea'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Tipo Tarea</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={tipoTarea}
                              disabled={true}
                              data={[]}
                              onChange={(val)=>setTipoTarea(val)}
                            />
                          </div>
                        </Col>
                        {/*<Col md={2}>
                          <label className="col-md-12 col-form-label">Zona Inmueble</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={zone}
                              disabled={true}
                              data={[]}
                              onChange={(val)=>setZone(val)}
                            />
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Inmueble</label>
                          <div className="col-md-12">
                              <RemoteCombo 
                                value={property}
                                disabled={true}
                                data={[]}
                                onChange={(val)=>setProperty(val)}
                              />
                          </div>
                        </Col>*/}
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Completada el</label>
                          <div className="col-md-12">
                            <Input
                              type="datetime-local"
                              className="form-control"
                              name="tarea-fecha-completada"
                              value={validation.values['tarea-fecha-completada'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Estado *</label>
                          <div className="col-md-12">
                            <Select
                                value={estado}
                                onChange={(value)=>{
                                  if(value.value==0||value.value==3) setTareaImage(false);
                                  if(estado.value==3&&value.value==0){ 
                                    setEstado({ label: "INICIADA", value: "3" });
                                  }else{
                                    setEstado(value);
                                  }
                                }}
                                options={[
                                  { label: "PENDIENTE", value: "0" },
                                  { label: "COMPLETADA", value: "1" },
                                  { label: "CANCELADA", value: "2" },
                                  { label: "INICIADA", value: "3" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Prioridad *</label>
                          <div className="col-md-12">
                            <Select
                                value={prioridad}
                                isDisabled={true}
                                onChange={value=>setPrioridad(value)}
                                options={[
                                  { label: "BAJA", value: "0" },
                                  { label: "MEDIA", value: "1" },
                                  { label: "ALTA", value: "3" }
                                ]}
                                className="select2-selection"
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                          <label className="col-md-12 col-form-label">Anexar Imágen</label>
                          {Number(estado.value)>=1&&Number(estado.value)<3?
                            (<div className="col-md-12">
                              <Dropzone onDrop={imageFile => addImageTarea(imageFile[0])} >
                                {({ getRootProps, getInputProps }) => (
                                  <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                                    <input {...getInputProps()} />
                                    <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                                    {(tareaImage ? 'Cambiar imágen' : 'Seleccionar imágen')}
                                  </Button>
                                )}
                              </Dropzone>
                            </div>)
                            :
                            (<b>OPCIÓN HABILITADA PARA ESTADO COMPLETADO O CANCELADO</b>)}
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                            <label className="col-md-12 col-form-label">Observación tarea completada/seguimiento</label>
                            <div className="col-md-12">
                              <Editor 
                                editorState={descripcion}
                                toolbar={toolbarOptions}
                                editorStyle={{ height: '100px' }}
                                onEditorStateChange={onEditorStateChange}
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
                                <Button type="reset" color="warning" onClick={cancelTarea} >
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
                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {
            !loadingText ?
            (<TableContainer
              columns={columns}
              data={dataTareas}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              customPageSizeOptions={true}
              className="custom-header-css"
          />)
          :
          (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tarea..." ?
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
            
      {/*MODAL VER TAREA*/}
      <Modal
        isOpen={(modalViewTarea?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewTarea?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewTarea(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Row>
            <Col md={12} className="text-start">
              <b>Asignada a:</b> {modalViewTarea?.tarea?.usuarioText}
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6} className="text-start">
              <b>Programada para (Inicial):</b> {modalViewTarea?.tarea?.programada_at_init}
            </Col>
            <Col md={6} className="text-end">
              <b>Programada para (Final):</b> {modalViewTarea?.tarea?.programada_at_end}
            </Col>
          </Row>
          <br />
          <Row>
            <Col md={6} className="text-start">
              <b>Estado Tarea:</b> <u>{modalViewTarea?.tarea?.estadoText}</u>
            </Col>
            <Col md={6} className="text-end">
              <b>Prioridad Tarea:</b> <u>{modalViewTarea?.tarea?.prioridadText}</u>
            </Col>
          </Row>
          <br />
            <Row>
              <Col md={6} className="text-start">
                <b>Descripción tarea:</b>
              </Col>
            </Row>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewTarea?.descripcion }} />
        {
          modalViewTarea?.tarea?.estado>=1&&(<div className="modal-body">
            <hr/>
            <Row>
              <Col md={6} className="text-start">
                <b>Fecha Completada:</b> <u>{modalViewTarea?.tarea?.completada_at}</u>
              </Col>
              <Col md={6} className="text-end">
                <b>A Tiempo:</b> <b className={modalViewTarea?.tarea?.aTiempoColor}>{modalViewTarea?.tarea?.aTiempo}</b>
              </Col>
            </Row>
            <br />
            <Row>
              <Col md={6} className="text-start">
                <b>Observación usuario responsable:</b>
              </Col>
            </Row>
            <br />
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewTarea?.observacion_completada }} />
          </div>)
        }
        {(
            modalViewTarea?.tarea?.imagenView ?
            (<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xxl rounded bg-light"
                alt={modalViewTarea?.tarea?.imagenView}
                src={modalViewTarea?.tarea?.imagenView}
              />
            </p>)
            :
            (<></>)
        )}
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewTarea(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER TAREA*/}
    </React.Fragment>
  );
};

export default withRouter(TareasRecibidas);

TareasRecibidas.propTypes = {
  history: PropTypes.object,
};