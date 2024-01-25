import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Table,
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

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";


//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getPayments, getExtractTerceroPayments, createPayment, editPayment, deletePayment, getPersons, getPaymentPDF, getAccounts, getDataSummaryErp } from "../../../store/actions";

//redux
import { useDispatch, useSelector } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexPagos = props => {

  //meta title
  document.title = "Pagos | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesPagoForm = {
    'pago-fecha-pago': '',
    'pago-valor-pago': '',
    'pago-observacion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [persona, setPersona] = useState(null);
  const [personasErp, setPersonasErp] = useState([]);
  const [facturasPersona, setFacturasPersona] = useState([]);
  const [controlFechaDigitacion, setControlFechaDigitacion] = useState(null);
  
  const [cuentaEgresoPago, setCuentaEgresoPago] = useState();

  const [editPagoId, setEditPago] = useState(false);
  const [confirmEliminarPago, setConfirmEliminarPago] = useState(false);
  const [confirmModalCancelPago, setConfirmModalCancelPago] = useState(false);
  const [confirmModalEliminarPago, setConfirmModalEliminarPago] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [data, setData] = useState([]);
  
  const [enableForm, setEnableForm] = useState(false);
  
  const { dataAccountsEgresos } = useSelector(state => ({
    dataAccountsEgresos: state.Accounts.accounts.filter(i=>
      i.codigo.toLowerCase().indexOf("1105")>=0||
      i.codigo.toLowerCase().indexOf("1110")>=0||
      i.codigo.toLowerCase().indexOf("1120")>=0
    ),
  }));

  const deletePagoModal = (pago, deleteR)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarPago(pago);

      if(deleteR){
        setConfirmModalCancelPago(false);
        setConfirmModalEliminarPago(true);
      }else{
        setConfirmModalCancelPago(true);
        setConfirmModalEliminarPago(false);
      }
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar pagos", "Permisos");
    }
  };
  
  const deletePagoConfirm = ()=>{
    const pagoToDelete = confirmEliminarPago.id;

    let operPago = confirmModalCancelPago ? 'cancel' : 'delete';
    let textLoading = confirmModalCancelPago ? 'Anulando pago...' : 'Elimando pago...';
    let textSuccess = confirmModalCancelPago ? 'Pago Anulado.' : 'Pago Eliminado.';
          
    setLoadingText(textLoading)

    cancelPago();
    setConfirmEliminarPago(false);
    setConfirmModalCancelPago(false);
    setConfirmModalEliminarPago(false);
    
    dispatch(deletePayment({pagoToDelete, operPago}, ()=>{
      cancelPago();
      loadPago();
      toastr.success(textSuccess, "Operación Ejecutada");
    }));
  };

  const cancelPago = ()=>{
    setLoadingText(false);
    setEditPago(false);
    setEnableForm(false);
    validation.handleReset();
    
    loadPago();
  };

  const openPDF = (pago)=>{
    if(accessModule.INGRESAR==true){
      setLoadingText("Generando PDF ...");

      dispatch(getPaymentPDF(null,(url)=>{
        setLoadingText(false);
        const pdfTargetBlank = window.open(url, '_blank');
        pdfTargetBlank.focus();
      }, pago.id));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a visulizar pagos", "Permisos");
    }
  };

  const loadBillsPerson = (person)=>{
    validation.setFieldValue("pago-valor-pago", "");
    validation.setFieldValue("pago-fecha-pago", "");
    validation.setFieldValue("pago-observacion", "");
    validation.setFieldValue("pago-saldo", "");
    
    dispatch(getExtractTerceroPayments(person.id_tercero_erp, (bills)=>{
      let billsFiltered = bills.data;

      setFacturasPersona([]);
      
      validation.setFieldValue("pago-saldo", Number(bills.totalPendiente||0).toLocaleString('es-ES'));
      
      if(!billsFiltered.length){
        setFacturasPersona([]);
        toastr.options = { positionClass: 'toast-top-right' };
        toastr.warning("Tercero sin saldos pendientes", "Información Cartera");
      }else{
        setFacturasPersona(billsFiltered);
      }

    }));
  };

  const loadPago = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getDataSummaryErp(null, (dataSummaryErp)=>{
      let comboERPBase = false;
      dataSummaryErp.erpBases.map(field=>{
        if(!comboERPBase){
          switch(field.campo){
            case "id_cuenta_egreso_pagos_erp":
              comboERPBase = {label: field.label, value: field.value};

              setCuentaEgresoPago(comboERPBase);
            break;
          }
        }
      });

      dispatch(getPayments(null, (pagos)=>{ 
        
        let newAccessModule = accessModule;
        pagos.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));
  
        setAccessModule(newAccessModule);

        dispatch(getPersons(null, (dPersons)=>{ 
          dispatch(getAccounts(null, ()=>{ 
            
            dPersons.map(person=>{
              person.label = `${person.numero_documento} - ${person.label}`;
            });

            setPersonasErp(dPersons);
            
            setPersona(null);
            setFacturasPersona([]);

            pagos.data.map(bill=>{
              bill.fecha_pago = bill.fecha_pago.split("T")[0];
            });

            setData(pagos.data);
            
            validation.handleReset();
            
            setControlFechaDigitacion(pagos.controlFechaDigitacion);

            validation.setFieldValue("pago-consecutivo", pagos.paymentsNextNumber);
            validation.setFieldValue("pago-saldo", "");
            validation.setFieldValue("pago-fecha-pago", "");
            validation.setFieldValue("pago-valor-pago", "");
            validation.setFieldValue("pago-observacion", "");

            setLoadingText('');

            if(props.onLoad) props.onLoad(pagos);
          }));
        },true));
      }));
    }));
    
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesPagoForm,
    validationSchema: Yup.object({
      'pago-fecha-pago': Yup.string().required("Por favor ingresa la fecha del pago")
    }),
    onSubmit: (values) => {
      let pagoValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('pago-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","consecutivo","factura_consecutivo","inmuebleText","zonaText","areaText","personaDocumento","personaText","personaId","estado","estadoText","valor_factura","saldo"].includes(fieldName)==false){
          pagoValues[fieldName] = fieldValue.replaceAll(",","").replaceAll(".","");
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!persona){
        toastr.error("Seleccione una persona", "Error en la validación");
        return;
      }
      
      if(!cuentaEgresoPago){
        toastr.error("Seleccione una cuenta de egreso", "Error en la validación");
        return;
      }

      let saldo = validation.values['pago-saldo'].replaceAll(",","").replaceAll(".","");

      if(!Number(validation.values['pago-valor-pago'].replaceAll(",","").replaceAll(".",""))){
        toastr.error("Digite el valor del abono.", "Error en la validación");
        return;
      }
      if(Number(validation.values['pago-valor-pago'].replaceAll(",","").replaceAll(".",""))>Number(saldo)){
        toastr.error("El valor del abono es superior al saldo pendiente.", "Error en la validación");
        return;
      }
      
      pagoValues["id_persona"] = persona.id;

      pagoValues["id_tercero_erp"] = persona.id_tercero_erp;
      
      pagoValues["id_cuenta_egreso_recibos_caja_erp"] = cuentaEgresoPago.value;
      
      setLoadingText("Guardando ...");

      if(!editPagoId){
        dispatch(createPayment(pagoValues, (response)=>{
          if(response.success){
            cancelPago();
            loadPago();
            toastr.success("Nuevo Pago.", "Operación Ejecutada");
          }else{
            setLoadingText('Creando Pago...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editPayment(pagoValues, (response)=>{
          if(response.success){
            cancelPago();
            loadPago();
            toastr.success("Pago editado.", "Operación Ejecutada");
          }else{
            setLoadingText('Editando Pago...');
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const columns = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: pago => {
              let classViewBtn = accessModule.INGRESAR==true ? "primary" : "secondary";
              let classCancelBtn = accessModule.ELIMINAR==true ? "warning" : "secondary";
              let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";
  
              if(pago.estado==1){
                return (<div  style={{textAlign: 'center'}}>
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(pago)}}> 
                  <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">PDF</span>
                </Button>
                {" "}
                <Button color={classCancelBtn} className="btn-sm" onClick={()=>{deletePagoModal(pago, false)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Anular</span>
                </Button>
                {' '}
                <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deletePagoModal(pago, true)}}> 
                    <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">Eliminar</span>
                </Button>
                </div>);
              }else{
                return (<div style={{textAlign: 'center'}}> 
                  <b>ANULADO</b> 
                  {' '}
                  <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(pago)}}> 
                    <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                    <span className="el-desktop">PDF</span>
                  </Button>
                  {" "}
                  <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deletePagoModal(pago, true)}}> 
                      <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Eliminar</span>
                  </Button>
                </div>);
              }
            }
          },
          {
              Header: 'Consecutivo Pago',
              accessor: 'consecutivo',
          },
          {
              Header: 'Fecha Pago',
              accessor: 'fecha_pago',
          },
          {
              Header: 'Documento',
              accessor: 'personaDocumento',
          },
          {
              Header: 'Persona',
              accessor: 'personaText',
          },
          {
              Header: 'Total Pago',
              HeaderClass: 'text-end',
              accessor: row => (<p className="text-end">$ {(row.valor_pago).toLocaleString()}</p>)
          },
          {
              Header: 'Observación',
              accessor: 'observacion',
          }
      ],
      []
  );
  
  useEffect(()=>{
    loadPago();
  },[]);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Pagos" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">{editPagoId===false ? 'Nuevo Pago' : 'Editando Pago'}</CardTitle>
                    
                    <Row>
                      <Col sm="12">
                      {/*FORM GENERAL*/}
                          <Form
                            onSubmit={(e) => {
                              e.preventDefault();
                              
                              validation.submitForm();

                              return false;
                            }}>
                              <Row>
                                
                                <Col lg={3} md={4} sm={4}>
                                    <label className="col-md-12 col-form-label">Proveedor *</label>
                                    <div className="col-md-12">
                                      <RemoteCombo 
                                        value={persona}
                                        data={personasErp}
                                        onChange={async (val)=>{
                                          setFacturasPersona([]);
                                          
                                          await loadBillsPerson(val);

                                          setPersona(val);
                                        }}
                                      />
                                    </div>
                                </Col>
                                <Col lg={3} md={4} sm={4}>
                                    <label className="col-form-label">Fecha Pago*</label>
                                    <Input
                                      type="date"
                                      className="form-control"
                                      name="pago-fecha-pago"
                                      value={validation.values['pago-fecha-pago'] || ""}
                                      onChange={(e)=>{
                                        if(controlFechaDigitacion==0&&new Date(e.target.value)<=new Date()){
                                          validation.handleChange(e);
                                        }else if(controlFechaDigitacion==1&&new Date(e.target.value)==new Date()){
                                          validation.handleChange(e);
                                        }else if(controlFechaDigitacion==2&&new Date(e.target.value)<=new Date()){
                                          var fechaLimite = new Date();
                                          fechaLimite.setDate(new Date().getDate() - 30);
                                          if(new Date(e.target.value)>fechaLimite){
                                            validation.handleChange(e);
                                          }
                                        }
                                      }}
                                      onBlur={validation.handleBlur}
                                      invalid={
                                        validation.touched['pago-fecha-pago'] && validation.errors['pago-fecha-pago'] && !validation.values['pago-fecha-pago'] ? true : false
                                      }
                                    />
                                    {validation.touched['pago-fecha-pago'] && validation.errors['pago-fecha-pago'] && !validation.values['pago-fecha-pago'] ? (
                                      <FormFeedback type="invalid">{validation.errors['pago-fecha-pago']}</FormFeedback>
                                    ) : null}
                                </Col>
                                <Col lg={3} md={4} sm={4}>
                                  <label className="col-md-12 col-form-label">Cuenta de Egreso Pago *</label>
                                  <div className="col-md-12">
                                      <RemoteCombo 
                                        value={cuentaEgresoPago}
                                        data={dataAccountsEgresos}
                                        disabled={!dataAccountsEgresos.length}
                                        onChange={(val)=>setCuentaEgresoPago(val)}
                                      />
                                  </div>
                                </Col>
                                <Col lg={3} md={4} sm={4}>
                                    <label className="col-md-12 col-form-label">Observación</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="text"
                                        className="form-control"
                                        name="pago-observacion"
                                        value={validation.values['pago-observacion'] || ""}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched['pago-observacion'] && validation.errors['pago-observacion'] && !validation.values['pago-observacion'] ? true : false
                                        }
                                      />
                                    </div>
                                </Col>
                                <Col lg={3} md={4} sm={4}>
                                  <label className="col-md-12 col-form-label">Total Saldo*</label>
                                  <div className="col-md-12">
                                      <input
                                          type="text"
                                          readOnly={true}
                                          className="form-control"
                                          onChange={validation.handleChange}
                                          value={validation.values['pago-saldo'] || ""}
                                      />
                                  </div>
                                </Col>
                                <Col lg={3} md={4} sm={4}>
                                    <label className="col-md-12 col-form-label">Valor Abono*</label>
                                    <div className="col-md-12">
                                      <Input
                                          type="numeric"
                                          className="form-control"
                                          name="pago-valor-pago"
                                          value={validation.values['pago-valor-pago'] || ""}
                                          onChange={(e)=>{
                                            let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                                            validation.setFieldValue("pago-valor-pago", val);
                                          }}
                                          onBlur={validation.handleBlur}
                                          invalid={
                                            validation.touched['pago-valor-pago'] && validation.errors['pago-valor-pago'] && !validation.values['pago-valor-pago'] ? true : false
                                          }
                                        />
                                        {validation.touched['pago-valor-pago'] && validation.errors['pago-valor-pago'] && !validation.values['pago-valor-pago'] ? (
                                          <FormFeedback type="invalid">{validation.errors['pago-valor-pago']}</FormFeedback>
                                        ) : null}
                                    </div>
                                </Col>
                                <Col lg={2} md={4} sm={4} >

                                    <label className="col-md-12 col-form-label">Consecutivo *</label>
                                    <div className="col-md-12">
                                      <Input
                                        type="numeric"
                                        className="form-control"
                                        name="pago-consecutivo"
                                        disabled={true}
                                        value={validation.values['pago-consecutivo'] || ""}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        invalid={
                                          validation.touched['pago-consecutivo'] && validation.errors['pago-consecutivo'] && !validation.values['pago-consecutivo'] ? true : false
                                        }
                                      />
                                      {validation.touched['pago-consecutivo'] && validation.errors['pago-consecutivo'] && !validation.values['pago-consecutivo'] ? (
                                        <FormFeedback type="invalid">{validation.errors['pago-consecutivo']}</FormFeedback>
                                      ) : null}
                                    </div>
                                </Col>
                              </Row>
                              <br />
                              <Row>
                                <Col md={12}>
                                  <div className="table-responsive">
                                    <Table className="table mb-0">
                                      <thead className="table-light">
                                        <tr>
                                          <th># Factura</th>
                                          <th>Documento Referencia</th>
                                          <th>Fecha</th>
                                          <th>Valor Factura</th>
                                          <th>Valor Abonos</th>
                                          <th>Saldo Final</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {!facturasPersona&&(<tr><td colSpan={5}><Row>
                                            <Col md={12} style={{textAlign: 'center'}}>
                                              <br />
                                              <Spinner className="ms-12" color="dark" />
                                            </Col>
                                          </Row></td></tr>)}
                                        {facturasPersona&&facturasPersona.map((bill, pos)=>{
                                          return (<tr key={pos}>
                                            <th scope="row">{bill.factura}</th>
                                            <td>{bill.docRef}</td>
                                            <td>{bill.fecha}</td>
                                            <td>{bill.totalFactura}</td>
                                            <td>{bill.totalAbonos}</td>
                                            <td>{bill.totalPendiente}</td>
                                          </tr>)
                                        })}
                                      </tbody>
                                    </Table>
                                  </div>
                                </Col>
                              </Row>
                              <br />
                              <Row>
                                <Col md={10}>
                                </Col>
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
                                        <Button type="reset" color="warning" onClick={cancelPago} >
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
                      {/*FORM GENERAL*/}
                      </Col>
                    </Row>

                  </CardBody>
                </Card>
              </Col>
            </Row>)
          }

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR PAGOS</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR PAGOS</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(<Card>
              <Row>
                <Col xl={3}>
                  <p className="text-center">
                    <br />
                    <Button onClick={()=>setEnableForm(true)} color="primary">
                      Nuevo pago
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
              data={data}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              customPageSizeOptions={true}
              className="custom-header-css"
          />)
          :
          (loadingText!="hidden" && loadingText!="" && (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    {
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Anulando Pago..." ?
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

      {/*MODAL DELETE PAGO*/}
      <Modal
        isOpen={confirmModalEliminarPago}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarPago(false);
              setConfirmModalEliminarPago(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ELIMINAR</b></u> el Pago <b>{(confirmEliminarPago!==false ? confirmEliminarPago.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deletePagoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarPago(false);
            setConfirmModalEliminarPago(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE PAGO*/}


      {/*MODAL ANULAR PAGO*/}
      <Modal
        isOpen={confirmModalCancelPago}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarPago(false);
              setConfirmModalCancelPago(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas <u><b>ANULAR</b></u> el Pago <b>{(confirmEliminarPago!==false ? confirmEliminarPago.consecutivo : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deletePagoConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarPago(false);
            setConfirmModalCancelPago(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL ANULAR PAGO*/}

    </React.Fragment>
  );
};

export default withRouter(IndexPagos);

IndexPagos.propTypes = {
  history: PropTypes.object,
};