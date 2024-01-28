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
import { getVehicleTypes, createVehicleType, editVehicleType, deleteVehicleType } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexTipoVehiculo = props => {

  //meta title
  document.title = "Tipos Vehiculo | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataVehicleTypes } = useSelector(state => ({
    loading: state.VehicleTypes.loading,
    dataVehicleTypes: state.VehicleTypes.vehicleTypes,
    loadingGrid: state.VehicleTypes.loadingGrid
  }));

  const initialValuesVehicleTypeForm = {
    'tipo-vehiculo-nombre': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [editTipoVehiculoId, setEditTipoVehiculo] = useState(false);
  const [confirmEliminarTipoVehiculo, setConfirmEliminarTipoVehiculo] = useState(false);
  const [confirmModalEliminarTipoVehiculo, setConfirmModalEliminarTipoVehiculo] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editTipoVehiculoFn = (TipoVehiculo)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editTipoVehiculoObj = {};

      Object.entries(TipoVehiculo).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `tipo-vehiculo-${fieldName}`;
        editTipoVehiculoObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditTipoVehiculo(Number(TipoVehiculo.id));
      
      setEnableForm(true);

      setLoadingText('Editando tipo vehiculo...');
      
      validation.setValues(editTipoVehiculoObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Tipos de Vehículos", "Permisos");
    }
  };

  const deleteTipoVehiculoModal = (tipoVehiculo)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarTipoVehiculo(tipoVehiculo);
      setConfirmModalEliminarTipoVehiculo(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Tipos de Vehículos", "Permisos");
    }
  };
  
  const deleteTipoVehiculoConfirm = ()=>{
    cancelTipoVehiculo();
    setConfirmEliminarTipoVehiculo(false);
    setConfirmModalEliminarTipoVehiculo(false);
    

    setLoadingText('Eliminando tipo vehiculo...')

    dispatch(deleteVehicleType(confirmEliminarTipoVehiculo.id, ()=>{
      cancelTipoVehiculo();
      loadTiposVehiculo();
      toastr.success("Tipo de Vehículo eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesVehicleTypeForm,
    validationSchema: Yup.object({
      'tipo-vehiculo-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let tipoVehiculoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('tipo-vehiculo-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","value","label"].includes(fieldName)===false){
          tipoVehiculoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");

      if(!editTipoVehiculoId){
        dispatch(createVehicleType(tipoVehiculoValues, (response)=>{
          if(response.success){
            cancelTipoVehiculo();
            loadTiposVehiculo();
            toastr.success("Nuevo Tipo de Vehículo registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editVehicleType(tipoVehiculoValues, (response)=>{
          if(response.success){
            cancelTipoVehiculo();
            loadTiposVehiculo();
            toastr.success("Tipo de Vehículo editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando tipo vehiculo...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelTipoVehiculo = ()=>{
    setEditTipoVehiculo(false);
    setEnableForm(false);
    setLoadingText(false);
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editTipoVehiculoFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteTipoVehiculoModal(row)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
            </p>)
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        }
    ],
    []
  );

  const loadTiposVehiculo = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getVehicleTypes(null, (resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);
      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadTiposVehiculo();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Tipos Vehículo" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editTipoVehiculoId===false ? 'Nuevo Tipo Vehículo' : 'Editando Tipo Vehículo'}</CardTitle>
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
                              name="tipo-vehiculo-nombre"
                              value={validation.values['tipo-vehiculo-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['tipo-vehiculo-nombre'] && validation.errors['tipo-vehiculo-nombre'] && !validation.values['tipo-vehiculo-nombre'] ? true : false
                              }
                            />
                            {validation.touched['tipo-vehiculo-nombre'] && validation.errors['tipo-vehiculo-nombre'] && !validation.values['tipo-vehiculo-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['tipo-vehiculo-nombre']}</FormFeedback>
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
                                <Button type="reset" color="warning" onClick={cancelTipoVehiculo} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR TIPOS DE VEHÍCULO</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR TIPOS DE VEHÍCULO</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo tipo de vehículo
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
                  data={dataVehicleTypes}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tipo vehiculo..." ?
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
        isOpen={confirmModalEliminarTipoVehiculo}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarTipoVehiculo(false);
              setConfirmModalEliminarTipoVehiculo(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el tipo de vehiculo <b>{(confirmEliminarTipoVehiculo!==false ? confirmEliminarTipoVehiculo.nombre : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteTipoVehiculoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarTipoVehiculo(false);
            setConfirmModalEliminarTipoVehiculo(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexTipoVehiculo);

IndexTipoVehiculo.propTypes = {
  history: PropTypes.object,
};