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
import { getUsersRoles, createUserRol, editUserRol, deleteUserRol } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexUsuariosRoles = props => {

  //meta title
  document.title = "Usuarios Roles | Maximo PH";

  const dispatch = useDispatch();

  const { loadingGrid, dataUserRoles } = useSelector(state => ({
    dataUserRoles: state.UsersRoles.usersRoles,
    loadingGrid: state.UsersRoles.loadingGrid
  }));

  const initialValuesUserRolForm = {
    'usuario-rol-nombre': '',
    'usuario-rol-descripcion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [editUsuarioRolId, setEditUsuarioRol] = useState(false);
  const [confirmEliminarUsuarioRol, setConfirmEliminarUsuarioRol] = useState(false);
  const [confirmModalEliminarUsuarioRol, setConfirmModalEliminarUsuarioRol] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editUserRolFn = (usuarioRol)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editUsuarioRolObj = {};

      Object.entries(usuarioRol).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `usuario-rol-${fieldName}`;
        editUsuarioRolObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditUsuarioRol(Number(usuarioRol.id));

      setEnableForm(true);
      setLoadingText('Editando rol...');
      
      validation.setValues(editUsuarioRolObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Usuario Roles", "Permisos");
    }
  };

  const deleteUsuarioRolModal = (usuarioRol)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarUsuarioRol(usuarioRol);
      setConfirmModalEliminarUsuarioRol(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Usuario Roles", "Permisos");
    }
  };
  
  const deleteUsuarioRolConfirm = ()=>{
    cancelUsuarioRol();
    setConfirmEliminarUsuarioRol(false);
    setConfirmModalEliminarUsuarioRol(false);
    

    setLoadingText('Eliminando rol...')

    dispatch(deleteUserRol(confirmEliminarUsuarioRol.id, ()=>{
      cancelUsuarioRol();
      loadUsuariosRoles();
      toastr.success("Rol eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesUserRolForm,
    validationSchema: Yup.object({
      'usuario-rol-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let usuarioRolValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('usuario-rol-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          usuarioRolValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");

      if(!editUsuarioRolId){
        dispatch(createUserRol(usuarioRolValues, (response)=>{
          if(response.success){
            cancelUsuarioRol();
            loadUsuariosRoles();
            toastr.success("Nuevo rol registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editUserRol(usuarioRolValues, (response)=>{
          if(response.success){
            cancelUsuarioRol();
            loadUsuariosRoles();
            toastr.success("Rol editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando rol...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelUsuarioRol = ()=>{
    setEditUsuarioRol(false);
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
            if(row.id_cliente){
              let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
              let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

              return (<p className="text-center">
                <Button color={classEditBtn} className="btn-sm" onClick={()=>{editUserRolFn(row)}}> 
                    <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Editar</span>
                </Button>
                {' '}
                <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteUsuarioRolModal(row)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
              </p>);
            }else{
              return (<p className="text-center"><Button className="btn-sm" color={"secondary"}><b>NO EDITABLE</b></Button></p>);
            }
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

  const loadUsuariosRoles = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getUsersRoles(null, (usersR, resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);
      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadUsuariosRoles();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Accesos" breadcrumbItem="Usuarios Roles" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editUsuarioRolId===false ? 'Nuevo rol' : 'Editando rol'}</CardTitle>
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
                              name="usuario-rol-nombre"
                              value={validation.values['usuario-rol-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['usuario-rol-nombre'] && validation.errors['usuario-rol-nombre'] && !validation.values['usuario-rol-nombre'] ? true : false
                              }
                            />
                            {validation.touched['usuario-rol-nombre'] && validation.errors['usuario-rol-nombre'] && !validation.values['usuario-rol-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['usuario-rol-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={6}>
                          <label className="col-md-12 col-form-label">Descripción</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="usuario-rol-descripcion"
                              value={validation.values['usuario-rol-descripcion'] || ""}
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
                                <Button type="reset" color="warning" onClick={cancelUsuarioRol} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR USUARIOS ROLES</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR USUARIOS ROLES</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={3}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo rol
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
                  data={dataUserRoles}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando rol..." ?
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
        isOpen={confirmModalEliminarUsuarioRol}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarUsuarioRol(false);
              setConfirmModalEliminarUsuarioRol(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el rol <b>{(confirmEliminarUsuarioRol!==false ? confirmEliminarUsuarioRol.nombre : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este rol en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteUsuarioRolConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarUsuarioRol(false);
            setConfirmModalEliminarUsuarioRol(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexUsuariosRoles);

IndexUsuariosRoles.propTypes = {
  history: PropTypes.object,
};