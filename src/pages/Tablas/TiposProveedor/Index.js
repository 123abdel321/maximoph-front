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
import { getProviderTypes, createProviderType, editProviderType, deleteProviderType } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexTiposProveedor = props => {

  //meta title
  document.title = "Tipos Proveedor | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataProviderTypes } = useSelector(state => ({
    loading: state.ProviderTypes.loading,
    dataProviderTypes: state.ProviderTypes.providerTypes,
    loadingGrid: state.ProviderTypes.loadingGrid
  }));

  const initialValuesProviderTypeForm = {
    'tipo-proveedor-nombre': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [editTipoProveedorId, setEditTipoProveedor] = useState(false);
  const [confirmEliminarTipoProveedor, setConfirmEliminarTipoProveedor] = useState(false);
  const [confirmModalEliminarTipoProveedor, setConfirmModalEliminarTipoProveedor] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editTipoProveedorFn = (TipoProveedor)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editTipoProveedorObj = {};

      Object.entries(TipoProveedor).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `tipo-proveedor-${fieldName}`;
        editTipoProveedorObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditTipoProveedor(Number(TipoProveedor.id));
      setEnableForm(true);
      setLoadingText('Editando tipo proveedor...');
      
      validation.setValues(editTipoProveedorObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Tipos de Proveedor", "Permisos");
    }
  };

  const deleteTipoProveedorModal = (tipoProveedor)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarTipoProveedor(tipoProveedor);
      setConfirmModalEliminarTipoProveedor(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Tipos de Proveedor", "Permisos");
    }
  };
  
  const deleteTipoProveedorConfirm = ()=>{
    cancelTipoProveedor();
    setConfirmEliminarTipoProveedor(false);
    setConfirmModalEliminarTipoProveedor(false);
    

    setLoadingText('Eliminando tipo proveedor...')

    dispatch(deleteProviderType(confirmEliminarTipoProveedor.id, ()=>{
      cancelTipoProveedor();
      loadTiposProveedor();
      toastr.success("Tipo de Proveedor eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesProviderTypeForm,
    validationSchema: Yup.object({
      'tipo-proveedor-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let tipoProveedorValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tipo-proveedor-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          tipoProveedorValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");

      if(!editTipoProveedorId){
        dispatch(createProviderType(tipoProveedorValues, (response)=>{
          if(response.success){
            cancelTipoProveedor();
            loadTiposProveedor();
            toastr.success("Nuevo Tipo de Proveedor registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editProviderType(tipoProveedorValues, (response)=>{
          if(response.success){
            cancelTipoProveedor();
            loadTiposProveedor();
            toastr.success("Tipo de Proveedor editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando tipo proveedor...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelTipoProveedor = ()=>{
    setEditTipoProveedor(false);
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editTipoProveedorFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteTipoProveedorModal(row)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
            </p>);
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        }
    ],
    []
  );
  const loadTiposProveedor = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getProviderTypes(null, (resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);
      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadTiposProveedor();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Tipos Proveedor" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editTipoProveedorId===false ? 'Nuevo Tipo Proveedor' : 'Editando Tipo Proveedor'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={12}>
                          <label className="col-md-12 col-form-label">Nombre *</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="tipo-proveedor-nombre"
                              value={validation.values['tipo-proveedor-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['tipo-proveedor-nombre'] && validation.errors['tipo-proveedor-nombre'] && !validation.values['tipo-proveedor-nombre'] ? true : false
                              }
                            />
                            {validation.touched['tipo-proveedor-nombre'] && validation.errors['tipo-proveedor-nombre'] && !validation.values['tipo-proveedor-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['tipo-proveedor-nombre']}</FormFeedback>
                            ) : null}
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
                                <Button type="reset" color="warning" onClick={cancelTipoProveedor} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR TIPOS DE PROVEEDOR</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR TIPOS DE PROVEEDOR</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo tipo de proveedor
                  </Button>
                  <br/>
                  <br/>
                </Col>
              </Row>
            )}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={dataProviderTypes}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tipo proveedor..." ?
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
        isOpen={confirmModalEliminarTipoProveedor}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarTipoProveedor(false);
              setConfirmModalEliminarTipoProveedor(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el tipo de proveedor <b>{(confirmEliminarTipoProveedor!==false ? confirmEliminarTipoProveedor.nombre : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteTipoProveedorConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarTipoProveedor(false);
            setConfirmModalEliminarTipoProveedor(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexTiposProveedor);

IndexTiposProveedor.propTypes = {
  history: PropTypes.object,
};