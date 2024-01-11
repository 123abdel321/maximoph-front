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

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

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
import { getSpentConcepts, createSpentConcept, editSpentConcept, deleteSpentConcept, getAccounts } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexConceptosGastos = props => {

  //meta title
  document.title = "Conceptos Gastos | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataSpentConcepts, dataAccountsSpents, dataAccountsIva, dataAccountsReteFuente, dataAccountsXPagar } = useSelector(state => ({
    loading: state.SpentConcepts.loading,
    dataAccountsSpents: state.Accounts.accounts.filter(i=>(i.codigo.startsWith("5")||i.codigo.startsWith("6")||i.codigo.startsWith("7"))),
    dataAccountsIva: state.Accounts.accounts.filter(i=>i.codigo.startsWith("24")||i.codigo.startsWith("5")),
    dataAccountsReteFuente: state.Accounts.accounts.filter(i=>(i.codigo.startsWith("236")||i.codigo.startsWith("1355"))),
    dataAccountsXPagar: state.Accounts.accounts.filter(i=>(i.codigo.startsWith("22")||i.codigo.startsWith("1105")||i.codigo.startsWith("1110"))),
    dataSpentConcepts: state.SpentConcepts.spentConcepts,
    loadingGrid: state.SpentConcepts.loadingGrid
  }));
  
  const initialValuesConceptoGastoForm = {
    'concepto-gasto-nombre': '',
    'concepto-gasto-id-cuenta-gasto-erp': '',
    'concepto-gasto-id-cuenta-rete-fuente-erp': '',
    'concepto-gasto-base-rete-fuente': '',
    'concepto-gasto-porcentaje-rete-fuente': '',
    'concepto-gasto-id-cuenta-iva-erp': '',
    'concepto-gasto-id-cuenta-por-pagar-erp': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [iva, setIVA] = useState({ label: "19 %", value: "19" });

  const [cuentaIva, setCuentaIva] = useState();
  const [cuentaGasto, setCuentaGasto] = useState();
  const [cuentaXPagar, setCuentaXPagar] = useState();
  const [cuentaReteFuente, setCuentaReteFuente] = useState();
  const [editConceptoGastoId, setEditConceptoGasto] = useState(false);
  const [confirmEliminarConceptoGasto, setConfirmEliminarConceptoGasto] = useState(false);
  const [confirmModalEliminarConceptoGasto, setConfirmModalEliminarConceptoGasto] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editConceptoGastoFn = (conceptoGasto)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editConceptoGastoObj = {};

      Object.entries(conceptoGasto).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `concepto-gasto-${fieldName}`;
        editConceptoGastoObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setIVA({label: `${conceptoGasto.porcentaje_iva} %`, value: conceptoGasto.porcentaje_iva});
      
      setCuentaIva({label: conceptoGasto.cuentaIvaLabel, value: conceptoGasto.id_cuenta_iva_erp});
      setCuentaGasto({label: conceptoGasto.cuentaGastoLabel, value: conceptoGasto.id_cuenta_gasto_erp});
      setCuentaXPagar({label: conceptoGasto.cuentaXPagarLabel, value: conceptoGasto.id_cuenta_por_pagar_erp});
      setCuentaReteFuente({label: conceptoGasto.cuentaRetencionLabel, value: conceptoGasto.id_cuenta_rete_fuente_erp});

      setEditConceptoGasto(Number(conceptoGasto.id));
      
      setEnableForm(true);

      setLoadingText('Editando concepto gasto...');
      
      validation.setValues(editConceptoGastoObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Conceptos de Gastos", "Permisos");
    }
  };

  const deleteConceptoGastoModal = (conceptoGasto)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarConceptoGasto(conceptoGasto);
      setConfirmModalEliminarConceptoGasto(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Conceptos de Gastos", "Permisos");
    }
  };
  
  const deleteConceptoGastoConfirm = ()=>{
    cancelConceptoGasto();
    setConfirmEliminarConceptoGasto(false);
    setConfirmModalEliminarConceptoGasto(false);
    

    setLoadingText('Eliminando concepto gasto...')

    dispatch(deleteSpentConcept(confirmEliminarConceptoGasto.id, ()=>{
      cancelConceptoGasto();
      loadConceptosGasto();
      toastr.success("Concepto eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesConceptoGastoForm,
    validationSchema: Yup.object({
      'concepto-gasto-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let conceptoGastoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-gasto-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado","iva"].includes(fieldName)===false){
          conceptoGastoValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!cuentaGasto){
        toastr.error("Seleccione la cuenta contable del gasto.", "Error en la validación");
        return;
      }
      
      if((!cuentaIva||cuentaIva?.label==' - ')&&Number(iva.value)>0){
        toastr.error("Seleccione la cuenta contable del IVA.", "Error en la validación");
        return;
      }

      conceptoGastoValues["porcentaje_iva"] = iva.value;
      conceptoGastoValues["id_cuenta_gasto_erp"] = cuentaGasto.value;
      conceptoGastoValues["id_cuenta_iva_erp"] = cuentaIva ? cuentaIva.value : '';
      conceptoGastoValues["id_cuenta_rete_fuente_erp"] = cuentaReteFuente ? cuentaReteFuente.value : '';

      setLoadingText("Guardando ...");

      if(!editConceptoGastoId){
        dispatch(createSpentConcept(conceptoGastoValues, (response)=>{
          if(response.success){
            cancelConceptoGasto();
            loadConceptosGasto();
            toastr.success("Nuevo concepto registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El concepto ya está registrado.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editSpentConcept(conceptoGastoValues, (response)=>{
          if(response.success){
            cancelConceptoGasto();
            loadConceptosGasto();
            toastr.success("Concepto editado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El concepto ya está registrado.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelConceptoGasto = ()=>{
    setEditConceptoGasto(false);
    setLoadingText(false);
    setEnableForm(false);
    
    setCuentaIva(null);
    setCuentaGasto(null);
    setCuentaXPagar(null);
    setCuentaReteFuente(null);

    validation.handleReset();
    setIVA({ label: "19 %", value: "19" });
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editConceptoGastoFn(row)}}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteConceptoGastoModal(row)}}>
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
            Header: '% IVA',
            accessor: 'porcentaje_iva',
        },
        /*{
            Header: 'Base Rete.Fuente',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.base_rete_fuente).toLocaleString()}</p>)
        },
        {
            Header: '% Rete. Fuente',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">% {Number(row.porcentaje_rete_fuente).toLocaleString()}</p>)
        },*/
        {
            Header: 'Cuenta Gasto',
            accessor: 'cuentaGastoLabel',
        },
        {
            Header: 'Cuenta IVA',
            accessor: 'cuentaIvaLabel',
        },
        {
            Header: 'Cuenta Rete.Fuente',
            accessor: 'cuentaRetencionLabel',
        }
    ],
    []
  );

  const loadConceptosGasto = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getSpentConcepts(null, (resp)=>{ 

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getAccounts(null, ()=>{ 
        setLoadingText('');
      }));
    }));
  };

  useEffect(()=>{
    loadConceptosGasto();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Conceptos Gastos" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editConceptoGastoId===false ? 'Nuevo Concepto Gasto' : 'Editando Concepto Gasto'}</CardTitle>
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
                              name="concepto-gasto-nombre"
                              value={validation.values['concepto-gasto-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['concepto-gasto-nombre'] && validation.errors['concepto-gasto-nombre'] && !validation.values['concepto-gasto-nombre'] ? true : false
                              }
                            />
                            {validation.touched['concepto-gasto-nombre'] && validation.errors['concepto-gasto-nombre'] && !validation.values['concepto-gasto-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['concepto-gasto-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">% IVA</label>
                          <div className="col-md-12">
                            <Select
                                value={iva}
                                onChange={value=>setIVA(value)}
                                options={[
                                  { label: "19 %", value: "19" },
                                  { label: "16 %", value: "16" },
                                  { label: "8 %", value: "8" },
                                  { label: "5 %", value: "5" },
                                  { label: "4 %", value: "4" },
                                  { label: "0 %", value: "0" },
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
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta Gasto *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaGasto}
                              data={dataAccountsSpents}
                              disabled={!dataAccountsSpents.length}
                              onChange={(val)=>setCuentaGasto(val)}
                            />
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta IVA</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaIva}
                              data={dataAccountsIva}
                              disabled={!dataAccountsIva.length}
                              onChange={(val)=>setCuentaIva(val)}
                            />
                          </div>
                        </Col>
                        {/*<Col md={3}>
                          <label className="col-md-12 col-form-label">Base Rete. Fuente</label>
                          <div className="col-md-12">
                            <Input
                                type="number"
                                className="form-control"
                                name="concepto-gasto-base-rete-fuente"
                                value={validation.values['concepto-gasto-base-rete-fuente'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                              />
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">% Rete. Fuente</label>
                          <div className="col-md-12">
                            <Input
                                type="number"
                                className="form-control"
                                name="concepto-gasto-porcentaje-rete-fuente"
                                value={validation.values['concepto-gasto-porcentaje-rete-fuente'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                              />
                          </div>
                        </Col>*/}
                      </Row>
                      <Row>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta Rete.Fuente</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaReteFuente}
                              data={dataAccountsReteFuente}
                              disabled={!dataAccountsReteFuente.length}
                              onChange={(val)=>setCuentaReteFuente(val)}
                            />
                          </div>
                        </Col>
                        {/*<Col md={3}>
                            <label className="col-md-12 col-form-label">Número de Cuenta X Pagar *</label>
                            <div className="col-md-12">
                              <RemoteCombo 
                                value={cuentaXPagar}
                                data={dataAccountsXPagar}
                                onChange={(val)=>setCuentaXPagar(val)}
                              />
                            </div>
                        </Col>*/}
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
                                <Button type="reset" color="warning" onClick={cancelConceptoGasto} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR CONCEPTOS DE GASTOS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR CONCEPTOS DE GASTOS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(<Card>
              <Row>
                <Col xl={3}>
                  <p className="text-center">
                    <br />
                    <Button onClick={()=>setEnableForm(true)} color="primary">
                      Nuevo concepto de gasto
                    </Button>
                    <br />
                  </p>
                </Col>
              </Row>
            </Card>)}

          {
            accessModule.INGRESAR==true && !loadingText && enableForm==false ?
            (<TableContainer
              columns={columns}
              data={dataSpentConcepts}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando concepto gasto..." ?
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
        isOpen={confirmModalEliminarConceptoGasto}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarConceptoGasto(false);
              setConfirmModalEliminarConceptoGasto(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el concepto de gasto <b>{(confirmEliminarConceptoGasto!==false ? confirmEliminarConceptoGasto.nombre : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este concepto en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteConceptoGastoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarConceptoGasto(false);
            setConfirmModalEliminarConceptoGasto(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexConceptosGastos);

IndexConceptosGastos.propTypes = {
  history: PropTypes.object,
};