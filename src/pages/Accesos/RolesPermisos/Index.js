import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  Collapse,
  CardBody,
  Button,
  Form,
  Spinner,
  CardTitle,
} from "reactstrap";

// Formik validation
import { useFormik } from "formik";
import classnames from "classnames";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getUsersRoles, getRolePermissions, editRolePermissions } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexRolesPermisos = props => {

  //meta title
  document.title = "Roles Permisos | Maximo PH";

  const dispatch = useDispatch();

  const { loadingGrid, dataUserRoles } = useSelector(state => ({
    dataUserRoles: state.UsersRoles.usersRoles,
    loadingGrid: state.UsersRoles.loadingGrid
  }));

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [editRolPermissions, setEditRolPermissions] = useState(false);
  const [dataRolePermissions, setDataRolePermissions] = useState([]);
  const [dataRolePermissionsUpdate, setDataRolePermissionsUpdate] = useState([]);
  const [viewOnlyPermissions, setViewOnlyPermissions] = useState(false);
  const [firstLoadedPermissions, setFirstLoadedPermissions] = useState(false);
  const [accordionPermissions, setAccordionPermissions] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const viewRolePermissionsDetail = (role, edit)=>{
    if(accessModule.INGRESAR==true){
      if(edit&&accessModule.ACTUALIZAR==true){ 
        setEditRolPermissions(role);
      }else{
        if(edit){
          toastr.options = { positionClass: 'toast-top-right' };
          toastr.warning("No tienes acceso a editar Roles Permisos", "Permisos");
        }
        setViewOnlyPermissions(role.nombre);
      }

      setLoadingText("Cargando ...");
      dispatch(getRolePermissions((response)=>{
        setFirstLoadedPermissions(true);
        setAccordionPermissions(false); 

        setLoadingText("Viendo datos");
        setDataRolePermissions(response);
        
        let newDataRolePermissionsUpdate = [];

        response.map(module=>{
          module.permissions.map(permission=>{
            if(Number(permission.asignado)) newDataRolePermissionsUpdate.push(Number(permission.id_permiso));
          });
        });

        setDataRolePermissionsUpdate(newDataRolePermissionsUpdate);

      }, role.id));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a visualizar Roles Permisos", "Permisos");
    }
  };

  const changeCheckedRolPermission = (permission)=>{
    let newDataRolePermissionsUpdate = dataRolePermissionsUpdate;

    if(dataRolePermissionsUpdate.indexOf(permission)>=0){
      newDataRolePermissionsUpdate = newDataRolePermissionsUpdate.filter(permissionI => Number(permissionI) !== Number(permission));
    }else{
      newDataRolePermissionsUpdate.push(permission);
    }

    setDataRolePermissionsUpdate(newDataRolePermissionsUpdate);
  };

  const submitNewRolePermissions = ()=>{
    setLoadingText("Guardando ...");

    if(editRolPermissions){
      
      let newDataRolePermissionsUpdate = dataRolePermissionsUpdate;
          newDataRolePermissionsUpdate = Array.from(new Set(newDataRolePermissionsUpdate));
          newDataRolePermissionsUpdate = newDataRolePermissionsUpdate.join(",");

      newDataRolePermissionsUpdate = {
        permissions: newDataRolePermissionsUpdate,
        role: editRolPermissions.id
      };

      dispatch(editRolePermissions(newDataRolePermissionsUpdate, (response)=>{

        if(response.success){
          cancelRolePermission();
          loadUsuariosRoles();
          toastr.success("Permisos del rol editados.", "Operación Ejecutada");
        }else{
          setLoadingText("Editando permisos del rol...");
          toastr.error(response.error, "Error en la operación");
        }
      }));

    }
  };

  const cancelRolePermission = ()=>{
    setDataRolePermissions([]);
    setViewOnlyPermissions(false);
    setEditRolPermissions(false);
    setLoadingText(false);
    setFirstLoadedPermissions(false);
    setAccordionPermissions(false); 
  };

  
  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            let classViewBtn = accessModule.INGRESAR==true ? "info" : "secondary";
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";

            if(row.id_cliente){
              return (<div className="text-center">
                <Button color={classEditBtn} className="btn-sm" onClick={()=>{viewRolePermissionsDetail(row, true)}}> 
                    <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Editar permisos</span>
                </Button>
                {' '}
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{viewRolePermissionsDetail(row, false)}}> 
                    <i className="mdi-eye font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Ver permisos</span>
                </Button>
              </div>);
            }else{
              return (<p className="text-center">
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{viewRolePermissionsDetail(row, false)}}> 
                  <span className="el-desktop">Ver permisos</span>
              </Button>
              </p>);
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

    dispatch(getUsersRoles(null, (userRolesR, resp)=>{ 
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
          <Breadcrumbs title="Accesos" breadcrumbItem="Roles Permisos" />

          {accessModule.CREAR==true && dataRolePermissions.length?
            (<Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">{viewOnlyPermissions ? `Permisos del rol ${viewOnlyPermissions}` : `Editando permisos del rol ${editRolPermissions.nombre}`}</CardTitle>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      submitNewRolePermissions();

                      return false;
                    }}>
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
                                <Button type="reset" color="warning" onClick={cancelRolePermission} >
                                  Cancelar
                                </Button>
                                {" "}
                                {editRolPermissions&&(<Button type="submit" color="primary">
                                  Grabar
                                </Button>)}
                              </>)
                          }
                        </Col>
                      </Row>
                      <br />
                      <div className="accordion" id="accordion">
                        {dataRolePermissions.map((roleModule, posModule)=>{
                          return (<div className="accordion-item" key={posModule}>
                              <h2 className="accordion-header" id="headingOne">
                                <button
                                  className={classnames(
                                    "accordion-button",
                                    "fw-medium",
                                    { collapsed: ((roleModule.module_name!=accordionPermissions)&&!firstLoadedPermissions) }
                                  )}
                                  type="button"
                                  onClick={()=>{ 
                                    if(firstLoadedPermissions) setFirstLoadedPermissions(false);
                                    setAccordionPermissions(roleModule.module_name); 
                                  }}
                                  style={{ cursor: "pointer" }}
                                >
                                  {roleModule.module_name}
                                </button>
                              </h2>

                              <Collapse isOpen={((roleModule.module_name==accordionPermissions)||firstLoadedPermissions)} className="accordion-collapse">
                                <div className="accordion-body">
                                  <Row>
                                    {roleModule.permissions.map((permission, posPermissions)=>{
                                        let colSize = Math.round(18/roleModule.permissions.length);
                                        return (<Col md={colSize} key={posPermissions}>
                                          <div className="form-check form-switch form-switch-lg mb-3">
                                            <input
                                              type="checkbox"
                                              className="form-check-input"
                                              name={`rol-permiso-${permission.id_permiso}`}
                                              disabled={(viewOnlyPermissions?true:false)}
                                              defaultChecked={(permission.asignado==0?false:true)}
                                              onChange={(e)=>{
                                                let permission = Number(e.target.name.replaceAll('rol-permiso-',''));
                                                
                                                changeCheckedRolPermission(permission);
                                              }}
                                            />
                                            <label className="form-check-label" htmlFor="customSwitchsizelg">
                                              {permission.permiso_nombre}: {permission.permiso_descripcion}
                                            </label>
                                          </div>
                                        </Col>);
                                      })}
                                  </Row>
                                </div>
                              </Collapse>
                            </div>)
                        })}
                      </div>
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
                                <Button type="reset" color="warning" onClick={cancelRolePermission} >
                                  Cancelar
                                </Button>
                                {" "}
                                {editRolPermissions&&(<Button type="submit" color="primary">
                                  Grabar
                                </Button>)}
                              </>)
                          }
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>)
            :
            (<></>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR ROLES PERMISOS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR ROLES PERMISOS</b></p></Col></Row></Card>)}
          
          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText ?
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
            </Row>)
            }
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(IndexRolesPermisos);

IndexRolesPermisos.propTypes = {
  history: PropTypes.object,
};