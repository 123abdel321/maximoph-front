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
  Spinner,
  CardTitle,
  DropdownMenu,
  ButtonDropdown,
  FormFeedback,
  DropdownItem,
  DropdownToggle
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getPersons, createPerson, editPerson, deletePerson, syncPersonERP, getCities, downloadTableImporterTemplate, uploadTableImporterTemplate } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

const IndexPersonas = props => {

  //meta title
  document.title = "Personas | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataPersons, dataCities } = useSelector(state => ({
    loading: state.Person.loading,
    dataPersons: state.Person.persons,
    loadingGrid: state.Person.loadingGrid,
    dataCities: state.Cities.cities
  }));

  const initialValuesPersonForm = {
    'personas-tipo-documento': '0',
    'personas-numero-documento': '',
    'personas-fecha-nacimiento': '',
    'personas-sexo': '0',
    'personas-primer-nombre': '',
    'personas-segundo-nombre': '',
    'personas-primer-apellido': '',
    'personas-segundo-apellido': '',
    'personas-telefono': '',
    'personas-direccion': '',
    'personas-celular': '',
    'personas-email': '',
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [loadingFile, setLoadingFile] = useState(false);
  const [dropdowmImporterPersons, setDropdowmImporterPersons] = useState(false);
  const [errorImportador, setErrorImportador] = useState(false);
  const [errorImportadorExtra, setErrorImportadorExtra] = useState(false);

  const [ciudad, setCiudad] = useState();

  const [editPersonId, setEditPerson] = useState(false);
  
  const [confirmEliminarPersona, setConfirmEliminarPersona] = useState(false);
  const [confirmModalEliminarPersona, setConfirmModalEliminarPersona] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
  
  const [errorSyncPersona, setErrorSyncPersona] = useState(false);
  const [confirmSyncPersona, setConfirmSyncPersona] = useState(false);
  const [errorSavePersona, setErrorSavePersona] = useState(false);
  const [errorModalSavePersona, setErrorModalSavePersona] = useState(false);
  const [readyModalSyncPersona, setReadyModalSyncPersona] = useState(false);
  const [errorModalSyncPersona, setErrorModalSyncPersona] = useState(false);
  const [confirmModalSyncPersona, setConfirmModalSyncPersona] = useState(false);
  
  const [enableForm, setEnableForm] = useState(false);

  const editPersonFn = (person)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editPersonObj = {};

      Object.entries(person).map((field)=>{
        if(field[0]!="label"&&field[0]!="value"&&field[0]!="ciudadLabel"){
          fieldValue = field[1];
          
          if(field[0]=="fecha_nacimiento"){
            fieldValue = new Date(fieldValue).toISOString().split('T')[0];;
          }
          
          fieldName = field[0].replaceAll('_','-');
          fieldName = `personas-${fieldName}`;
          editPersonObj[fieldName] = fieldValue;
          
          fieldName = '';
          fieldValue = '';
        }
      });

      setConfirmSyncPersona(person);
      setEditPerson(Number(person.id));

      if(Number(person.id_ciudad_erp)){
        setCiudad({value: person.id_ciudad_erp, label: person.ciudadLabel });
      }

      setEnableForm(true);

      setLoadingText('hidden')
      
      validation.setValues(editPersonObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar una persona", "Permisos");
    }
  };

  const deletePersonModal = (person)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarPersona(person);
      setConfirmModalEliminarPersona(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar una persona", "Permisos");
    }
  };
  
  const deletePersonConfirm = ()=>{
    cancelPersona();
    setConfirmEliminarPersona(false);
    setConfirmModalEliminarPersona(false);
    

    setLoadingText('Eliminando persona...')

    dispatch(deletePerson(confirmEliminarPersona.id, ()=>{
      cancelPersona();
      loadPersons();
      toastr.success("Persona eliminada.", "Operación Ejecutada");
    }));
  };

  const syncPersonFn = (person)=>{
    if(accessModule.ACTUALIZAR==true){
      let errorSync = [];

      if(person.tipo_documento===""||person.tipo_documento===null){
        errorSync.push("Tipo de Documento");
      }

      if(person.numero_documento==""||person.numero_documento===null){
        errorSync.push("Número de Documento");
      }

      if(person.primer_nombre==""||person.primer_nombre===null){
        errorSync.push("Primer Nombre");
      }

      /*if(person.id_ciudad_erp==""||person.id_ciudad_erp===null){
        errorSync.push("Ciudad");
      }

      if(person.direccion==""||person.direccion===null){
        errorSync.push("Dirección");
      }

      if(person.email==""){
        errorSync.push("E-Mail");
      }*/

      setConfirmSyncPersona(person);

      if(errorSync.length){
        setErrorSyncPersona(errorSync.join(", "));
        setErrorModalSyncPersona(true);
      }else{
        setConfirmModalSyncPersona(true);
      }
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar una persona", "Permisos");
    }
  };

  const syncPersonConfirm = ()=>{
    setReadyModalSyncPersona(false);
    setConfirmModalSyncPersona(false);
    
    setLoadingText('Sincronizando persona con ERP...')

    dispatch(syncPersonERP(confirmSyncPersona.id, ()=>{
      setConfirmSyncPersona(false);
      cancelPersona();
      loadPersons();
      toastr.success("Persona sincronizada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesPersonForm,
    validationSchema: Yup.object({
      'personas-primer-nombre': Yup.string().required("Por favor ingresa el primer nombre")
    }),
    onSubmit: (values) => {
      
      let personValues = [];

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('personas-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado","tipo_documento_text","sexo_text","nombres","fecha_nacimiento"].includes(fieldName)===false){
          personValues[fieldName] = fieldValue;
        }else if(fieldName=="fecha_nacimiento"&&fieldValue){
          fieldValue = new Date(fieldValue);
          fieldValue = fieldValue.toISOString().substring(0, 10);
          
          personValues[fieldName] = fieldValue;
        }else if(fieldName=="fecha_nacimiento"&&!fieldValue){
          personValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      const caracteresEspeciales = /[^a-zA-Z0-9]/g;
      personValues["numero_documento"] = personValues["numero_documento"].split("-")[0].replace(caracteresEspeciales, '');

      personValues["id_ciudad_erp"] = ciudad ? ciudad.value : null;
      
      let errorSave = [];

      if(confirmSyncPersona.tipo_documento!==""&&personValues["tipo_documento"]===""){
        errorSave.push("Tipo de Documento");
      }
  
      if(confirmSyncPersona.numero_documento!=""&&personValues["numero_documento"]==""){
        errorSave.push("Número de Documento");
      }
  
      if(confirmSyncPersona.primer_nombre!=""&&personValues["primer_nombre"]==""){
        errorSave.push("Primer Nombre");
      }
  
      if(confirmSyncPersona.direccion!=""&&personValues["direccion"]==""){
        errorSave.push("Dirección");
      }
      
      if(confirmSyncPersona.email!=""&&personValues["email"]==""){
        errorSave.push("E-Mail");
      }
      
      if(errorSave.length&&editPersonId){
        setErrorModalSavePersona(true);
        setErrorSavePersona(errorSave.join(", "));
      }else{
        setLoadingText("Guardando ...");
        
        if(!editPersonId){
          dispatch(createPerson(personValues, (response)=>{
            if(response.success){
              cancelPersona();
              loadPersons();
              toastr.success("Nueva persona registrada.", "Operación Ejecutada");
            }else{
              setLoadingText('hidden');
              toastr.error((response.error?response.error:'Contacte al equipo de soporte Máximo PH'), "Error en la operación");
            }
          }));
        }else{
          dispatch(editPerson(personValues, (response)=>{
            if(response.success){
              cancelPersona();
              loadPersons();
              toastr.success("Persona editada.", "Operación Ejecutada");
            }else{
              setLoadingText('hidden');
              toastr.error((response.error?response.error:'Contacte al equipo de soporte Máximo PH'), "Error en la operación",);
            }
          }));
        }
      }
    }
  });

  const cancelPersona = ()=>{
    setEnableForm(false);
    setCiudad(false);
    setEditPerson(false);
    setLoadingText(false);
    validation.handleReset();
    setConfirmSyncPersona(false);
  };

  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: person => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

            let synchronized = Number(person.id_tercero_erp) ? 'Sincronizado' : 'Sincronizar';
            let syncClass = Number(person.id_tercero_erp) ? 'info' : 'warning';
            if(accessModule.ACTUALIZAR==false){ syncClass = "secondary"; }

            return (<p className="text-center">
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editPersonFn(person)}}>
                <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn btn-sm" onClick={()=>{deletePersonModal(person)}}> 
                <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Eliminar</span>
              </Button>
              {' '}
              <Button color={syncClass} className="btn-sm" onClick={()=>{
                  if(person.id_tercero_erp){
                    setConfirmSyncPersona(person);
                    setReadyModalSyncPersona(true);
                  }else{
                    syncPersonFn(person);
                  }
                }}> 
                  <i className="bx bx-sync font-size-14 align-middle me-2"></i>
                  {synchronized} 
              </Button>
            </p>);
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombres',
        },
        {
            Header: 'Número Documento',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{Number(row.numero_documento).toLocaleString()}</p>)
        },
        {
            Header: 'Celular',
            accessor: 'celular'
        },
        {
            Header: 'E-mail',
            accessor: 'email'
        }
    ],
    []
  );

  const loadPersons = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPersons(null, (dataPersons, erp, resp)=>{ 

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getCities(null, ()=>{ 
        setLoadingText('');
      }));
    }));
  };

  useEffect(()=>{
    loadPersons();
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

  if(([24,25,26]).indexOf(JSON.parse(localStorage.getItem("authUser")).id_rol)<0){
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Tablas" breadcrumbItem="Personas" />
            {
            accessModule.CREAR==true && enableForm==true &&
              (<Row>
                <Col xl={12}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h5 mb-4">{editPersonId==false ? 'Nueva Persona' : 'Editando Persona'}</CardTitle>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          
                          validation.submitForm();

                          return false;
                        }}>

                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Tipo Documento</label>
                            <div className="col-md-12">
                              <select 
                                className="form-control" 
                                name="personas-tipo-documento"
                                onChange={validation.handleChange}
                                value={validation.values['personas-tipo-documento'] || "0"}
                              >
                                <option value="0">CÉDULA</option>
                                <option value="1">NIT</option>
                              </select>
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Número Documento</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="personas-numero-documento"
                                value={validation.values['personas-numero-documento'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Fecha de Nacimiento</label>
                            <div className="col-md-12">
                              <input
                                className="form-control"
                                name="personas-fecha-nacimiento"
                                value={validation.values['personas-fecha-nacimiento'] || ""}
                                onChange={validation.handleChange}
                                type="date"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Sexo</label>
                            <div className="col-md-12">
                              <select 
                                  className="form-control" 
                                  name="personas-sexo"
                                  value={validation.values['personas-sexo'] || "0"}
                                  onChange={validation.handleChange}
                                >
                                <option value="0">MASCULINO</option>
                                <option value="1">FEMENINO</option>
                              </select>
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Primer Nombre *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="personas-primer-nombre"
                                value={validation.values['personas-primer-nombre'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                  validation.touched['personas-primer-nombre'] && validation.errors['personas-primer-nombre'] && !validation.values['personas-primer-nombre'] ? true : false
                                }
                              />
                              {validation.touched['personas-primer-nombre'] && validation.errors['personas-primer-nombre'] && !validation.values['personas-primer-nombre'] ? (
                                <FormFeedback type="invalid">{validation.errors['personas-primer-nombre']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Segundo Nombre</label>
                            <div className="col-md-12">
                            <Input
                                type="text"
                                className="form-control"
                                name="personas-segundo-nombre"
                                value={validation.values['personas-segundo-nombre'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Primer Apellido</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="personas-primer-apellido"
                                value={validation.values['personas-primer-apellido'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Segundo Apellido</label>
                            <div className="col-md-12">
                            <Input
                                type="text"
                                className="form-control"
                                name="personas-segundo-apellido"
                                value={validation.values['personas-segundo-apellido'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Ciudad</label>
                            <div className="col-md-12">
                              <RemoteCombo 
                                value={ciudad}
                                data={dataCities}
                                disabled={!dataCities.length}
                                onChange={(val)=>setCiudad(val)}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Dirección</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="personas-direccion"
                                value={validation.values['personas-direccion'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          {/*<Col md={3}>
                            <label className="col-md-12 col-form-label">Teléfono</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="personas-telefono"
                                value={validation.values['personas-telefono'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>*/}
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Celular</label>
                            <div className="col-md-12">
                            <Input
                                type="text"
                                className="form-control"
                                name="personas-celular"
                                value={validation.values['personas-celular'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Email</label>
                            <div className="col-md-12">
                              <Input
                                type="email"
                                className="form-control"
                                name="personas-email"
                                value={validation.values['personas-email'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                        </Row>

                        {/*<Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Email</label>
                            <div className="col-md-12">
                              <Input
                                type="email"
                                className="form-control"
                                name="personas-email"
                                value={validation.values['personas-email'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                        </Row>*/}
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
                                  <Button type="reset" color="warning" onClick={cancelPersona} >
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

            {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR PERSONAS</b></p></Col></Row></Card>)}
            
            {accessModule.CREAR==true&&loadingFile==false&& !loadingText && enableForm==false &&(
              <Row>
                <Col xl={4}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nueva persona
                  </Button>
                </Col>
                <Col xl={8}>
                  <ButtonDropdown isOpen={dropdowmImporterPersons} toggle={() => setDropdowmImporterPersons(!dropdowmImporterPersons)}>
                    <DropdownToggle
                      caret
                      color="primary"
                      className="btn btn-info"
                    >
                      <i className="bx bx-import" style={{ fontSize: '18px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      Importador Personas
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem onClick={()=>downloadCSVImporter('personas')}>
                        <Button color={'info'} className="btn-m"> 
                          <i className="bx bx-download font-size-14 align-middle me-2"></i>
                          {'Descargar Plantilla Personas'}
                        </Button>
                      </DropdownItem>
                      <DropdownItem>
                        <Dropzone onDrop={csvFile => {uploadCSVImporter(csvFile, 'personas')}} >
                          {({ getRootProps, getInputProps }) => (
                            <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                              <input {...getInputProps()} />
                              <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                              {'Importar Personas'}
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

            {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR PERSONAS</b></p></Col></Row></Card>)}
            
            {
              accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
              (
                <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                  <TableContainer
                      columns={columns}
                      data={dataPersons}
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
                        loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando persona..." ?
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

        <ModalConfirmAction 
          confirmModal={confirmModalEliminarPersona}
          title={"Confirmación"}
          onClose={() => {
            setConfirmEliminarPersona(false);
            setConfirmModalEliminarPersona(false);
          }}
          description={`¿Estás seguro que deseas eliminar la persona ${(confirmEliminarPersona!==false ? confirmEliminarPersona.email : '')}?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a esta persona en la plataforma.`}
          onYes={() => {
            deletePersonConfirm();
          }}
        />

        <ModalConfirmAction 
          confirmModal={confirmModalSyncPersona}
          title={"Confirmación"}
          onClose={() => {      
            setConfirmSyncPersona(false);
            setConfirmModalSyncPersona(false);
          }}
          description={`¿Estás seguro que deseas sincronizar con el ERP la persona ${(confirmSyncPersona!==false ? confirmSyncPersona.email : '')}?`}
          onYes={() => {
            syncPersonConfirm();
          }}
        />

        <ModalConfirmAction 
          confirmModal={readyModalSyncPersona}
          title={"Información"}
          information={true}
          onClose={() => {      
            setConfirmSyncPersona(false);
            setReadyModalSyncPersona(false);
          }}
          description={`Esta persona ${confirmSyncPersona.email} ya está sincronizada.`}
        />
        
        <ModalConfirmAction 
          confirmModal={errorModalSavePersona}
          information={true}
          error={true}
          title={"Error"}
          onClose={() => {      
            setErrorModalSavePersona(false);
          }}
          description={`Previamente la persona ${confirmSyncPersona.email} contaba con esta información: ${errorSavePersona}. Debe ingresarla nuevamente para poder guardar.`}
        />

        <ModalConfirmAction 
          confirmModal={errorModalSyncPersona}
          information={true}
          title={"Error"}
          onClose={() => {      
            setConfirmSyncPersona(false);
            setErrorSyncPersona(false);
            setErrorModalSyncPersona(false);
          }}
          description={`Para sincronizar la persona ${confirmSyncPersona.email} con el ERP debes completar estos campos: ${errorSyncPersona}.`}
        />
      
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
  }else{
    return (<></>);
  }
};

export default withRouter(IndexPersonas);

IndexPersonas.propTypes = {
  history: PropTypes.object,
};