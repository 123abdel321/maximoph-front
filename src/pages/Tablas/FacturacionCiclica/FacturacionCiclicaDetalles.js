import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Input,
  Modal,
  FormFeedback,
  Spinner
} from "reactstrap";

import Select from "react-select";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import TableContainer from '../../../components/Common/TableContainer';

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getCyclicalBillDetails, createCyclicalBillDetail, editCyclicalBillDetail, deleteCyclicalBillDetail, getBillingConcepts } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexFacturacionCiclicaDetalles = props => {

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataCyclicalBillDetails, dataBillingConcepts } = useSelector(state => ({
    loading: state.CyclicalBillDetails.loading,
    dataCyclicalBillDetails: state.CyclicalBillDetails.cyclicalBillDetails,
    dataBillingConcepts: state.BillingConcepts.billingConcepts,
    loadingGrid: state.CyclicalBillDetails.loadingGrid
  }));

  const initialValuesFacturaCiclicaDetalle = {
    'factura-ciclica-detalle-total': '',
    'factura-ciclica-detalle-descripcion': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };
  
  const [concepto, setConcepto] = useState(null);
  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [registerNuevaFacturaCiclicaDetalle, setRegisterNuevaFacturaCiclicaDetalle] = useState(false);
  const [editFacturaCiclicaDetalleId, setEditFacturaCiclicaDetalle] = useState(false);
  const [confirmEliminarFacturaCiclicaDetalle, setConfirmEliminarFacturaCiclicaDetalle] = useState(false);
  const [confirmModalEliminarFacturaCiclicaDetalle, setConfirmModalEliminarFacturaCiclicaDetalle] = useState(false);

  const editFacturaCiclicaDetalleFn = (facturaCiclicaDetalle)=>{
    let fieldName = '';
    let fieldValue = '';
    let editFacturaCiclicaDetalleObj = {};

    Object.entries(facturaCiclicaDetalle).map((field)=>{
      fieldValue = field[1];

      fieldName = field[0].replaceAll('_','-');
      fieldName = `factura-ciclica-detalle-${fieldName}`;
      editFacturaCiclicaDetalleObj[fieldName] = fieldValue;

      fieldName = '';
      fieldValue = '';
    });

    setEditFacturaCiclicaDetalle(Number(facturaCiclicaDetalle.id));

    setLoadingText('Editando Detalle...');
    
    validation.setValues(editFacturaCiclicaDetalleObj);

    setRegisterNuevaFacturaCiclicaDetalle(true);

    setConcepto({ label: facturaCiclicaDetalle.conceptoText, value: facturaCiclicaDetalle.id_concepto_factura });
  };

  const deleteFacturaCiclicaDetalleModal = (FacturaCiclicaDetalle)=>{
    setConfirmEliminarFacturaCiclicaDetalle(FacturaCiclicaDetalle);
    setConfirmModalEliminarFacturaCiclicaDetalle(true);
  };
  
  const deleteFacturaCiclicaDetalleConfirm = ()=>{
    cancelFacturaCiclicaDetalle();
    setConfirmEliminarFacturaCiclicaDetalle(false);
    setConfirmModalEliminarFacturaCiclicaDetalle(false);
    

    setLoadingText('Eliminando Detalle...')

    dispatch(deleteCyclicalBillDetail(confirmEliminarFacturaCiclicaDetalle.id, ()=>{
      cancelFacturaCiclicaDetalle();
      loadFacturaCiclicaDetalles();
      props.loadFacturasCiclicas();
      toastr.success("Detalle eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesFacturaCiclicaDetalle,
    validationSchema: Yup.object({
      'factura-ciclica-detalle-total': Yup.string().required("Por favor ingresa el total")
    }),
    onSubmit: (values) => {
      
      let facturaCiclicaDetalleValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('factura-ciclica-detalle-','');
        fieldName = fieldName.replaceAll('-','_');

        if(fieldName!="operaciones"){
          facturaCiclicaDetalleValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });

      if(!concepto){
        toastr.error("Seleccione el concepto.", "Error en la validación");
        return;
      }
      
      facturaCiclicaDetalleValues["id_factura_ciclica"] = props.editFacturaCiclicaId;
      facturaCiclicaDetalleValues["id_concepto_factura"] = concepto.value;
      
      setLoadingText("Guardando ...");
      
      if(!editFacturaCiclicaDetalleId){
        dispatch(createCyclicalBillDetail(facturaCiclicaDetalleValues, (response)=>{
          if(response.success){
            cancelFacturaCiclicaDetalle();
            loadFacturaCiclicaDetalles();
            props.loadFacturasCiclicas();
            toastr.success("Nuevo Detalle.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El Detalle ya está registrado.", "Error en la operación");
          }
        }));
      }else{
        dispatch(editCyclicalBillDetail(facturaCiclicaDetalleValues, (response)=>{
          if(response.success){
            cancelFacturaCiclicaDetalle();
            loadFacturaCiclicaDetalles();
            props.loadFacturasCiclicas();
            toastr.success("Detalle editado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error("El detalle ya está registrado.", "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelFacturaCiclicaDetalle = ()=>{
    setEditFacturaCiclicaDetalle(false);
    setLoadingText(false);
    validation.handleReset();
    setRegisterNuevaFacturaCiclicaDetalle(false);
    
    setConcepto(null);
  };

const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => (<p className="text-center">{row.operaciones}</p>)
        },
        {
            Header: 'Concepto',
            accessor: 'conceptoText',
        },
        {
            Header: 'Total',
            accessor: 'total',
        },
        {
            Header: 'Descripción',
            accessor: 'descripcion',
        }
    ],
    []
  );

  const withButtons = (facturaCiclicaDetalle)=>{
    return (<>
      <Button color="primary" className="btn-sm" onClick={()=>{editFacturaCiclicaDetalleFn(facturaCiclicaDetalle)}}> Editar </Button>
      {' '}
      <Button className="btn btn-danger btn-sm" onClick={()=>{deleteFacturaCiclicaDetalleModal(facturaCiclicaDetalle)}}> Eliminar </Button>
    </>);
  };

  const loadFacturaCiclicaDetalles = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getCyclicalBillDetails(withButtons, ()=>{ 
      
      dispatch(getBillingConcepts(null, ()=>{ 
        setLoadingText('');
      }));

    }, props.editFacturaCiclicaId));
  };

  useEffect(()=>{
    loadFacturaCiclicaDetalles();
  },[]);

  return (
    <React.Fragment>
      <Row>
        <Col sm="12">
          {/*DATATABLE FACTURA CICLICA DETALLES*/}
            <Button color="primary" onClick={()=>{setRegisterNuevaFacturaCiclicaDetalle(true)}}>
                Nuevo
            </Button>
            <br />
            <br />

            {
              !loadingGrid && !loadingText ?

              (<TableContainer
                  columns={columns}
                  data={dataCyclicalBillDetails}
                  isGlobalFilter={false}
                  isAddOptions={false}
                  customPageSize={10}
                  className="custom-header-css"
              />)
              :
                (<Row>
                  <Col xl={12}>
                    <Card>
                      <Row>
                        <Col md={12} style={{textAlign: 'center'}}>
                          <br />
                          <span>{loadingText}</span>
                          <br />
                          {
                            loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando Detalle..." ?
                            (
                              <>
                                <br />
                                <Spinner className="ms-12" color="dark" />
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
          {/*DATATABLE FACTURA CICLICA DETALLES*/}
        </Col>
      </Row>

      {/*MODAL FACTURA CICLICA DETALLE*/}
      <Modal
        isOpen={registerNuevaFacturaCiclicaDetalle}
        size="xl"
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">{editFacturaCiclicaDetalleId===false ? 'Nuevo' : 'Editando'} Detalle</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setRegisterNuevaFacturaCiclicaDetalle(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
        {/*FORM FACTURA CICLICA DETALLE*/}
            <Form
              onSubmit={(e) => {
                e.preventDefault();
                
                validation.submitForm();

                return false;
              }}>
                <Row>
                    <Col md={4}>
                        <label className="col-md-12 col-form-label">Concepto *</label>
                        <div className="col-md-12">
                          <RemoteCombo 
                            value={concepto}
                            data={dataBillingConcepts}
                            onChange={(val)=>setConcepto(val)}
                          />
                        </div>
                    </Col>
                
                    <Col md={3}>
                        <label className="col-md-12 col-form-label">Valor *</label>
                        <div className="col-md-12">
                        <Input
                            type="numeric"
                            className="form-control"
                            name="factura-ciclica-detalle-total"
                            value={validation.values['factura-ciclica-detalle-total'] || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched['factura-ciclica-detalle-total'] && validation.errors['factura-ciclica-detalle-total'] && !validation.values['factura-ciclica-detalle-total'] ? true : false
                            }
                          />
                          {validation.touched['factura-ciclica-detalle-total'] && validation.errors['factura-ciclica-detalle-total'] && !validation.values['factura-ciclica-detalle-total'] ? (
                            <FormFeedback type="invalid">{validation.errors['factura-ciclica-detalle-total']}</FormFeedback>
                          ) : null}
                        </div>
                    </Col>
                
                    <Col md={5}>
                        <label className="col-md-12 col-form-label">Descripción</label>
                        <div className="col-md-12">
                        <Input
                            type="text"
                            className="form-control"
                            name="factura-ciclica-detalle-descripcion"
                            value={validation.values['factura-ciclica-detalle-descripcion'] || ""}
                            onChange={validation.handleChange}
                          />
                        </div>
                    </Col>
                </Row>
                <br />
                <Row>
                  <Col md={12}>
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
                          <Button type="submit" color="primary">
                            Grabar
                          </Button>
                          {" "}
                          <Button type="reset" color="warning" onClick={cancelFacturaCiclicaDetalle} >
                            Cancelar
                          </Button>
                        </>)
                    }
                  </Col>
                </Row>
            </Form>
        {/*FORM FACTURA CICLICA DETALLE*/}
        </div>
      </Modal>
      {/*MODAL FACTURA CICLICA DETALLE*/}

      {/*MODAL DELETE FACTURA CICLICA DETALLE*/}
      <Modal
        isOpen={confirmModalEliminarFacturaCiclicaDetalle}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarFacturaCiclicaDetalle(false);
              setConfirmModalEliminarFacturaCiclicaDetalle(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el detalle <b>{(confirmEliminarFacturaCiclicaDetalle!==false ? confirmEliminarFacturaCiclicaDetalle.conceptoText : '')}</b>?</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteFacturaCiclicaDetalleConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarFacturaCiclicaDetalle(false);
            setConfirmModalEliminarFacturaCiclicaDetalle(false);
          }}>No</button>
        </div>
      </Modal>
      {/*MODAL DELETE FACTURA CICLICA DETALLE*/}

    </React.Fragment>
  );
};

export default withRouter(IndexFacturacionCiclicaDetalles);

IndexFacturacionCiclicaDetalles.propTypes = {
  history: PropTypes.object,
};