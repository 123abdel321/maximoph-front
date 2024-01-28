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
import { getBillingConcepts, createBillingConcept, editBillingConcept, deleteBillingConcept, getAccounts } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexConceptosFacturacion = props => {

  //meta title
  document.title = "Conceptos Facturación | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataBillingConcepts, dataAccountsIngresos, dataAccountsIntereses, dataAccountsIva, dataAccountsXCobrar } = useSelector(state => ({
    loading: state.BillingConcepts.loading,
    dataAccountsIva: state.Accounts.accounts.filter(i=>i.codigo.startsWith("24")),
    dataAccountsIntereses: state.Accounts.accounts.filter(i=>i.nombre.toLowerCase().indexOf("interes")>=0),
    dataAccountsIngresos: state.Accounts.accounts.filter(i=>(i.codigo.startsWith("41")||i.codigo.startsWith("28"))),
    dataAccountsXCobrar: state.Accounts.accounts.filter(i=>(i.codigo.startsWith("13")||i.codigo.startsWith("1105")||i.codigo.startsWith("1110"))),
    dataBillingConcepts: state.BillingConcepts.billingConcepts,
    loadingGrid: state.BillingConcepts.loadingGrid
  }));
  
  const initialValuesConceptoFacturaForm = {
    'concepto-facturacion-nombre': '',
    'concepto-facturacion-id-cuenta-ingreso-erp': '',
    'concepto-facturacion-id-cuenta-interes-erp': '',
    'concepto-facturacion-id-cuenta-iva-erp': '',
    'concepto-facturacion-id-cuenta-por-cobrar': '',
    'concepto-facturacion-valor': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [intereses, setIntereses] = useState({ label: "NO", value: "0" });
  const [cuentaIva, setCuentaIva] = useState();
  const [cuentaIngreso, setCuentaIngreso] = useState();
  const [cuentaXCobrar, setCuentaXCobrar] = useState();
  const [cuentaInteres, setCuentaInteres] = useState();
  const [enableForm, setEnableForm] = useState(false);

  const [editConceptoFacturaId, setEditConceptoFactura] = useState(false);
  const [confirmEliminarConceptoFactura, setConfirmEliminarConceptoFactura] = useState(false);
  const [confirmModalEliminarConceptoFactura, setConfirmModalEliminarConceptoFactura] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editConceptoFacturaFn = (conceptoFactura)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editConceptoFacturaObj = {};

      Object.entries(conceptoFactura).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `concepto-facturacion-${fieldName}`;
        
        if(["operaciones","eliminado"].includes(fieldName)===false){
          if(fieldName=='concepto-facturacion-valor'){
            editConceptoFacturaObj[fieldName] = Number(fieldValue).toLocaleString('es-ES');
          }else{
            editConceptoFacturaObj[fieldName] = fieldValue;
          }
        }

        fieldName = '';
        fieldValue = '';
      });

      setEditConceptoFactura(Number(conceptoFactura.id));

      setIntereses({label: (Number(conceptoFactura.intereses)?'SI':'NO'), value: conceptoFactura.intereses});
      
      setCuentaIva({value: conceptoFactura.id_cuenta_iva_erp, label: conceptoFactura.cuentaIvaLabel});
      setCuentaIngreso({value: conceptoFactura.id_cuenta_ingreso_erp, label: conceptoFactura.cuentaIngresoLabel});
      setCuentaXCobrar({value: conceptoFactura.id_cuenta_por_cobrar, label: conceptoFactura.cuentaXCobrarLabel});
      setCuentaInteres({value: conceptoFactura.id_cuenta_interes_erp, label: conceptoFactura.cuentaInteresLabel});

      setLoadingText('Editando concepto factura...');
      
      setEnableForm(true);
      
      validation.setValues(editConceptoFacturaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Conceptos de Facturación", "Permisos");
    }
  };

  const deleteConceptoFacturaModal = (conceptoFactura)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarConceptoFactura(conceptoFactura);
      setConfirmModalEliminarConceptoFactura(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Concepto de Facturación", "Permisos");
    }
  };
  
  const deleteConceptoFacturaConfirm = ()=>{
    cancelConceptoFactura();
    setConfirmEliminarConceptoFactura(false);
    setConfirmModalEliminarConceptoFactura(false);
    

    setLoadingText('Eliminando concepto factura...')

    dispatch(deleteBillingConcept(confirmEliminarConceptoFactura.id, ()=>{
      cancelConceptoFactura();
      loadConceptosFactura();
      toastr.success("Concepto eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesConceptoFacturaForm,
    validationSchema: Yup.object({
      'concepto-facturacion-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let conceptoFacturaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-facturacion-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","eliminado"].includes(fieldName)===false){
          if(fieldName=='valor'){
            conceptoFacturaValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");
          }else{
            conceptoFacturaValues[fieldName] = fieldValue;
          }
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!cuentaIngreso){
        toastr.error("Seleccione la cuenta contable de ingreso.", "Error en la validación");
        return;
      }

      if(!cuentaXCobrar){
        toastr.error("Seleccione la cuenta contable x cobrar.", "Error en la validación");
        return;
      }
      
      conceptoFacturaValues["intereses"] = intereses.value == 'SI' ? 1 : 0;
      
      conceptoFacturaValues["id_cuenta_iva_erp"] = (cuentaIva ? cuentaIva.value : '');
      conceptoFacturaValues["id_cuenta_por_cobrar"] = cuentaXCobrar.value;
      conceptoFacturaValues["id_cuenta_ingreso_erp"] = cuentaIngreso.value;
      conceptoFacturaValues["id_cuenta_interes_erp"] = "";

      setLoadingText("Guardando ...");

      if(!editConceptoFacturaId){
        dispatch(createBillingConcept(conceptoFacturaValues, (response)=>{
          if(response.success){
            cancelConceptoFactura();
            loadConceptosFactura();
            toastr.success("Nuevo concepto registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El concepto ya está registrado.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editBillingConcept(conceptoFacturaValues, (response)=>{
          if(response.success){
            cancelConceptoFactura();
            loadConceptosFactura();
            toastr.success("Concepto editado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El concepto ya está registrado.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelConceptoFactura = ()=>{
    setEnableForm(false);
    setEditConceptoFactura(false);
    setLoadingText(false);
    setCuentaIva();
    setCuentaIngreso();
    setCuentaXCobrar();
    setCuentaInteres();
    validation.handleReset();
    setIntereses({ label: "NO", value: "0" });
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editConceptoFacturaFn(row)}}> 
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Editar</span>
              </Button>
              {' '}
              <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteConceptoFacturaModal(row)}}> 
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
            Header: 'Intereses',
            accessor: 'intereses',
        },
        {
            Header: 'Valor',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {Number(row.valor).toLocaleString()}</p>)
        },
        {
            Header: 'Cuenta Ingreso',
            accessor: 'cuentaIngresoLabel',
        },
        {
            Header: 'Cuenta IVA',
            accessor: 'cuentaIvaLabel',
        },
        {
            Header: 'Cuenta X Cobrar',
            accessor: 'cuentaXCobrarLabel',
        }
    ],
    []
  );

  const loadConceptosFactura = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getBillingConcepts(null, (resp)=>{ 
      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);

      dispatch(getAccounts(null, ()=>{ 
        setLoadingText('');
      }));
    }));
  };

  useEffect(()=>{
    loadConceptosFactura();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Conceptos Facturación" />
          {accessModule.CREAR==true  && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editConceptoFacturaId===false ? 'Nuevo Concepto Facturación' : 'Editando Concepto Facturación'}</CardTitle>
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
                              name="concepto-facturacion-nombre"
                              value={validation.values['concepto-facturacion-nombre'] || ""}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched['concepto-facturacion-nombre'] && validation.errors['concepto-facturacion-nombre'] && !validation.values['concepto-facturacion-nombre'] ? true : false
                              }
                            />
                            {validation.touched['concepto-facturacion-nombre'] && validation.errors['concepto-facturacion-nombre'] && !validation.values['concepto-facturacion-nombre'] ? (
                              <FormFeedback type="invalid">{validation.errors['concepto-facturacion-nombre']}</FormFeedback>
                            ) : null}
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Valor</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              name="concepto-facturacion-valor"
                              value={validation.values['concepto-facturacion-valor'] || ""}
                              onChange={(e)=>{
                                let val = Number(e.target.value.replaceAll(",","").replaceAll(".","")).toLocaleString('es-ES');
                                validation.setFieldValue("concepto-facturacion-valor", val);
                              }}
                              onBlur={validation.handleBlur}
                            />
                          </div>
                        </Col>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Intereses *</label>
                          <div className="col-md-12">
                              <Select
                                value={intereses}
                                onChange={value=>setIntereses(value)}
                                options={[
                                  { label: "NO", value: "0" },
                                  { label: "SI", value: "1" }
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
                      </Row>
                      <Row>
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta Ingreso *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaIngreso}
                              data={dataAccountsIngresos}
                              disabled={!dataAccountsIngresos.length}
                              onChange={(val)=>setCuentaIngreso(val)}
                            />
                          </div>
                        </Col>
                        {/*<Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta Intereses</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaInteres}
                              data={dataAccountsIntereses}
                              onChange={(val)=>setCuentaInteres(val)}
                            />
                          </div>
                        </Col>*/}
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
                        <Col md={3}>
                          <label className="col-md-12 col-form-label">Número de Cuenta X Cobrar *</label>
                          <div className="col-md-12">
                            <RemoteCombo 
                              value={cuentaXCobrar}
                              data={dataAccountsXCobrar}
                              disabled={!dataAccountsXCobrar.length}
                              onChange={(val)=>setCuentaXCobrar(val)}
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
                                <Button type="reset" color="warning" onClick={cancelConceptoFactura} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR CONCEPTOS DE FACTURACIÓN</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR CONCEPTOS DE FACTURACIÓN</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
              <Row>
                <Col xl={5}>
                  <Button onClick={()=>setEnableForm(true)} color="primary">
                    <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Nuevo concepto de facturación
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
                  data={dataBillingConcepts}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando concepto factura..." ?
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
        isOpen={confirmModalEliminarConceptoFactura}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarConceptoFatura(false);
              setConfirmModalEliminarConceptoFactura(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el concepto de factura <b>{(confirmEliminarConceptoFactura!==false ? confirmEliminarConceptoFactura.nombre : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este concepto en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteConceptoFacturaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarConceptoFatura(false);
            setConfirmModalEliminarConceptoFactura(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexConceptosFacturacion);

IndexConceptosFacturacion.propTypes = {
  history: PropTypes.object,
};