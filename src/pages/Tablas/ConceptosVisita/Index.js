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
import { getConceptsVisit, createConceptVisit, editConceptVisit, deleteConceptVisit } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexConceptosVisita = props => {

  //meta title
  document.title = "Conceptos Visita | Maximo PH";

  const dispatch = useDispatch();

  const { loading, loadingGrid, dataVisitConcepts } = useSelector(state => ({
    loading: state.ConceptVisit.loading,
    dataVisitConcepts: state.ConceptVisit.conceptsVisit,
    loadingGrid: state.ConceptVisit.loadingGrid
  }));

  const initialValuesConceptoVisitaForm = {
    'concepto-visita-nombre': ''
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');

  const [editConceptoVisitaId, setEditConceptoVisita] = useState(false);
  const [confirmEliminarConceptoVisita, setConfirmEliminarConceptoVisita] = useState(false);
  const [confirmModalEliminarConceptoVisita, setConfirmModalEliminarConceptoVisita] = useState(false);
  const [enableForm, setEnableForm] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});

  const editConceptoVisitaFn = (conceptoVisita)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editConceptoVisitaObj = {};

      Object.entries(conceptoVisita).map((field)=>{
        fieldValue = field[1];

        fieldName = field[0].replaceAll('_','-');
        fieldName = `concepto-visita-${fieldName}`;
        editConceptoVisitaObj[fieldName] = fieldValue;

        fieldName = '';
        fieldValue = '';
      });

      setEditConceptoVisita(Number(conceptoVisita.id));
      setEnableForm(true);
      setLoadingText('Editando concepto visita...');
      
      validation.setValues(editConceptoVisitaObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar Conceptos de Visita", "Permisos");
    }
  };

  const deleteConceptoVisitaModal = (conceptoVisita)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarConceptoVisita(conceptoVisita);
      setConfirmModalEliminarConceptoVisita(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar Conceptos de Visita", "Permisos");
    }
  };
  
  const deleteConceptoVisitaConfirm = ()=>{
    cancelConceptoVisita();
    setConfirmEliminarConceptoVisita(false);
    setConfirmModalEliminarConceptoVisita(false);
    

    setLoadingText('Eliminando concepto visita...')

    dispatch(deleteConceptVisit(confirmEliminarConceptoVisita.id, ()=>{
      cancelConceptoVisita();
      loadConceptosVisita();
      toastr.success("Concepto eliminado.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesConceptoVisitaForm,
    validationSchema: Yup.object({
      'concepto-visita-nombre': Yup.string().required("Por favor ingresa el nombre")
    }),
    onSubmit: (values) => {
      
      let conceptoVisitaValues = {};

      let fieldName = '';
      let fieldValue = '';
      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('concepto-visita-','');
        fieldName = fieldName.replaceAll('-','_');

        if(["operaciones","value","label","eliminado"].includes(fieldName)==false){
          conceptoVisitaValues[fieldName] = fieldValue;
        }

        fieldName = '';
        fieldValue = '';
      });
      
      setLoadingText("Guardando ...");
      
      if(!editConceptoVisitaId){
        dispatch(createConceptVisit(conceptoVisitaValues, (response)=>{
          if(response.success){
            cancelConceptoVisita();
            loadConceptosVisita();
            toastr.success("Nuevo concepto registrado.", "Operación Ejecutada");
          }else{
            setLoadingText(false);
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }else{
        dispatch(editConceptVisit(conceptoVisitaValues, (response)=>{
          if(response.success){
            cancelConceptoVisita();
            loadConceptosVisita();
            toastr.success("Concepto editado.", "Operación Ejecutada");
          }else{
            setLoadingText("Editando concepto visita...");
            toastr.error(response.error, "Error en la operación");
          }
        }));
      }
    }
  });

  const cancelConceptoVisita = ()=>{
    setEditConceptoVisita(false);
    setLoadingText(false);
    setEnableForm(false);
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
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editConceptoVisitaFn(row)}}> 
                <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Editar</span>
            </Button>
            {' '}
            <Button color={classDeleteBtn} className="btn-sm" onClick={()=>{deleteConceptoVisitaModal(row)}}> 
                <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Eliminar</span>
            </Button>
            </p>);
          }
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        }
    ],
    []
  );

  const loadConceptosVisita = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getConceptsVisit(null, (resp)=>{ 

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));
  
      setAccessModule(newAccessModule);

      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadConceptosVisita();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Tablas" breadcrumbItem="Conceptos Visita" />
          {accessModule.CREAR==true && enableForm==true &&
            (<Row>
            <Col xl={12}>
              <Card>
                <CardBody>
                  <CardTitle className="h5 mb-4">{editConceptoVisitaId===false ? 'Nuevo Concepto Visita' : 'Editando Concepto Visita'}</CardTitle>
                  <Form
                    onSubmit={(e) => {
                      e.preventDefault();
                      
                      validation.submitForm();

                      return false;
                    }}>
                    <Row>
                      <Col md={12}>
                        <label className="col-md-12 col-form-label">Nombre *</label>
                        <div className="col-md-12">
                          <Input
                            type="text"
                            className="form-control"
                            name="concepto-visita-nombre"
                            value={validation.values['concepto-visita-nombre'] || ""}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            invalid={
                              validation.touched['concepto-visita-nombre'] && validation.errors['concepto-visita-nombre'] && !validation.values['concepto-visita-nombre'] ? true : false
                            }
                          />
                          {validation.touched['concepto-visita-nombre'] && validation.errors['concepto-visita-nombre'] && !validation.values['concepto-visita-nombre'] ? (
                            <FormFeedback type="invalid">{validation.errors['concepto-visita-nombre']}</FormFeedback>
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
                              <Button type="reset" color="warning" onClick={cancelConceptoVisita} >
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

          {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR CONCEPTOS DE VISITA</b></p></Col></Row></Card>)}

          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR CONCEPTOS DE VISITA</b></p></Col></Row></Card>)}
          
          {accessModule.CREAR==true && !loadingText && enableForm==false &&(
            <Row>
              <Col xl={3}>
                <Button onClick={()=>setEnableForm(true)} color="primary">
                  <i className="bx bx-folder-plus" style={{ fontSize: '20px', position: 'absolute' }}></i>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  Nuevo concepto de visita
                </Button>
                <br />
                <br />
              </Col>
            </Row>
          )}

          {
            accessModule.INGRESAR==true && !loadingGrid && !loadingText && enableForm==false ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={dataVisitConcepts}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando concepto visita..." ?
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
        isOpen={confirmModalEliminarConceptoVisita}
        backdrop={'static'}
      >
        <div className="modal-header error">
          <h5 className="modal-title" id="staticBackdropLabel">Confirmación</h5>
          <button type="button" className="btn-close"
            onClick={() => {
              setConfirmEliminarConceptoVisita(false);
              setConfirmModalEliminarConceptoVisita(false);
            }} aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <p>¿Estás seguro que deseas eliminar el concepto de visita <b>{(confirmEliminarConceptoVisita!==false ? confirmEliminarConceptoVisita.nombre : '')}</b>?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a este concepto en la plataforma.</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={() => {
            deleteConceptoVisitaConfirm();
          }}>Si</button>
          <button type="button" className="btn btn-light" onClick={() => {
            setConfirmEliminarConceptoVisita(false);
            setConfirmModalEliminarConceptoVisita(false);
          }}>No</button>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default withRouter(IndexConceptosVisita);

IndexConceptosVisita.propTypes = {
  history: PropTypes.object,
};