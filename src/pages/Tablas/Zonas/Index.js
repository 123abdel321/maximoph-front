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

import Select from "react-select";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getZones, createZone, editZone, deleteZone, getCostsCenter } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexZonas = props => {

  //meta title
  document.title = "Zonas | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataZones, dataCostsCenter } = useSelector(state => ({
    loading: state.Zones.loading,
    dataZones: state.Zones.zones,
    dataCostsCenter: state.CostsCenter.costsCenter,
    loadingGrid: state.Zones.loadingGrid
  }));

  const initialValuesZonesForm = {
    'zona-nombre': '',
    'zona-tipo': '',
    'zona-id-centro-costos-erp': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [tipo, setTipo] = useState({ label: "USO COMÚN", value: "0" });
  const [centroCostos, setCentroCostos] = useState();

  const [editZonaId, setEditZona] = useState(false);
  const [confirmEliminarZona, setConfirmEliminarZona] = useState(false);
  const [enableForm, setEnableForm] = useState(false);
  
  const [confirmModalEliminarZona, setConfirmModalEliminarZona] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editZonaFn = (zona)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editZonaObj = {};

      Object.entries(zona).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `zona-${fieldName}`;
        editZonaObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditZona(Number(zona.id));

      setCentroCostos({value: zona.id_centro_costos_erp, label: zona.centroCostosLabel })
      
      setEnableForm(true);

      setLoadingText('Editando zona...');
      
      validation.setValues(editZonaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar zonas", "Permisos");
    }
  };

  const deleteZonaModal = (zona)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarZona(zona);
      setConfirmModalEliminarZona(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar zonas", "Permisos");
    }
  };
  
  const deleteZonaConfirm = ()=>{
    cancelZona();
    setConfirmEliminarZona(false);
    setConfirmModalEliminarZona(false);
    

    setLoadingText('Eliminando zona...')

    dispatch(deleteZone(confirmEliminarZona.id, ()=>{
      cancelZona();
      loadZonas();
      toastr.success("Zona eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesZonesForm,
    validationSchema: Yup.object({
      'zona-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      let zonaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('zona-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones", "value", "label", "centroCostosLabel","eliminado"].includes(fieldName)===false){
          zonaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      zonaValues["tipo"] = tipo.value;
      zonaValues["id_centro_costos_erp"] = centroCostos.value;
      
      setLoadingText("Guardando ...");

      if(!editZonaId){
        dispatch(createZone(zonaValues, (response)=>{
          if(response.success){
            cancelZona();
            loadZonas();
            toastr.success("Nueva zona registrada.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editZone(zonaValues, (response)=>{
          if(response.success){
            cancelZona();
            loadZonas();
            toastr.success("Zona editada.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando zona...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelZona = ()=>{
    setEnableForm(false);
    setEditZona(false);
    setLoadingText(false);
    setCentroCostos();
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editZonaFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteZonaModal(row)}}> 
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
            Header: 'Tipo',
            accessor: 'tipoText',
        },
        {
            Header: 'Centro de Costos',
            accessor: 'centroCostosLabel',
        }
    ],
    []
  );

  const loadZonas = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getZones(null, (resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getCostsCenter(null, ()=>{
        setLoadingText('');
      }));
    }));
  };

  useEffect(()=>{
    loadZonas();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Zonas" />
          {accessModule.CREAR==true  && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editZonaId===false ? 'Nueva Zona' : 'Editando Zona'}</CardTitle>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        
                        validation.submitForm();

                        return false;
                      }}>
                      <Row>
                        <Col md={4}>
                          <label className="col-md-12 col-form-label">Nombre *</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="zona-nombre"
                              value={validation.values['zona-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['zona-nombre'] && validation.errors['zona-nombre'] && !validation.values['zona-nombre'] ? true : false
                              }
                            />
                            {validation.touched['zona-nombre'] && validation.errors['zona-nombre'] && !validation.values['zona-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['zona-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={4}>
                          <label className="col-md-12 col-form-label">Tipo *</label>
                          <div className="col-md-12">
                            <Select
                                value={tipo}
                                onChange={value=>setTipo(value)}
                                options={[
                                  { label: "USO COMÚN", value: "0" },
                                  { label: "INMUEBLE", value: "1" },
                                  { label: "PORTERIA", value: "2" }
                                ]}
                                className="select2-selection"
                                theme={(theme) => ({
                                  ...theme,
                                  borderRadius: 0,
                                  colors: {
                                    ...theme.colors
                                  },
                                })}
                              />
                          </div>
                        </Col>
                        <Col md={4}>
                          <label className="col-md-12 col-form-label">Centro de Costos *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={centroCostos}
                              data={dataCostsCenter}
                              disabled={!dataCostsCenter.length}
                              onChange={(val)=>setCentroCostos(val)}
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
                                <Button type="reset" color="warning" onClick={cancelZona} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR ZONAS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR ZONAS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
            <Row>
              <Col xl={3}>
                <Button onClick={()=>setEnableForm(true)} color="primary">
                  <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Nueva zona
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
                  data={dataZones}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando zona..." ?
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
        isOpen={confirmModalEliminarZona}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarZona(false);
              setConfirmModalEliminarZona(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el tipo de tarea <b>{(confirmEliminarZona!==false ? confirmEliminarZona.nombre : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteZonaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarZona(false);
            setConfirmModalEliminarZona(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexZonas);

IndexZonas.propTypes = {
  history: PropTypes.object,
};