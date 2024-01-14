import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Card,
  Col,
  Table,
  TabPane,
  TabContent, 
  Container,
  Row,
  Modal,
  Form,
  Input,
  Button,
  CardBody,
  Spinner,
  Nav, 
  NavItem, 
  NavLink
} from "reactstrap";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

import Dropzone from "react-dropzone";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

toastr.options = {
  positionClass: 'toast-bottom-right',
  timeOut: 5000,
  extendedTimeOut: 1000,
  progressBar: true,
  newestOnTop: true
};

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

import TableContainer from '../../../components/Common/TableContainer';

import pasarelaImage from "../../../assets/images/pasarela.png";

// actions
import { getBillPDF, getBillsDetails, getBillCashReceipts, getExtractTerceroBillCashReceipts, createBillCashReceipt, createBillCashVoucher, getBillCashOwnVouchers, getPeaceAndSafetyPDF } from "../../../store/actions";

import classnames from "classnames";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexFacturacionHistorica = props => {

  //meta title
  document.title = "Historial Cuentas de Cobro | Maximo PH";

  const dispatch = useDispatch();

  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [modalComprobante, setModalComprobante] = useState(null);

  const [persona, setPersona] = useState('');
  const [terceroErp, setTerceroErp] = useState('');
  const [confirmComprobante, setConfirmComprobante] = useState(false);
  const [confirmReciboCaja, setConfirmReciboCaja] = useState(false);
  
  const [totalPendiente, setTotalPendiente] = useState(0);
  const [totalPagado, setTotalPagado] = useState(0);
  const [facturasPersona, setFacturasPersona] = useState([]);
  
  const [dataBills, setDataBills] = useState([]);
  const [dataRecibosCaja, setDataRecibosCaja] = useState([]);
  const [dataComprobantes, setDataComprobantes] = useState([]);
  const [dataBillsFiltered, setDataBillsFiltered] = useState([]);
  const [cuentaCobro, setCuentaCobro] = useState([]);
  const [cuentaCobroTotalSaldoAnterior, setCuentaCobroTotalSaldoAnterior] = useState(0);
  const [cuentaCobroTotal, setCuentaCobroTotal] = useState(0);
  const [dataCuentasCobro, setDataCuentasCobro] = useState([]);

  const [voucherImage, setVoucherImage] = useState(null);
  
  const columnsHistorico = useMemo(
    () => [
        {
            Header: 'Referencia',
            accessor: 'referencia',
        },
        {
            Header: 'Descripción',
            accessor: 'descripcion'
        },
        {
            Header: 'Área',
            accessor: 'area',
        },
        {
            Header: 'Coeficiente',
            accessor: 'coeficiente',
        },
        {
            Header: 'Saldo',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.saldo_anterior}</p>)
        },
        {
            Header: 'Causado',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.causado}</p>)
        },
        {
            Header: 'Total',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.total}</p>)
        }
    ],
    []
  );

  const columnsRecibosCaja = useMemo(
    () => [
        {
            Header: 'Consecutivo Recibo',
            accessor: 'consecutivo',
        },
        {
            Header: 'Fecha Recibo',
            accessor: 'fecha_recibo',
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
            Header: 'Total Recibo',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {(row.valor_recibo).toLocaleString()}</p>)
        },
        {
            Header: 'Observación',
            accessor: 'observacion',
        }
    ],
    []
  );
  
  const columnsCartera = useMemo(
    () => [
        /*{
            Header: '# Cuenta Cobro',
            accessor: 'factura',
        },
        {
            Header: 'Referencia',
            accessor: 'docRef',
        },*/
        {
            Header: 'Fecha',
            accessor: 'fecha',
        },
        {
            Header: 'Concepto',
            accessor: 'cuenta_nombre',
        },
        {
            Header: 'Valor Cuenta Cobro',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.totalFactura}</p>)

        },
        {
            Header: 'Valor Abonos',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.totalAbonos}</p>)
        },
        {
            Header: 'Valor Descuento',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.totalDescuento}</p>)
        },
        {
            Header: 'Saldo Final',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">$ {row.totalPendiente}</p>)
        }
    ],
    []
  );
  
  const columnsComprobantes = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            return (<p className="text-center">
              <Button color={'info'} className="btn-sm" onClick={()=>{setModalComprobante(row)}}> 
                  <i className="bx bx-view font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver Comprobante</span>
              </Button>
            </p>)
          }
        },
        {
            Header: '# Comprobante',
            accessor: row => (<p className="text-center">{row.id}</p>)
        },
        {
            Header: 'Fecha Comprobante',
            accessor: row => (<p className="text-center">{row.fecha.split("T")[0]}</p>)
        },
        {
            Header: 'Valor Comprobante',
            accessor: row => (<p className="text-end">$ {Number(row.valor).toLocaleString('es-Es')}</p>)

        },
        {
            Header: 'Estado',
            accessor: row => {
              let estado = 'PENDIENTE VALIDACIÓN';

              switch(row.estado){
                case 1: estado='ACEPTADO'; break;
                case 2: estado='RECHAZADO'; break;
                case 3: estado='PREVIAMENTE REGISTRADO'; break;
              }
              
              return (<p className="text-center">{estado}</p>);
            }
        },
        {
            Header: 'Fecha Envio',
            accessor: row => (<p className="text-center">{row.created_at}</p>)
        },
        {
            Header: 'Observación',
            accessor: 'observacion_administrador'
        }
    ],
    []
  );

  const openPDF = ()=>{
    setLoadingText("Generando PDF ...");

    dispatch(getBillPDF(null,(url)=>{
      setLoadingText(false);
      const pdfTargetBlank = window.open(url, '_blank');
      pdfTargetBlank.focus();
    }, cuentaCobro.value));
  };

  const initialValuesReciboCajaForm = {
    'recibo-caja-fecha-recibo': '',
    'recibo-caja-valor-recibo': '',
    'recibo-caja-observacion': ''
  };
  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesReciboCajaForm,
    validationSchema: Yup.object({
      'recibo-caja-fecha-recibo': Yup.string().required("Por favor ingresa la fecha del recibo")
    }),
    onSubmit: () => { }
  });

  const confirmSaveReciboCaja = ()=>{
    let reciboCajaValues = {};
    
    let saldo = Number(totalPendiente.replaceAll(",","").replaceAll(".",""));

    if(!Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))){
      toastr.error("Digite el valor del abono.", "Error en la validación");
      return;
    }

    if(Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""))>saldo){
      toastr.error("El valor del abono es superior al saldo pendiente.", "Error en la validación");
      return;
    }

    let fechaActual = new Date();
    let year = fechaActual.getFullYear();
    let month = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    let day = ('0' + fechaActual.getDate()).slice(-2);

    reciboCajaValues["id_persona"] = persona;

    reciboCajaValues["id_tercero_erp"] = terceroErp;
    
    reciboCajaValues["fecha_recibo"] = `${year}-${month}-${day}`;
    
    reciboCajaValues["intereses"] = 0;

    reciboCajaValues["descuento_pronto_pago"] = 0;
    
    reciboCajaValues["observacion"] = "PASARELA DE PAGOS";
    
    reciboCajaValues["valor_recibo"] = Number(validation.values['recibo-caja-valor-recibo'].replaceAll(",","").replaceAll(".",""));
    
    reciboCajaValues["id_cuenta_ingreso_recibos_caja_erp"] = "";
    
    setConfirmReciboCaja(false);
            
    validation.handleReset();
    
    setLoadingText("Guardando ...");

    dispatch(createBillCashReceipt(reciboCajaValues, (response)=>{
      if(response.success){
        loadFacturasHistorico();
        toastr.success("Nuevo Recibo de Caja.", "Operación Ejecutada");
      }
    }));
  };
  

  const initialValuesComprobantePagoForm = {
    'comprobante-pago-fecha': '',
    'comprobante-pago-valor': ''
  };
  // Form validation 
  const validationComprobantePago = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesComprobantePagoForm,
    validationSchema: Yup.object({
      'comprobante-pago-fecha': Yup.date().required("Por favor ingresa la fecha de pago del comprobante"),
      'comprobante-pago-valor': Yup.string().required("Por favor ingresa el valor de pago del comprobante")
    }),
    onSubmit: () => {
      if(!voucherImage){
        toastr.error("Adjunta el comprobante", "Error de validación");
        return;
      }
      
      let valor = Number(validationComprobantePago.values['comprobante-pago-valor'].replaceAll(",","").replaceAll(".",""));
      if(!valor){
        toastr.error("Digite el valor del comprobante.", "Error en la validación");
        return;
      }

      let saldo = Number(totalPendiente.replaceAll(",","").replaceAll(".",""));
      if(valor>saldo){
        toastr.error("El valor del comprobante es superior al saldo pendiente.", "Error en la validación");
        return;
      }

      const comprobantePagoValues = new FormData();
      comprobantePagoValues.append('id_persona', persona);
      comprobantePagoValues.append('fecha', validationComprobantePago.values['comprobante-pago-fecha']);
      comprobantePagoValues.append('valor', valor);
      comprobantePagoValues.append('image', voucherImage);
      comprobantePagoValues.append('tipo_image', voucherImage?.type);
      
      setLoadingText('Enviando Voucher...');
      cancelVoucher();
      dispatch(createBillCashVoucher(comprobantePagoValues, (response)=>{
        setLoadingText();

        if(response.success){
          cancelVoucher();
          
          toggleTab("3");

          loadFacturasHistorico();
          
          toastr.success("Nuevo Voucher Enviado.", "Operación Ejecutada");
        }else{
          toastr.error(response.error, "Error en la operación");
        }
      }));
    }
  });

  const withButtons = (factura)=>{
    return (<>
      <Button color="primary" className="btn btn-danger btn-sm" onClick={()=>openPDF(factura)}>
        PDF 
      </Button>
      {' '}
      <Button color={"info"} className="btn-sm" onClick={()=>{}}> 
        {"Pagar"} 
      </Button>
      {' '}
      <Button color={"warning"} className="btn-sm" onClick={()=>{}}> 
        {"Comprobante"} 
      </Button>
    </>);
  };

  const selectCuentaCobro = (val, dataToFilter)=>{
    dataToFilter = dataToFilter ? dataToFilter : dataBills;

    setCuentaCobro(val);
    
    let newDataFiltered = [];
    let totalSaldoAnterior = 0;
    let total = 0;

    dataToFilter.map(bill=>{
      if(bill.id==val.value){
        newDataFiltered.push(bill);
        totalSaldoAnterior += Number(bill.saldo_anterior.replaceAll(',',''));
        total += Number(bill.total.replaceAll(',',''));
        bill.causado = bill.total;
        bill.total = (Number(bill.saldo_anterior.replaceAll(',',''))+Number(bill.total.replaceAll(',',''))).toLocaleString('es-ES');
      }
    });

    setCuentaCobroTotalSaldoAnterior(totalSaldoAnterior);
    setCuentaCobroTotal(total);

    setDataBillsFiltered(newDataFiltered);
  };

  const loadFacturasHistorico = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getBillCashOwnVouchers((billCashVouchers)=>{
      setDataComprobantes(billCashVouchers.data);

      dispatch(getBillCashReceipts(null, (billCashReceipts)=>{ 

        dispatch(getBillsDetails(withButtons,(resp)=>{
          let dataDetailToFilter = [];
          let consecutivos = [];

          let emailUser = JSON.parse(localStorage.getItem("authUser")).email.toUpperCase();
          let id_persona = 0;
          let id_tercero_erp = 0;
          let documento_tercero = 0;

          resp.data.map(billDe=>{
            if(billDe.emailPropietario.toUpperCase()==emailUser){
              dataDetailToFilter.push(billDe);
              if(!id_persona) id_persona = billDe.id_persona;
              if(!id_tercero_erp) id_tercero_erp = billDe.id_tercero_erp;
              if(!documento_tercero) documento_tercero = billDe.personaDocumento;
              consecutivos.push({value: billDe.id, label: `CUENTA DE COBRO Nº: ${billDe.consecutivo} - FECHA: ${billDe.created_at.split("T")[0]}`});
            }
          });

          setPersona(id_persona);
          setTerceroErp(id_tercero_erp);

          let recibosDeCaja = [];
          let recibosDeCajaTotal = 0;

          billCashReceipts.data.map(bill=>{
            bill.fecha_recibo = bill.fecha_recibo.split("T")[0];

            if(Number(bill.estado)==1&&bill.personaDocumento==documento_tercero){ 
              recibosDeCaja.push(bill);
              recibosDeCajaTotal += Number(bill.valor_recibo.replaceAll(".","").replaceAll(",",""));
            }
          });

          setTotalPagado(recibosDeCajaTotal);
    
          setDataRecibosCaja(recibosDeCaja);

          const uniqueObjects = [...new Map(consecutivos.map(obj => [obj.id, obj])).values()];
          
          setDataCuentasCobro(uniqueObjects);

          if(uniqueObjects.length==1){
            selectCuentaCobro(uniqueObjects[0], dataDetailToFilter);
          }

          setDataBills(dataDetailToFilter);

          dispatch(getExtractTerceroBillCashReceipts(id_tercero_erp, (bills)=>{
            setFacturasPersona([]);
      
            const billsA = Object.values(bills.data);
            let totalPendiente = 0;
      
            billsA.forEach(bill=>{
              totalPendiente += Number(bill.totalPendiente.replaceAll(".","").replaceAll(",",""));
            });
      
            setTotalPendiente(Number(totalPendiente).toLocaleString('es-ES'));
      
            if(!bills.data.length){
              setFacturasPersona([]);
            }else{
              setFacturasPersona(bills.data);
            }
            
            setLoadingText('');
          }));
        }));
      }));
    }));
  };

  useEffect(()=>{
    loadFacturasHistorico();
  },[]);
  
  const [activeTab, setactiveTab] = useState("1");
  
  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const addImageVoucher = (image)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      setVoucherImage(image);
    }else{
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };

  const cancelVoucher = ()=>{
    setConfirmComprobante(false);
    setVoucherImage(null);
    validation.handleReset();
  };

  const openPDFPazYSalvo = ()=>{
    if(Number(totalPendiente.replaceAll(",","").replaceAll(".",""))<=0){
      setLoadingText("Generando PDF ...");
      
      dispatch(getPeaceAndSafetyPDF(JSON.parse(localStorage.getItem("authUser")).email.toUpperCase(),(url)=>{
        setLoadingText(false);
        if(url){
          const pdfTargetBlank = window.open(url, '_blank');
          pdfTargetBlank.focus();
        }else{
          toastr.options = { positionClass: 'toast-top-right' };
          toastr.warning("Tienes saldo pendiente actualmente, por lo tanto no es posible generar el Paz y Salvo", "Cartera");
        }
      }));
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("Tienes saldo pendiente actualmente, por lo tanto no es posible generar el Paz y Salvo", "Cartera");
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Histórico Cuentas de Cobro" breadcrumbItem="" />
          {
            !loadingText ?
            (<Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    {/*TABS*/}
                    <Nav pills className="navtab-bg nav-justified">
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "1",
                          })}
                          onClick={() => {
                            toggleTab("1");
                          }}
                        >
                          Estado de Cuenta
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "2",
                          })}
                          onClick={() => {
                            toggleTab("2");
                          }}
                        >
                          Histórico de Pagos
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "3",
                          })}
                          onClick={() => {
                            toggleTab("3");
                          }}
                        >
                          Histórico de Comprobantes de Pago
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab === "4",
                          })}
                          onClick={() => {
                            toggleTab("4");
                          }}
                        >
                          Histórico Cuentas de Cobro
                        </NavLink>
                      </NavItem>
                    </Nav>
                    {/*TABS*/}

                    {/*CONTAINER TABS*/}
                    <TabContent activeTab={activeTab} className="p-3 text-muted">
                      <TabPane tabId="1">
                        <Row>
                          <Col sm="12">
                            <br />
                            <TableContainer
                                columns={columnsCartera}
                                data={facturasPersona}
                                customPageSize={1000}
                                hide={1000}
                                isGlobalFilter={false}
                                isAddOptions={false}
                                removePagination={true}
                                customPageSizeOptions={false}
                                className="custom-header-css"
                            />
                            <br />
                            <p style={{textAlign: 'right'}}>
                              <h5>Total Cartera: $ {totalPendiente.toLocaleString()}</h5>
                              <div className="flex flex-end">
                                <Button color={"info"} className="btn-sm" onClick={()=>setConfirmComprobante(true)}> 
                                  {"ADJUNTAR PAGO"} 
                                </Button>
                                {' '}
                                <Button color={"primary"} className="btn-sm" onClick={()=>setConfirmReciboCaja(true)}> 
                                  {"PAGAR PSE"} 
                                </Button>
                              </div>
                              <br />
                              <hr />
                              <br />

                              <Button color={"primary"} className="btn-sm" onClick={()=>openPDFPazYSalvo(true)}> 
                                {"GENERAR PAZ Y SALVO"} 
                              </Button>
                            </p>
                          </Col>
                        </Row>
                      </TabPane>

                      <TabPane tabId="2">
                        <Row>
                          <Col sm="12">
                            <br />
                            <TableContainer
                                columns={columnsRecibosCaja}
                                data={dataRecibosCaja}
                                isGlobalFilter={true}
                                isAddOptions={false}
                                customPageSize={10}
                                customPageSizeOptions={true}
                                className="custom-header-css"
                            />
                            <br />
                            <h5 style={{float: 'right'}}>Total Pagado: $ {totalPagado.toLocaleString()}</h5>
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="3">
                        <Row>
                          <Col sm="12">
                            <br />
                            <TableContainer
                                columns={columnsComprobantes}
                                data={dataComprobantes}
                                isGlobalFilter={true}
                                isAddOptions={false}
                                customPageSize={10}
                                customPageSizeOptions={true}
                                className="custom-header-css"
                            />
                          </Col>
                        </Row>
                      </TabPane>
                      <TabPane tabId="4">
                        <br />
                        <Row>
                          <Col md={11}>
                              <label className="col-md-12 col-form-label">Cuenta de Cobro *</label>
                              <div className="col-md-12">
                                  <RemoteCombo 
                                    value={cuentaCobro}
                                    disabled={(dataCuentasCobro.length==0?true:false)}
                                    data={dataCuentasCobro}
                                    onChange={(val)=>selectCuentaCobro(val)}
                                  />
                              </div>
                          </Col>
                          <Col md={1}>
                            <p className="text-center">
                              <label className="col-md-12 col-form-label"><br /></label>
                              <div className="col-md-12">
                                <Button color="primary" className="btn btn-sm" onClick={()=>openPDF()}>
                                  PDF 
                                </Button>
                              </div>
                            </p>
                          </Col>
                        </Row>
                        <br />
                        <br />
                        <Row>
                          <Col sm="12">
                              <TableContainer
                                columns={columnsHistorico}
                                data={dataBillsFiltered}
                                customPageSize={1000}
                                hide={1000}
                                isGlobalFilter={true}
                                isAddOptions={false}
                                removePagination={true}
                                customPageSizeOptions={false}
                                className="custom-header-css"
                            />
                            <div style={{float: 'right', textAlign: 'right'}}>
                              <h5 >Total Saldo Anterior: $ {cuentaCobroTotalSaldoAnterior.toLocaleString()}</h5>
                              <h5 >Total Cuenta Cobro: $ {cuentaCobroTotal.toLocaleString()}</h5>
                            </div>
                          </Col>
                        </Row>
                      </TabPane>
                    </TabContent>
                    {/*CONTAINER TABS*/}
                  </CardBody>
                </Card>
              </Col>
            </Row>)
          :
          (<Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col md={12} style={{textAlign: 'center'}}>
                    <span>{loadingText}</span>
                    <br />
                    <Spinner className="ms-12" color="dark" />
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>)
          }
        </Container>
      </div>

      {/*MODAL VER COMPROBANTE PAGO*/}
      <Modal isOpen={(confirmComprobante?true:false)} backdrop={'static'} size={'lg'}>
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Enviar comprobante</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              validationComprobantePago.handleReset();
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form onSubmit={(e) => { 
            e.preventDefault(); 
            validationComprobantePago.submitForm(); 
            return false; 
          }}>
            <Row>
              <Col md={4}>
                <label className="col-md-12 col-form-label">Fecha Pago *</label>
                <div className="col-md-12">
                  <Input
                    type="date"
                    className="form-control"
                    name="comprobante-pago-fecha"
                    value={validationComprobantePago.values['comprobante-pago-fecha'] || ""}
                    onChange={validationComprobantePago.handleChange}
                    onBlur={validationComprobantePago.handleBlur}
                    invalid={
                      validationComprobantePago.touched['comprobante-pago-fecha'] && validationComprobantePago.errors['comprobante-pago-fecha'] && !validationComprobantePago.values['comprobante-pago-fecha'] ? true : false
                    }
                  />
                </div>
              </Col>
              <Col md={4}>
                <label className="col-md-12 col-form-label">Total Saldo</label>
                <div className="col-md-12">
                    <input
                        type="text"
                        readOnly={true}
                        className="form-control"
                        value={totalPendiente.toLocaleString()}
                    />
                </div>
              </Col>
              <Col md={4}>
                <label className="col-md-12 col-form-label">Valor Comprobante*</label>
                <div className="col-md-12">
                  <Input
                      type="numeric"
                      className="form-control"
                      name="comprobante-pago-valor"
                      value={validationComprobantePago.values['comprobante-pago-valor'] || ""}
                      onChange={(e)=>{
                        let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                        validationComprobantePago.setFieldValue("comprobante-pago-valor", val);
                      }}
                      onBlur={validationComprobantePago.handleBlur}
                      invalid={
                        validationComprobantePago.touched['comprobante-pago-valor'] && validationComprobantePago.errors['comprobante-pago-valor'] && !validationComprobantePago.values['comprobante-pago-valor'] ? true : false
                      }
                    />
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                  <div className="col-md-12">
                    <br />
                    <Dropzone onDrop={imageFile => addImageVoucher(imageFile[0])} >
                      {({ getRootProps, getInputProps }) => (
                        <Button color={'info'} {...getRootProps()} className="btn-xl"> 
                          <input {...getInputProps()} />
                          <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                          {(voucherImage ? 'Cambiar comprobante' : 'Seleccionar comprobante')}
                        </Button>
                      )}
                    </Dropzone>
                  </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            validationComprobantePago.submitForm();
          }}>GRABAR</button>
          <button type="button" className="btn btn-light" onClick={() => cancelVoucher()}>CANCELAR</button>
        </div>
      </Modal>
      {/*MODAL VER COMPROBANTE PAGO*/}
      
      {/*MODAL VER COMPROBANTE*/}
      <Modal
        isOpen={(modalComprobante?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">COMPROBANTE DE PAGO #{modalComprobante?.id}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalComprobante(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p className="text-center">
            <img
              data-dz-thumbnail=""
              className="avatar-xxl rounded bg-light"
              alt={modalComprobante?.imagen}
              src={(process.env.REACT_API_URL||'http://24.144.93.62:3002')+"/uploads/vouchers-Bill-cash-receipts/"+modalComprobante?.imagen}
            />
          </p>
        </div>
        
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalComprobante(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER COMPROBANTE*/}

      {/*MODAL PSE RECIBO CAJA*/}
      <Modal isOpen={(confirmReciboCaja?true:false)} backdrop={'static'}>
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmReciboCaja(false);
            
              validation.handleReset();
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <Form onSubmit={(e) => { e.preventDefault(); validation.submitForm(); return false; }}>
            <Row>
              <Col md={12}>
                <img
                  src={pasarelaImage}
                  alt=""
                  height="200"
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <label className="col-md-12 col-form-label">Total Saldo</label>
                <div className="col-md-12">
                    <input
                        type="text"
                        readOnly={true}
                        className="form-control"
                        value={totalPendiente.toLocaleString()}
                    />
                </div>
              </Col>
              <Col md={6}>
                  <label className="col-md-12 col-form-label">Valor Abono*</label>
                  <div className="col-md-12">
                    <Input
                        type="numeric"
                        className="form-control"
                        name="recibo-caja-valor-recibo"
                        value={validation.values['recibo-caja-valor-recibo'] || ""}
                        onChange={(e)=>{
                          let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                          validation.setFieldValue("recibo-caja-valor-recibo", val);
                        }}
                        onBlur={validation.handleBlur}
                        invalid={
                          validation.touched['recibo-caja-valor-recibo'] && validation.errors['recibo-caja-valor-recibo'] && !validation.values['recibo-caja-valor-recibo'] ? true : false
                        }
                      />
                  </div>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            confirmSaveReciboCaja();
          }}>GRABAR</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmReciboCaja(false);
            
            validation.handleReset();
          }}>CANCELAR</button>
        </div>
      </Modal>
      {/*MODAL PSE RECIBO CAJA*/}
    </React.Fragment>
  );
};

export default withRouter(IndexFacturacionHistorica);

IndexFacturacionHistorica.propTypes = {
  history: PropTypes.object,
};