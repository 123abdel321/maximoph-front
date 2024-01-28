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
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getTypesHomework, createTypeHomework, editTypeHomework, deleteTypeHomework } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexTiposTarea = props => {

  //meta title
  document.title = "Tipos Tarea | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataTypesHomework } = useSelector(state => ({
    loading: state.TypesHomework.loading,
    dataTypesHomework: state.TypesHomework.typesHomework,
    loadingGrid: state.TypesHomework.loadingGrid
  }));

  const initialValuesTypeHomeworkForm = {
    'tipo-tarea-nombre': '',
    'tipo-tarea-descripcion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [enableForm, setEnableForm] = useState(false);
  const [editTipoTareaId, setEditTipoTarea] = useState(false);
  const [confirmEliminarTipoTarea, setConfirmEliminarTipoTarea] = useState(false);
  const [confirmModalEliminarTipoTarea, setConfirmModalEliminarTipoTarea] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editTipoTareaFn = (TipoTarea)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editTipoTareaObj = {};

      Object.entries(TipoTarea).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `tipo-tarea-${fieldName}`;
        editTipoTareaObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditTipoTarea(Number(TipoTarea.id));
      setEnableForm(true);
      setLoadingText('Editando tipo tarea...');
      
      validation.setValues(editTipoTareaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Tipos de tarea", "Permisos");
    }
  };

  const deleteTipoTareaModal = (tipoTarea)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarTipoTarea(tipoTarea);
      setConfirmModalEliminarTipoTarea(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Tipos de tarea", "Permisos");
    }
  };
  
  const deleteTipoTareaConfirm = ()=>{
    cancelTipoTarea();
    setConfirmEliminarTipoTarea(false);
    setConfirmModalEliminarTipoTarea(false);
    

    setLoadingText('Eliminando tipo tarea...')

    dispatch(deleteTypeHomework(confirmEliminarTipoTarea.id, ()=>{
      cancelTipoTarea();
      loadTiposTarea();
      toastr.success("Concepto eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesTypeHomeworkForm,
    validationSchema: Yup.object({
      'tipo-tarea-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let tipoTareasValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tipo-tarea-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          tipoTareasValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");

      if(!editTipoTareaId){
        dispatch(createTypeHomework(tipoTareasValues, (response)=>{
          if(response.success){
            cancelTipoTarea();
            loadTiposTarea();
            toastr.success("Nuevo concepto registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editTypeHomework(tipoTareasValues, (response)=>{
          if(response.success){
            cancelTipoTarea();
            loadTiposTarea();
            toastr.success("Concepto editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando tipo tarea...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelTipoTarea = ()=>{
    setEditTipoTarea(false);
    setLoadingText(false);
    setEnableForm(false);
    validation.handleReset();
  };

  
  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";
            
            return (<p className="text-center">
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editTipoTareaFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteTipoTareaModal(row)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
            </p>)
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        },
        {
            Header: 'Descripción',
            accessor: 'descripcion',
        }
    ],
    []
  );

  const loadTiposTarea = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getTypesHomework(null, (resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadTiposTarea();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Tipos Tarea" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editTipoTareaId===false ? 'Nuevo Tipo Tarea' : 'Editando Tipo Tarea'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={6}>
                          <label className="col-md-12 col-form-label">Nombre *</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="tipo-tarea-nombre"
                              value={validation.values['tipo-tarea-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['tipo-tarea-nombre'] && validation.errors['tipo-tarea-nombre'] && !validation.values['tipo-tarea-nombre'] ? true : false
                              }
                            />
                            {validation.touched['tipo-tarea-nombre'] && validation.errors['tipo-tarea-nombre'] && !validation.values['tipo-tarea-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['tipo-tarea-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={6}>
                          <label className="col-md-12 col-form-label">Descripción</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="tipo-tarea-descripcion"
                              value={validation.values['tipo-tarea-descripcion'] || ""}
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
                                <Button type="reset" color="warning" onClick={cancelTipoTarea} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR TIPOS DE TAREA</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR TIPOS DE TAREA</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo tipo de tarea
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
                  data={dataTypesHomework}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tipo tarea..." ?
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
      <Modal
        isOpen={confirmModalEliminarTipoTarea}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarTipoTarea(false);
              setConfirmModalEliminarTipoTarea(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el tipo de tarea <b>{(confirmEliminarTipoTarea!==false ? confirmEliminarTipoTarea.nombre : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este tipo de tarea en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteTipoTareaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarTipoTarea(false);
            setConfirmModalEliminarTipoTarea(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexTiposTarea);

IndexTiposTarea.propTypes = {
  history: PropTypes.object,
};