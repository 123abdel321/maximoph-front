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
  DropdownMenu,
  ButtonDropdown,
  DropdownItem,
  DropdownToggle
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

import TableContainer from '../../../components/Common/TableContainer';

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';


// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getProviders, createProvider, editProvider, deleteProvider, getPersons, getProviderTypes, downloadTableImporterTemplate, uploadTableImporterTemplate } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const Proveedores = props => {

  //meta title
  document.title = "Proveedores | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataProviders } = useSelector(state => ({
    loading: state.Providers.loading,
    dataProviders: state.Providers.providers,
    loadingGrid: state.Providers.loadingGrid
  }));

  const initialValuesProviderTypeForm = {
    'proveedor-nombre-negocio': '',
    'proveedor-observacion': ''
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

  const [persona, setPersona] = useState(null);
  const [personasErp, setPersonasErp] = useState([]);
  const [tipo, setTipo] = useState(null);
  const [tipos, setTipos] = useState([]);
  const [editProveedorId, setEditProveedor] = useState(false);
  const [confirmEliminarProveedor, setConfirmEliminarProveedor] = useState(false);
  const [confirmModalEliminarProveedor, setConfirmModalEliminarProveedor] = useState(false);
  
  const [loadingFile, setLoadingFile] = useState(false);
  const [errorImportador, setErrorImportador] = useState(false);
  const [errorImportadorExtra, setErrorImportadorExtra] = useState(false);
  const [dropdowmImporterProviders, setDropdowmImporterProviders] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editProveedorFn = (proveedor)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editProveedorObj = {};

      Object.entries(proveedor).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `proveedor-${fieldName}`;
        editProveedorObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditProveedor(Number(proveedor.id));

      if(proveedor.id_actividad){
        setTipo({label: proveedor.actividadProveedor, value: proveedor.id_actividad});
      }else{
        setTipo(null);
      }
      
      if(proveedor.id_persona){
        setPersona({label: proveedor.nombreProveedor, value: proveedor.id_persona});
      }else{
        setPersona(null);
      }
      
      setEnableForm(true);
      setLoadingText('Editando proveedor...');
      
      validation.setValues(editProveedorObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar un proveedor", "Permisos");
    }
  };

  const deleteProveedorModal = (proveedor)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarProveedor(proveedor);
      setConfirmModalEliminarProveedor(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar un proveedor", "Permisos");
    }
  };
  
  const deleteProveedorConfirm = ()=>{
    cancelProveedor();
    setConfirmEliminarProveedor(false);
    setConfirmModalEliminarProveedor(false);
    
    setLoadingText('Eliminando proveedor...')

    dispatch(deleteProvider(confirmEliminarProveedor.id, ()=>{
      cancelProveedor();
      loadProveedores();
      toastr.success("Proveedor eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesProviderTypeForm,
    validationSchema: Yup.object({
      'proveedor-nombre-negocio': Yup.string().required("Por favor ingresa el nombre de negocio"),
      'proveedor-observacion': Yup.string().required("Por favor ingresa la descripción")
    }),
    onSubmit: (values) => {
      
      let proveedorValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('proveedor-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","actividadProveedor","celularProveedor","created_at","created_by","direccionProveedor","emailProveedor","nombreProveedor","telefonoProveedor","updated_at","updated_by"].indexOf(fieldName)<0){
          proveedorValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      proveedorValues["id_persona"] = (persona ? persona.value : null);
      proveedorValues["id_actividad"] = (tipo ? tipo.value : null);

      setLoadingText("Guardando ...");

      if(!editProveedorId){
        dispatch(createProvider(proveedorValues, (response)=>{
          if(response.success){
            cancelProveedor();
            loadProveedores();
            toastr.success("Nuevo Proveedor registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editProvider(proveedorValues, (response)=>{
          if(response.success){
            cancelProveedor();
            loadProveedores();
            toastr.success("Proveedor editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando proveedor...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelProveedor = ()=>{
    setTipo(null);
    setEnableForm(false);
    setPersona(null);
    setEditProveedor(false);
    setLoadingText(false);
    validation.handleReset();
  };

  
  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: providerType => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

            return (<p className="text-center">
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editProveedorFn(providerType)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteProveedorModal(providerType)}}> 
                  <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Eliminar</span>
              </Button>
            </p>)
          }
        },
        {
            Header: 'Tipo Proveedor',
            accessor: 'actividadProveedor',
        },
        {
            Header: 'Proveedor',
            accessor: 'nombreProveedor',
        },
        {
            Header: 'Nombre Negocio',
            accessor: 'nombre_negocio',
        },
        {
            Header: 'Observación',
            accessor: 'observacion',
        }
    ],
    []
  );

  const loadProveedores = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPersons(null, (dPersons)=>{ 
      setPersonasErp(dPersons);
      dispatch(getProviderTypes(null, (providerTypes)=>{ 
        let tiposCombo = [];
        providerTypes.data.map(providerType=>{
          tiposCombo.push({
            value: providerType.id,
            label: providerType.nombre
          });
        });

        setTipos(tiposCombo);

        dispatch(getProviders(null, (resp)=>{
          let newAccessModule = accessModule;
          resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

          setAccessModule(newAccessModule);

          setLoadingText('');
        }));
      }));
    },true));
  };

  useEffect(()=>{
    loadProveedores();
  },[]);
  
  const downloadCSVImporter = (origin)=>{
    
    setLoadingFile(`descargando-${origin}`);

    dispatch(downloadTableImporterTemplate(origin, (resp)=>{
      let columns = resp.columns.join(";");
      
      const blob = new Blob([columns], { type: 'text/csv' });
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `${resp.template_name}.csv`;
      
      a.click();

      URL.revokeObjectURL(blobUrl);
    
      setLoadingFile(false);
    }));
  };
  
  const uploadCSVImporter = (files, origin)=>{
    if(files[0].type=='text/csv'){
      const templateProperties = new FormData();
      templateProperties.append('template', files[0]);
      templateProperties.append('origin', origin);
      
      setLoadingFile(`importando-${origin}`);

      dispatch(uploadTableImporterTemplate(templateProperties, (response)=>{
        setLoadingFile(false);
        
        if(response.success){
          toastr.success(`Se importaron ${response.registers} registros`, "Operación Ejecutada");
          loadPersons();
        }else{
          switch(response.error){
            case "template-format":
              setErrorImportador(`Se cargó una plantilla con un formato incorrecto, por favor descargue la plantilla directamente de Máximo PH, no altere el formato, no le agregue fórmulas de excel, hojas adicionales. e intente cargarla nuevamente.`);
              setErrorImportadorExtra(false);
            break;
            case "template-empty":
              setErrorImportador(`Se cargó una plantilla vacia, por favor valide e intente cargarla nuevamente.`);
              setErrorImportadorExtra(false);
            break;
            case "in-file":
              setErrorImportador(`Se encontraron ${response.errors.length} errores en los registros importados, por favor validar el detalle, corregirlos e intentar cargarlo de nuevo.`);

              //DOWNLOAD FILE WITH ERRORS
              let csvErrors = "Linea;Error\n";
              
              response.errors.map(err=>{ csvErrors += `${err[0]};${err[1]}\n`; })

              setErrorImportadorExtra(csvErrors);
            break;
          }
        }
      }));
    }else{
      toastr.error("Por favor seleccione una plantilla válida", "Error de validación");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Proveedores" />
          {
            accessModule.CREAR==true && enableForm==true &&
              (<Row>
                <Col xl={12}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h5 mb-4">{editProveedorId===false ? 'Nuevo Proveedor' : 'Editando Proveedor'}</CardTitle>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          
                          validation.submitForm();

                          return false;
                        }}>
                        <Row>
                          <Col md={5}>
                              <label className="col-md-12 col-form-label">Persona <span className="text-muted m-b-15">
                                (Sólo personas con <code>Número de Documento</code>.)
                              </span></label>
                              
                              <div className="col-md-12">
                                <RemoteCombo 
                                  value={persona}
                                  data={personasErp}
                                  onChange={(val)=>setPersona(val)}
                                />
                              </div>
                          </Col>
                          <Col md={3}>
                              <label className="col-md-12 col-form-label">Tipo </label>
                              
                              <div className="col-md-12">
                                <RemoteCombo 
                                  value={tipo}
                                  data={tipos}
                                  disabled={!tipos.length}
                                  onChange={(val)=>setTipo(val)}
                                />
                              </div>
                          </Col>
                          <Col md={4}>
                            <label className="col-md-12 col-form-label">Nombre Negocio*</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="proveedor-nombre-negocio"
                                value={validation.values['proveedor-nombre-negocio'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched['proveedor-nombre-negocio'] && validation.errors['proveedor-nombre-negocio'] && !validation.values['proveedor-nombre-negocio'] ? true : false
                                }
                              />
                              {validation.touched['proveedor-nombre-negocio'] && validation.errors['proveedor-nombre-negocio'] && !validation.values['proveedor-nombre-negocio'] ? (
                                <FormFeedback type="invalid">{validation.errors['proveedor-nombre-negocio']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            <label className="col-md-12 col-form-label">Observación*</label>
                            <div className="col-md-12">
                              <Input
                                type="textarea"
                                className="form-control"
                                name="proveedor-observacion"
                                value={validation.values['proveedor-observacion'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched['proveedor-observacion'] && validation.errors['proveedor-observacion'] && !validation.values['proveedor-observacion'] ? true : false
                                }
                              />
                              {validation.touched['proveedor-observacion'] && validation.errors['proveedor-observacion'] && !validation.values['proveedor-observacion'] ? (
                                <FormFeedback type="invalid">{validation.errors['proveedor-observacion']}</FormFeedback>
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
                                  <Button type="reset" color="warning" onClick={cancelProveedor} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR PROVEEDORES</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR PROVEEDORES</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true&&loadingFile==false&& !loadingText && enableForm==false &&(
              <Row>
                <Col xl={4}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo proveedor
                  </Button>
                </Col>
                <Col xl={8}>
                  <ButtonDropdown isOpen={dropdowmImporterProviders} toggle={() => setDropdowmImporterProviders(!dropdowmImporterProviders)}>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="btn btn-info"
                    >
                      <i className="bx bx-import" style={{ fontSize: '18px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Importador Proveedores
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={()=>downloadCSVImporter('proveedores')}>
                        <Button color={'info'} className="btn-m"> 
                          <i className="bx bx-download font-size-14 align-middle me-2"></i>
                          {'Descargar Plantilla Proveedores'}
                        </Button>
                      </DropdownItem>
                      <DropdownItem>
                        <Dropzone onDrop={csvFile => {uploadCSVImporter(csvFile, 'proveedores')}} >
                          {({ getRootProps, getInputProps }) => (
                            <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                              <input {...getInputProps()} />
                              <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                              {'Importar Proveedores'}
                            </Button>
                          )}
                        </Dropzone>
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                </Col>
                <br/>
                <br/>
                <br/>
              </Row>
            )}

            {accessModule.CREAR==true&&loadingFile!=false&&(<Card>
              <Row>
                <Col xl={12}>
                  <p className="text-center">
                    <br />
                    <Spinner className="ms-12" color="dark" />
                  </p>
                </Col>
              </Row>
            </Card>)}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={dataProviders}
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
        isOpen={confirmModalEliminarProveedor}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarProveedor(false);
              setConfirmModalEliminarProveedor(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el proveedor <b>{(confirmEliminarProveedor!==false ? confirmEliminarProveedor.nombre_negocio : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteProveedorConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarProveedor(false);
            setConfirmModalEliminarProveedor(false);
          }}>No</button>
        </div>
      </Modal>
      
      {/*MODAL ERROR IMPORTADOR*/}
      <ModalConfirmAction 
        confirmModal={(errorImportador?true:false)}
        information={true}
        error={true}
        onClose={()=>{
          setErrorImportador(false);

          if(errorImportadorExtra){
            const blob = new Blob([errorImportadorExtra], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `importador_maximoph_errores.csv`;
            
            a.click();
  
            URL.revokeObjectURL(blobUrl);
          }

          setErrorImportadorExtra(false);
        }}
        title={"Error importación"}
        description={(errorImportador||'')}
      />
      {/*MODAL ERROR IMPORTADOR*/}
    </React.Fragment>
  );
};

export default withRouter(Proveedores);

Proveedores.propTypes = {
  history: PropTypes.object,
};