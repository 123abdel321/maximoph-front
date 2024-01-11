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
import { getClientUsers, createClientUser, editClientUser, deleteClientUser, getUsersRoles } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

const IndexUsuarios = props => {

  //meta title
  document.title = "Usuarios | Maximo PH";

  const dispatch = useDispatch();

  const { loadingGrid, dataClientUsers } = useSelector(state => ({
    dataClientUsers: state.Users.clientUsers,
    loadingGrid: state.Users.loadingGrid
  }));

  const initialValuesClientUserForm = {
    'cliente-usuario-email': '',
    'cliente-usuario-nombre': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [userRole, setUserRole] = useState('');
  const [dataRoles, setDataRoles] = useState([]);
  const [editClienteUsuarioId, setEditClienteUsuarioId] = useState(false);
  const [confirmEliminarClientUsuario, setConfirmEliminarClientUsuario] = useState(false);
  const [confirmModalEliminarClienteUsuario, setConfirmModalEliminarClienteUsuario] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editClientUserFn = (clienteUsuario)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editClientUserObj = {};

      Object.entries(clienteUsuario).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `cliente-usuario-${fieldName}`;
        editClientUserObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setUserRole({value:clienteUsuario.id_rol, label: clienteUsuario.nombre_rol});

      setEditClienteUsuarioId(Number(clienteUsuario.id));
      setLoadingText('Editando usuario...');
      setEnableForm(true);
      
      validation.setValues(editClientUserObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar usuarios", "Permisos");
    }
  };

  const deleteClienteUsuarioModal = (clienteUsuario)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarClientUsuario(clienteUsuario);
      setConfirmModalEliminarClienteUsuario(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar usuarios", "Permisos");
    }
  };
  
  const deleteClienteUsuarioConfirm = ()=>{
    cancelClienteUsuario();
    setConfirmEliminarClientUsuario(false);
    setConfirmModalEliminarClienteUsuario(false);
    

    setLoadingText('Eliminando usuario...')

    dispatch(deleteClientUser({email: confirmEliminarClientUsuario.email}, ()=>{
      cancelClienteUsuario();
      loadClienteUsuarios();
      toastr.success("Usuario eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesClientUserForm,
    validationSchema: Yup.object({
      'cliente-usuario-nombre': Yup.string().required("Por favor ingresa el nombre"),
      'cliente-usuario-email': Yup.string().required("Por favor ingresa el correo electrónico")
    }),
    onSubmit: (values) => {
      let clientUserValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('cliente-usuario-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          clientUserValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!userRole){
        toastr.error("Seleccione un rol", "Error de validación");
        return;
      }
      
      if((!editClienteUsuarioId && (!clientUserValues['password'] || !clientUserValues['confirmar_password']))){
        toastr.error("Ingrese y confirme una contraseña", "Error de validación");
        return;
      }
      
      if(clientUserValues['password']!=clientUserValues['confirmar_password']){
        toastr.error("La contraseña debe ser igual a la confirmación", "Error de validación");
        return;
      }

      clientUserValues["id_persona_maximo"] = 1;
      
      clientUserValues["role"] = userRole.value;

      clientUserValues["id_rol"] = userRole.value;
      
      setLoadingText("Guardando ...");

      if(!editClienteUsuarioId){
        dispatch(createClientUser(clientUserValues, (response)=>{
          if(response.success){
            cancelClienteUsuario();
            loadClienteUsuarios();
            toastr.success("Nuevo usuario registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editClientUser(clientUserValues, (response)=>{
          if(response.success){
            cancelClienteUsuario();
            loadClienteUsuarios();
            toastr.success("Usuario editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando usuario...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelClienteUsuario = ()=>{
    setEditClienteUsuarioId(false);
    setLoadingText(false);
    setEnableForm(false);
    setUserRole('');
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editClientUserFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteClienteUsuarioModal(row)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
            </p>);
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        },
        {
            Header: 'Correo Electrónico',
            accessor: 'email',
        },
        {
            Header: 'Rol',
            accessor: 'nombre_rol',
        }
    ],
    []
  );

  const loadClienteUsuarios = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getUsersRoles(null, (roles)=>{ 
      let newDataRoles = [];

      roles.map(role=>newDataRoles.push({value:role.id,label:role.nombre}));

      setDataRoles(newDataRoles);

      dispatch(getClientUsers(null, (resp)=>{ 

        let newAccessModule = accessModule;
        resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));
  
        setAccessModule(newAccessModule);

        setLoadingText('');
      }));
    }));
  };

  useEffect(()=>{
    loadClienteUsuarios();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Accesos" breadcrumbItem="Usuarios" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editClienteUsuarioId===false ? 'Nuevo usuario' : 'Editando usuario'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Nombre *</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="cliente-usuario-nombre"
                              value={validation.values['cliente-usuario-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['cliente-usuario-nombre'] && validation.errors['cliente-usuario-nombre'] && !validation.values['cliente-usuario-nombre'] ? true : false
                              }
                            />
                            {validation.touched['cliente-usuario-nombre'] && validation.errors['cliente-usuario-nombre'] && !validation.values['cliente-usuario-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-usuario-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Correo Electrónico *</label>
                          <div className="col-md-12">
                            <Input
                              type="email"
                              className="form-control"
                              readOnly={(editClienteUsuarioId==false?false:true)}
                              name="cliente-usuario-email"
                              value={validation.values['cliente-usuario-email'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['cliente-usuario-email'] && validation.errors['cliente-usuario-email'] && !validation.values['cliente-usuario-email'] ? true : false
                              }
                            />
                            {validation.touched['cliente-usuario-email'] && validation.errors['cliente-usuario-email'] && !validation.values['cliente-usuario-email'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-usuario-email']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Rol *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={userRole}
                              data={dataRoles}
                              onChange={(val)=>setUserRole(val)}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Contraseña</label>
                          <div className="col-md-12">
                            <Input
                              type="password"
                              className="form-control"
                              name="cliente-usuario-password"
                              value={validation.values['cliente-usuario-password'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Confirmar Contraseña</label>
                          <div className="col-md-12">
                            <Input
                              type="password"
                              className="form-control"
                              name="cliente-usuario-confirmar-password"
                              value={validation.values['cliente-usuario-confirmar-password'] || ""}
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
                                <Button type="reset" color="warning" onClick={cancelClienteUsuario} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR USUARIOS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR USUARIOS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(<Card>
              <Row>
                <Col xl={3}>
                  <p className="text-center">
                    <br />
                    <Button onClick={()=>setEnableForm(true)} color="primary">
                      Nuevo usuario
                    </Button>
                    <br />
                  </p>
                </Col>
              </Row>
            </Card>)}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (<TableContainer
              columns={columns}
              data={dataClientUsers}
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
        isOpen={confirmModalEliminarClienteUsuario}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarClientUsuario(false);
              setConfirmModalEliminarClienteUsuario(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el usuario <b>{(confirmEliminarClientUsuario!==false ? confirmEliminarClientUsuario.email : '')}</b>?, Toda la información asociada a él no se perderá, pero él ya no tendrá acceso a los datos.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteClienteUsuarioConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarClientUsuario(false);
            setConfirmModalEliminarClienteUsuario(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexUsuarios);

IndexUsuarios.propTypes = {
  history: PropTypes.object,
};