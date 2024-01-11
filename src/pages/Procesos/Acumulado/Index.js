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

import Select from "react-select";

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
import { getPaymentsAcumulate, getPersons, getBillCashReceiptPDF, getSpentPDF, getPaymentPDF } from "../../../store/actions";

//redux
import { useDispatch, useSelector } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexAcumulado = props => {

  //meta title
  document.title = "Acumulado | Maximo PH";

  const dispatch = useDispatch();
  
  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [tipoFiltro, setTipoFiltro] = useState({ label: "TODOS", value: "TODOS" });
  const [consecutivoFiltro, setConsecutivoFiltro] = useState('');
  const [fechaIniFiltro, setFechaIniFiltro] = useState('');
  const [fechaFinFiltro, setFechaFinFiltro] = useState('');
  const [personaFiltro, setPersonaFiltro] = useState({ label: "TODOS", value: "TODOS" });
  
  const [personasErp, setPersonasErp] = useState([]);
  const [data, setData] = useState([]);
  
  const [dataFiltered, setDataFiltered] = useState([]);
    
  const openPDF = (acumulado)=>{
    if(accessModule.INGRESAR==true){
      setLoadingText("Generando PDF ...");
      switch(acumulado.tipo){
        case "RECIBO DE CAJA":
          dispatch(getBillCashReceiptPDF(null,(url)=>{
            setLoadingText(false);
            const pdfTargetBlank = window.open(url, '_blank');
            pdfTargetBlank.focus();
          }, acumulado.id));
        break;
        case "GASTO":
          dispatch(getSpentPDF(null,(url)=>{
            setLoadingText(false);
            const pdfTargetBlank = window.open(url, '_blank');
            pdfTargetBlank.focus();
          }, acumulado.id));
        break;
        case "PAGO":
          dispatch(getPaymentPDF(null,(url)=>{
            setLoadingText(false);
            const pdfTargetBlank = window.open(url, '_blank');
            pdfTargetBlank.focus();
          }, acumulado.id));
        break;
      }

    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a visulizar pagos", "Permisos");
    }
  };

  const loadAcumulado = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getPersons(null, (dPersons)=>{ 
      
      dPersons.map(person=>{
        person.label = `${person.numero_documento} - ${person.label}`;
      });

      setPersonasErp([{ label: "TODOS", value: "TODOS" } , ...dPersons]);

      dispatch(getPaymentsAcumulate((acumulado)=>{

        let newAccessModule = accessModule;
        acumulado.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

        setAccessModule(newAccessModule);

        acumulado.data.map(bill=>{
          bill.fecha = bill.fecha.split("T")[0];
        });

        setData(acumulado.data);
        
        setDataFiltered(acumulado.data);

        setLoadingText('');

        if(props.onLoad) props.onLoad(acumulado);
          
        
      }));

    },true));
    
  };

  const columns = useMemo(
      () => [
          {
            sticky: true,
            Header: 'Operaciones',
            accessor: acumulado => {
              let classViewBtn = accessModule.INGRESAR==true ? "primary" : "secondary";
  
              return (<div style={{textAlign: 'center'}}> 
                <Button color={classViewBtn} className="btn-sm" onClick={()=>{openPDF(acumulado)}}> 
                  <i className="bx bxs-file-pdf font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">PDF</span>
                </Button>
              </div>);
            }
          },
          {
              Header: 'Tipo',
              accessor: 'tipo',
          },
          {
              Header: 'Consecutivo',
              accessor: 'consecutivo',
          },
          {
              Header: 'Fecha',
              accessor: 'fecha',
          },
          {
              Header: 'Persona',
              accessor: 'personaText',
          },
          {
              Header: 'Documento',
              accessor: 'personaDocumento',
          },
          {
              Header: 'Total',
              HeaderClass: 'text-end',
              accessor: row => (<p className="text-end">$ {(row.valor).toLocaleString()}</p>)
          },
          {
              Header: 'Observación',
              accessor: 'observacion',
          }
      ],
      []
  );
  
  useEffect(()=>{
    loadAcumulado();
  },[]);

  const validateRangeDate = (dateIni, dateEnd, dateToValidate)=>{
    dateIni = new Date(dateIni);
    dateEnd = dateEnd ? new Date(dateEnd) : new Date();
    dateToValidate = new Date(dateToValidate);
    
    return dateToValidate >= dateIni && dateToValidate <= dateEnd;
  };

  const filterAcumulado = ()=>{
    let newDataFiltered = [];
    
    let filterTipo = false;
    let filterConsecutivo = false;
    let filterFecha = false;
    let filterPersona = false;
    
    data.map((rec)=>{
      filterTipo = ( tipoFiltro.value=='TODOS' || (rec.tipo==tipoFiltro.value) );
      filterPersona = ( personaFiltro.value=='TODOS' || (rec.id_persona==personaFiltro.value) );
      filterConsecutivo = ( consecutivoFiltro=='' || (consecutivoFiltro==rec.consecutivo) );
      filterFecha = true;

      if(fechaIniFiltro && fechaFinFiltro){
        filterFecha = validateRangeDate(fechaIniFiltro, fechaFinFiltro, rec.fecha);
      }else if(fechaIniFiltro){
        filterFecha = validateRangeDate(fechaIniFiltro, false, rec.fecha);
      }
      
      if(filterTipo&&filterConsecutivo&&filterFecha&&filterPersona){
        newDataFiltered.push(rec);
      }
    });
    
    setDataFiltered(newDataFiltered);
  };

  useEffect(()=>{
    filterAcumulado();
  },[tipoFiltro, consecutivoFiltro, fechaIniFiltro, fechaFinFiltro, personaFiltro]); 
  
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Procesos" breadcrumbItem="Acumulado: Recibos | Gastos | Pagos" />

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR PAGOS</b></p></Col></Row></Card>)}
          
          {accessModule.INGRESAR==true&&!loadingText&&(<Card>
            <Row>
              <Col xl={12}>
                <Card>
                  <CardBody>
                    <CardTitle className="h5 mb-4">FILTROS</CardTitle>
                    <Form onSubmit={(e) => { e.preventDefault(); return false; }}>
                      <Row>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Tipo</label>
                          <div className="col-md-12">
                            <Select
                                value={tipoFiltro}
                                onChange={value=>setTipoFiltro(value)}
                                options={[
                                  { label: "TODOS", value: "TODOS" },
                                  { label: "RECIBO DE CAJA", value: "RECIBO DE CAJA" },
                                  { label: "GASTO", value: "GASTO" },
                                  { label: "PAGO", value: "PAGO" }
                                ]}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Consecutivo</label>
                          <div className="col-md-12">
                            <Input
                              type="text"
                              className="form-control"
                              value={consecutivoFiltro}
                              onChange={(e)=>setConsecutivoFiltro(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Fecha (Inicio)</label>
                          <div className="col-md-12">
                            <Input
                              type="date"
                              className="form-control"
                              value={fechaIniFiltro}
                              onChange={(e)=>{
                                setFechaIniFiltro(e.target.value);
                                if(!e.target.value) setFechaFinFiltro('');
                              }}
                            />
                          </div>
                        </Col>
                        <Col md={2}>
                          <label className="col-md-12 col-form-label">Fecha (Final)</label>
                          <div className="col-md-12">
                            <Input
                              type="date"
                              disabled={(!fechaIniFiltro)}
                              className="form-control"
                              value={fechaFinFiltro}
                              onChange={(e)=>setFechaFinFiltro(e.target.value)}
                            />
                          </div>
                        </Col>
                        <Col md={4}>
                            <label className="col-md-12 col-form-label">Persona</label>
                            <div className="col-md-12">
                              <RemoteCombo 
                                value={personaFiltro}
                                data={personasErp}
                                onChange={async (val)=>setPersonaFiltro(val)}
                              />
                            </div>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Card>)}

          {
            accessModule.INGRESAR==true && !loadingText ?
            (<TableContainer
              columns={columns}
              data={dataFiltered}
              isGlobalFilter={true}
              isAddOptions={false}
              customPageSize={10}
              totalsFnComponent={(dataF)=>{
                let total = 0;
                
                dataF.map((row)=>{
                  total += Number(row.original.valor.replaceAll(",",""));
                });

                total = total.toLocaleString('es-ES');

                return (<tr>
                  <td><p className="text-center"><b>TOTALES</b></p></td>
                  <td colspan={5}></td>
                  <td><p className="text-end" style={{minWidth: '120px'}}><b>$ {total}</b></p></td>
                  <td></td>
                </tr>);
              }}
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
                      loadingText=="Cargando ..." || loadingText=="Generando PDF ..." ?
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

    </React.Fragment>
  );
};

export default withRouter(IndexAcumulado);

IndexAcumulado.propTypes = {
  history: PropTypes.object,
};