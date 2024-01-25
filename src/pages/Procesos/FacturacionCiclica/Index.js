import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  CardBody,
  Button,
  Modal,
  Spinner,
  Nav, 
  NavItem, 
  NavLink, 
  TabContent, 
  TabPane
} from "reactstrap";

import classnames from "classnames";

import Select from "react-select";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: 'toast-bottom-right',
  timeOut: 5000,
  extendedTimeOut: 1000,
  progressBar: true,
  newestOnTop: true
};


// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getCyclicalBills, processCyclicalBill, createBillCashReceiptAnticipos, getBills, getBillPDF, getBillsPDF, sendBillPDF, deleteBill, deleteBills } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';

const IndexFacturacionCiclica = props => {

  //meta title
  document.title = "Facturación Ciclica | Maximo PH";

  const dispatch = useDispatch();

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [exportedCurrentMonth, setExportedCurrentMonth] = useState([]);
  
  const [strictedValidation, setStrictedValidation] = useState(false);
  const [errorValidacionEstricta, setErrorValidacionEstricta] = useState(false);
  const [confirmReprintModal, setConfirmReprintModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(`${new Date().toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()} - ${new Date().getFullYear()}`);

  const [anularFactura, setAnularFactura] = useState(false);
  const [loadingAnularFactura, setLoadingAnularFactura] = useState('');

  const [anularFacturas, setAnularFacturas] = useState(false);
  const [loadingAnularFacturas, setLoadingAnularFacturas] = useState('');
  
  const [periodo, setPeriodo] = useState({});
  const [optionsPeriodo, setOptionsPeriodo] = useState([]);
  const [loadingPeriodo, setLoadingPeriodo] = useState(false);
  
  const [exportarPeriodo, setExportarPeriodo] = useState(false);
  
  const [activeTab1, setactiveTab1] = useState("5");
    
  let periodoExportadoStorage = JSON.parse(localStorage.getItem("periodo-exportado"));
      periodoExportadoStorage = (periodoExportadoStorage || []);

  const [data, setData] = useState([]);
  const [dataExportado, setDataExportado] = useState(periodoExportadoStorage);
  
  const [cyclicalBillsTotals, setCyclicalBillsTotals] = useState(null);

  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };

  const columnsPrevio = useMemo(
    () => [
        {
          Header: 'Inmueble',
          accessor: 'inmuebleText',
        },
        {
            Header: 'Área',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.areaText}</p>)
          },
          {
            Header: 'Cédula',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.personaDocumento}</p>)
          },
          {
            Header: 'Persona',
            accessor: 'personaText',
          },
          {
            Header: 'Tipo',
            accessor: 'personaTipo',
          },
          {
            Header: '%',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.personaPorcentaje}</p>)
          },
          {
            Header: 'Concepto',
            accessor: 'conceptoText'
          },
          {
            Header: 'Valor Concepto',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.valor_totalText}</p>)
          }
    ],
    []
  );

  const columnsHistorico = useMemo(
    () => [
        {
            sticky: true,
            Header: 'Operaciones',
            accessor: 'operaciones',
        },
        {
            Header: 'Inmueble',
            accessor: 'inmuebleText',
        },
        {
            Header: 'Área',
            accessor: 'areaText',
        },
        {
            Header: 'Consecutivo Factura',
            accessor: 'consecutivo'
        },
        {
            Header: 'Fecha Factura',
            accessor: 'fecha',
        },
        {
            Header: 'Cédula',
            accessor: 'personaDocumento',
        },
        {
            Header: 'Persona',
            accessor: 'propietarioText',
        },
        {
            Header: 'Total',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{row.valortotal}</p>)
        }
    ],
    []
  );

  const openPDF = (factura)=>{
    setLoadingText("Generando PDF ...");

    dispatch(getBillPDF(null,(url)=>{
      setLoadingText(false);
      const pdfTargetBlank = window.open(url, '_blank');
      pdfTargetBlank.focus();
    }, factura.id));
  };
  
  const openMultiplePDF = (periodo, fisico)=>{
    setLoadingText("Generando PDF del lote completo ...");
    dispatch(getBillsPDF(null,(url)=>{
      setLoadingText(false);
      const pdfTargetBlank = window.open(url, '_blank');
      pdfTargetBlank.focus();
    }, periodo.value, fisico));
  };
  
  const sendPDF = (factura)=>{
    setLoadingText("Enviando Email con PDF ...");

    dispatch(sendBillPDF(null,()=>{
      setLoadingText(false);
      toastr.success("E-EMAIL ENVIADO CON ÉXITO.", "Operación Ejecutada");
    }, factura.id));
  };

  const voidInvoice = ()=>{
    setLoadingText("Anulando Cuenta de Cobro ...");

    dispatch(deleteBill(anularFactura.id, ()=>{
      setLoadingText(false);
      setAnularFactura(false);
      setLoadingAnularFactura(false);
      loadFacturasCiclicas(()=>{
        toastr.success("LA CUENTA DE COBRO HA SIDO ANULADA CON ÉXITO.", "Operación Ejecutada");
      });
    }));
  };

  const voidInvoices = ()=>{
    setLoadingText("Anulando Cuentas de Cobro ...");

    dispatch(deleteBills(anularFacturas.value, ()=>{
      setLoadingText(false);
      setAnularFacturas(false);
      setLoadingAnularFacturas(false);
      loadFacturasCiclicas(()=>{
        toastr.success("LAS CUENTAS DE COBRO HAN SIDO ANULADAS CON ÉXITO.", "Operación Ejecutada");
      });
    }));
  };

  const withButtons = (factura)=>{
    if(Number(factura.estado)==0){
      return (<div className={"text-center"}>
        <Button className="btn btn-primary btn-sm" onClick={()=>{openPDF(factura)}}> 
          <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">PDF</span>
        </Button>
        {" "}
        <b>ANULADA</b>
      </div>);
    }else{
      return (<div className={"text-center"}>
        <Button className="btn btn-primary btn-sm" onClick={()=>{openPDF(factura)}}> 
          <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">PDF</span>
        </Button>
        {" "}
        <Button className="btn btn-info btn-sm" onClick={()=>{sendPDF(factura)}}> 
          <i className="bx bx-mail-send font-size-14 align-middle el-mobile"></i>
          <span className="el-desktop">Email</span>
        </Button>
        {" "}
         {/*<Button className="btn btn-danger btn-sm" onClick={()=>{setAnularFactura(factura)}}> 
            <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
            <span className="el-desktop">Anular</span>
        </Button>*/}
      </div>);
    }
  };

  const TotalsPreviewCyclicalBills = ()=>{
    return (<Row >
      <Col lg={12} >
        <Row>
          <Col lg={4}>
            <Card className="mini-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Inmuebles con Factura</b>
                    <h5 className="mb-0">{Number(cyclicalBillsTotals.unidades_ingresadas).toLocaleString()} de { cyclicalBillsTotals.unidades_ingresadas ? Number(cyclicalBillsTotals.unidades_ingresadas).toLocaleString() : 0}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-building-house"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mini-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Número de Facturas</b>
                    <h5 className="mb-0">{Number(cyclicalBillsTotals.facturas_ingresadas).toLocaleString()}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-spreadsheet"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Coeficiente %</b>
                    <h5 className="mb-0">% {Number(cyclicalBillsTotals.coeficiente_ingresado).toLocaleString()} de % {Number(cyclicalBillsTotals.coeficiente_entorno).toLocaleString()}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-calculator"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Valor Total Facturas - 100%</b>
                    <h5 className="mb-0">$ {Number(cyclicalBillsTotals.valor_total_facturas).toLocaleString()}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-money"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Concepto Administración - { cyclicalBillsTotals.valor_total_administracion ? Math.round((Number(cyclicalBillsTotals.valor_total_administracion)/Number(cyclicalBillsTotals.valor_total_facturas))*100).toString() : 0}%</b>
                    <h6 className="mb-0">$ {Number(cyclicalBillsTotals.valor_total_administracion).toLocaleString()} de $ {cyclicalBillsTotals.ppto_entorno ? Math.round(Number(cyclicalBillsTotals.ppto_entorno)/12).toLocaleString() : 0}</h6>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-money"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

        </Row>
      </Col>

      <Col lg={12} >
        <Row>
          {cyclicalBillsTotals.concepts.map((concept, index)=>(<Col lg={3} key={index}>
            <Card className="blog-stats-wid">
              <CardBody>
                <div className="d-flex flex-wrap">
                  <div className="me-3">
                    <b className="text-muted mb-2">Concepto {concept.nombre_concepto} - {((Number(concept.total_concepto)/Number(cyclicalBillsTotals.valor_total_facturas))*100).toFixed(2).toString()}%</b>
                    <h5 className="mb-0">$ {Number(concept.total_concepto).toLocaleString()}</h5>
                  </div>

                  <div className="avatar-sm ms-auto">
                    <div className="avatar-title bg-light rounded-circle text-primary font-size-20">
                      <i className="bx bx-money"></i>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>))}
        </Row>
      </Col>
    </Row>);
  };

  const loadFacturasCiclicasHis = (periodoOption, cb)=>{
    dispatch(getBills(withButtons,(respHistory)=>{
      let periodos = [];
      respHistory.exportedPeriods.map(period=>{
        periodos.push({
          value: period.id,
          total: period.valor_total,
          label: `COD: ${period.id} | ${new Date(period.periodo+"-01 00:00:00").toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()} - ${new Date(period.periodo+"-01 00:00:00").getFullYear()}
                  | ${period.valor_total}`
        });
      });

      setOptionsPeriodo(periodos);
      
      setPeriodo((periodoOption?periodoOption:periodos[0]));

      setDataExportado(respHistory.data);

      setLoadingText('');

      if(cb) cb();
    }, periodoOption?.value));
  };

  const loadFacturasCiclicas = (cb)=>{
    setLoadingText('Cargando ...');

    dispatch(getCyclicalBills(null,(respPreview)=>{
      /*PREVIEW DATA CYCLICAL BILLS*/
        respPreview.data.map((bill, pos)=>{
          respPreview.data[pos].valor_totalText = new Intl.NumberFormat().format(Number(bill.valor_total_sum));
        });
        setData(respPreview.data);
        
        let dateNow = `${respPreview.periodoFacturacion} 00:00:00`

        setCurrentPeriod(`${new Date(dateNow).toLocaleDateString('es-ES', { month: 'long' }).toUpperCase()} - ${new Date(dateNow).getFullYear()}`);

        setExportedCurrentMonth(respPreview.exported);
      /*PREVIEW DATA CYCLICAL BILLS*/

      setStrictedValidation(respPreview.stricted);
      setCyclicalBillsTotals(respPreview.totals);

      loadFacturasCiclicasHis(false, cb);
    }, true));
  };

  useEffect(()=>{
    loadFacturasCiclicas();
  },[]);
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Facturación Cíclica" />
          {
            !loadingText ?
            (<Row>
              <Col xl={12}>
                <Card style={{backgroundColor: 'transparent'}}>
                  <CardBody>
                    <Nav pills className="navtab-bg nav-justified" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 5}}>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab1 === "5",
                          })}
                          onClick={() => {
                            toggle1("5");
                          }}
                        >
                          Previo Facturación Cíclica Mensual
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          style={{ cursor: "pointer" }}
                          className={classnames({
                            active: activeTab1 === "6",
                          })}
                          onClick={() => {
                            toggle1("6");
                          }}
                        >
                          Histórico Facturación Ciclica Exportada
                        </NavLink>
                      </NavItem>
                    </Nav>

                    <TabContent activeTab={activeTab1} className="p-3 text-muted">
                          <TabPane tabId="5">
                            
                            <Row>
                              <Col sm="12" style={{padding: 0}}>
                                  {/*TOTALES*/}
                                  <TotalsPreviewCyclicalBills />
                                  {/*TOTALES*/}
                                  
                                  <div className="d-grid gap-2" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                                    <Button color="primary"  onClick={()=>{
                                      let errors = [];

                                      if(Number(cyclicalBillsTotals.unidades_ingresadas)!=Number(cyclicalBillsTotals.unidades_entorno)){
                                        errors.push(`Inmuebles con Factura Registradas: ${Number(cyclicalBillsTotals.unidades_ingresadas).toLocaleString()} de ${cyclicalBillsTotals.unidades_entorno}`);
                                      }
                                      
                                      if(Number(cyclicalBillsTotals.coeficiente_ingresado)!=Number(cyclicalBillsTotals.coeficiente_entorno)){
                                        errors.push(`Coeficiente total: ${Number(cyclicalBillsTotals.coeficiente_ingresado).toLocaleString()} de % ${Number(cyclicalBillsTotals.coeficiente_entorno).toLocaleString()}`);
                                      }

                                      if(Number(cyclicalBillsTotals.valor_total_administracion)!=Math.round(Number(cyclicalBillsTotals.ppto_entorno)/12)){
                                        errors.push(`Valor administración: $ ${Number(cyclicalBillsTotals.valor_total_administracion).toLocaleString()} de $ ${Math.round(Number(cyclicalBillsTotals.ppto_entorno)/12).toLocaleString()}`);
                                      }
                                      
                                      if(cyclicalBillsTotals.unidades_admon_diff){
                                        errors.push(`Unidades con % Administración diferente de 100 : ${cyclicalBillsTotals.unidades_admon_diff}`);
                                      }

                                      if(errors.length==0){
                                        setExportarPeriodo(true);
                                      }else{
                                        setErrorValidacionEstricta(errors);
                                      }
                                    }}>
                                      PRESIONE CLICK PARA GENERAR ESTE LOTE DE FACTURACIÓN {currentPeriod}
                                    </Button>
                                  </div>

                                  <br />
                                  <TableContainer
                                    columns={columnsPrevio}
                                    data={data}
                                    totalsFnComponent={(dataF)=>{
                                      let valorAdmon = 0;
                                      
                                      dataF.map((row)=>{
                                        valorAdmon += Number(row.original.valor_total_sum);
                                      });
                                      valorAdmon = valorAdmon.toLocaleString('es-ES');

                                      return (<tr>
                                        <td><p className="text-center"><b>TOTALES</b></p></td>
                                        <td colspan={6  }></td>
                                        <td><p className="text-end" style={{minWidth: '110px'}}><b>$ {valorAdmon}</b></p></td>
                                      </tr>);
                                    }}
                                    isGlobalFilter={true}
                                    isAddOptions={false}
                                    customPageSize={10}
                                    customPageSizeOptions={true}
                                    className="custom-header-css"
                                  />
                              </Col>
                            </Row>
                          </TabPane>
                          <TabPane tabId="6">
                            <Row style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: '10 5'}}>
                              <Col sm="10">
                                <label className="col-md-12 col-form-label">Periodo *</label>
                                <div className="col-md-12">
                                    <Select
                                      value={periodo}
                                      onChange={value=>{
                                        loadFacturasCiclicasHis(value);
                                      }}
                                      options={optionsPeriodo}
                                      className="select2-selection"
                                      />
                                </div>
                                <br />
                              </Col>
                                
                              <Col sm="1">
                                <br />
                                <br />
                                
                                <Button className="btn btn-info btn-sm" onClick={()=>{
                                  setConfirmReprintModal(periodo.label);
                                }}> IMPRIMIR</Button>
                              </Col>

                              {/*<Col sm="1">
                                <br />
                                <br />
                                <Button className="btn btn-danger btn-sm" onClick={()=>{setAnularFacturas(periodo)}}> ANULAR</Button>
                              </Col>*/}
                            </Row>
                            <br />
                            <Row>
                              <Col sm="12" style={{padding: 0}}>
                                  <TableContainer
                                    columns={columnsHistorico}
                                    totalsFnComponent={(dataF)=>{
                                      let valorAdmon = 0;
                                      
                                      dataF.map((row)=>{
                                        valorAdmon += Number(row.original.valortotal.replaceAll(",",""));
                                      });
                                      valorAdmon = valorAdmon.toLocaleString('es-ES');

                                      return (<tr>
                                        <td><p className="text-center"><b>TOTALES</b></p></td>
                                        <td colspan={6  }></td>
                                        <td><p className="text-end" style={{minWidth: '110px'}}><b>$ {valorAdmon}</b></p></td>
                                      </tr>);
                                    }}
                                    data={dataExportado}
                                    isGlobalFilter={true}
                                    isAddOptions={false}
                                    customPageSize={10}
                                    className="custom-header-css"
                                  />
                              </Col>
                            </Row>
                          </TabPane>
                    </TabContent>
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
      
      {/*MODAL EXPORTAR FACTURACIÓN CÍCLICA*/}
      <Modal
        isOpen={exportarPeriodo}
        backdrop={'static'}
      >
        <div className="modal-header system">
          {loadingPeriodo==false&&(<><h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setExportarPeriodo(false);
              setLoadingPeriodo(false);
            }} aria-label="Close"></button></>)}
        </div>
        <div className="modal-body">
          {
            loadingPeriodo==true?
            (<>
              <Col xl={12}>
                <Card>
                  <Row>
                    <Col md={12} style={{textAlign: 'center'}}>
                      <span>EXPORTANDO FACTURAS <b>{currentPeriod}</b> ...</span>
                      <br />
                      <br />
                      <Spinner className="ms-12" color="dark" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>)
            :
            (<p>¿Estás seguro que deseas <b><u><i>{exportedCurrentMonth.length==0 ? 'EXPORTAR' : 'VOLVER A EXPORTAR'}</i></u></b> el periodo de facturación <b><u><i>{currentPeriod}</i></u></b>?</p>)
          }
        </div>
        {loadingPeriodo==false&&(<div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setLoadingPeriodo(true);

            setTimeout(()=>{
              dispatch(processCyclicalBill(null,(dataH)=>{
                let cuentaAnticipoEntorno = '';
                JSON.parse(localStorage.getItem("enviromentMaximo")).map(enviromentConfig=>{
                  if(enviromentConfig.campo=="id_cuenta_anticipos_erp"&&enviromentConfig.valor!=""&&enviromentConfig.valor!=null){
                    cuentaAnticipoEntorno = enviromentConfig.valor;
                  }
                })
        
                if(cuentaAnticipoEntorno&&dataH.data.id){
                  dispatch(createBillCashReceiptAnticipos({id_history: dataH.data.id},(data)=>{
                    loadFacturasCiclicas(()=>{
                      setExportarPeriodo(false);
                      setLoadingPeriodo(false);
                      toggle1("6");
                      toastr.success("PERIODO DE FACTURACIÓN EXPORTADO.", "Operación Ejecutada");
                    });
                  }));
                }else{
                  loadFacturasCiclicas(()=>{
                    setExportarPeriodo(false);
                    setLoadingPeriodo(false);
                    toggle1("6");
                    toastr.success("PERIODO DE FACTURACIÓN EXPORTADO.", "Operación Ejecutada");
                  });
                }

              }));
            },2000);
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setExportarPeriodo(false);
            setLoadingPeriodo(false);
          }}>No</button>
        </div>)}
      </Modal>
      {/*MODAL EXPORTAR FACTURACIÓN CÍCLICA*/}

      {/*MODAL ANULAR CUENTA DE COBRO*/}
      <Modal
        isOpen={(anularFactura?true:false)}
        backdrop={'static'}
      >
        <div className="modal-header system">
          {loadingAnularFactura==false&&(<><h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setAnularFactura(false);
              setLoadingAnularFactura(false);
            }} aria-label="Close"></button></>)}
        </div>
        <div className="modal-body">
          {
            loadingAnularFactura==true?
            (<>
              <Col xl={12}>
                <Card>
                  <Row>
                    <Col md={12} style={{textAlign: 'center'}}>
                      <span>ANULANDO CUENTA DE COBRO <b>{anularFactura.consecutivo}</b> ...</span>
                      <br />
                      <br />
                      <Spinner className="ms-12" color="dark" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>)
            :
            (<p>¿Estás seguro que deseas <b>ANULAR</b> la cuenta de cobro <b>{anularFactura.consecutivo}</b> y sus Recibos de Caja?</p>)
          }
        </div>
        {loadingAnularFactura==false&&(<div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setLoadingAnularFactura(true);
            
            setTimeout(()=>{
              voidInvoice();
            },2000);
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setAnularFactura(false);
            setLoadingAnularFactura(false);
          }}>No</button>
        </div>)}
      </Modal>
      {/*MODAL ANULAR CUENTA DE COBRO*/}


      {/*MODAL ANULAR CUENTAS DE COBRO*/}
      <Modal
        isOpen={(anularFacturas?true:false)}
        backdrop={'static'}
      >
        <div className="modal-header system">
          {loadingAnularFacturas==false&&(<><h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setAnularFacturas(false);
              setLoadingAnularFacturas(false);
            }} aria-label="Close"></button></>)}
        </div>
        <div className="modal-body">
          {
            loadingAnularFacturas==true?
            (<>
              <Col xl={12}>
                <Card>
                  <Row>
                    <Col md={12} style={{textAlign: 'center'}}>
                      <span>ANULANDO CUENTAS DE COBRO DEL PERÍODO <b>{anularFacturas.label}</b> ...</span>
                      <br />
                      <br />
                      <Spinner className="ms-12" color="dark" />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>)
            :
            (<p>¿Estás seguro que deseas <b>ANULAR</b> las cuentas de cobro del período <b>{anularFacturas.label}</b> y sus Recibos de Caja?</p>)
          }
        </div>
        {loadingAnularFacturas==false&&(<div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            setLoadingAnularFacturas(true);
            
            setTimeout(()=>{
              voidInvoices();
            },2000);
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setAnularFacturas(false);
            setLoadingAnularFacturas(false);
          }}>No</button>
        </div>)}
      </Modal>
      {/*MODAL ANULAR CUENTAS DE COBRO*/}
      
      {/*MODAL ERROR VALIDACIÓN ESTRICTA*/}
        <ModalConfirmAction 
          confirmModal={(errorValidacionEstricta?true:false)}
          information={true}
          error={true}
          title={( strictedValidation==0||strictedValidation==false ? "Atención" : "Error" )}
          onClose={() => {
            setErrorValidacionEstricta(false);
            
            if(strictedValidation==0||strictedValidation==false){
              setExportarPeriodo(true);
            }
          }}
          description={(<p>
            {strictedValidation==0||strictedValidation==false ? 'Es importante que conozcas' : 'Antes de facturar debes corregir'} las siguientes novedades: <br /><br />
            {errorValidacionEstricta[0]} <br /> 
            {errorValidacionEstricta[1]} <br />
            {errorValidacionEstricta[2]} <br /> 
            {errorValidacionEstricta[3]} <br /> 
          </p>)}
        />
      {/*MODAL ERROR VALIDACIÓN ESTRICTA*/}
      
      {/*MODAL CONFIRM RE-PRINT*/}
        <ModalConfirmAction 
          confirmModal={(confirmReprintModal?true:false)}
          information={true}
          error={false}
          title={"Confirmación"}
          onClose={() => {      
            setConfirmReprintModal(false);
          }}
          description={(<p>
            ¿Qué tipo de impresión deseas generar del lote <b>{confirmReprintModal}</b> ?.
          </p>)}
          buttons={(<>
            <button type="button" className="btn btn-info" onClick={()=>{
              setConfirmReprintModal(false);
              openMultiplePDF(periodo, 1);
            }}>Sólo Físicos</button>
            <button type="button" className="btn btn-light" onClick={()=>{
              setConfirmReprintModal(false);
              openMultiplePDF(periodo, 0);
            }}>Completo</button>
          </>)}
        />
      {/*MODAL CONFIRM RE-PRINT*/}

    </React.Fragment>
  );
};

export default withRouter(IndexFacturacionCiclica);

IndexFacturacionCiclica.propTypes = {
  history: PropTypes.object,
};