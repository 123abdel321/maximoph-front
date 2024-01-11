import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";

import {
  Card,
  Col,
  Container,
  Row,
  Button,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Spinner,
  CardTitle,
  TabPane,
  TabContent,
} from "reactstrap";

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

//PROPIETARIOS - VISITANTE
import InmuebleVisitante  from "../../Tablas/Inmuebles/InmuebleVisitantes";

//PROPIETARIOS - VEHICULOS
import InmuebleVehiculos  from "../../Tablas/Inmuebles/InmuebleVehiculos";

//PROPIETARIOS - MASCOTAS
import InmuebleMascotas  from "../../Tablas/Inmuebles/InmuebleMascotas";

//Import RemoteCombo
import RemoteCombo from "../../../components/Maximo/RemoteCombo";

toastr.options = {
  positionClass: 'toast-bottom-right',
  timeOut: 5000,
  extendedTimeOut: 1000,
  progressBar: true,
  newestOnTop: true
};

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import classnames from "classnames";

// actions
import { getBills, getPropertiesOwnerRenter } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

// actions
import { getControlVisits } from "../../../store/actions";

const IndexAutorizaVisitantes = props => {

  //meta title
  document.title = "Autorizar Visitas | Maximo PH";

  const dispatch = useDispatch();
  
  const [activeTab1, setactiveTab1] = useState("7");
  const [loadingText, setLoadingText] = useState(false);
  const [loadingVisitors, setLoadingVisitors] = useState(false);
  const [propertyId, setPropertyId] = useState(3);
  const [propertyComboValue, setPropertyComboValue] = useState(3);
  const [dataProperties, setDataProperties] = useState(3);
  const [dataAllVisits, setDataAllVisits] = useState([]);
  const [dataVisits, setDataVisits] = useState([]);
  
  const toggle1 = tab => {
    if (activeTab1 !== tab) {
      setactiveTab1(tab);
    }
  };

  const filterVisits = (property, dataToFilter)=>{
    let filterDataVitis = [];
    dataToFilter = dataToFilter ? dataToFilter : dataAllVisits;
    
    dataToFilter.map(visit=>{
      if(Number(visit.id_inmueble)==Number(property)) filterDataVitis.push(visit);
    });

    setDataVisits(filterDataVitis);
  };

  const loadInmueblesPropietarioInquilino = ()=>{
    setLoadingText('Cargando ...');
    dispatch(getControlVisits(null, (respV)=>{ 
      setDataAllVisits(respV.data);

      dispatch(getPropertiesOwnerRenter(null,(resp)=>{
        let newDataproperties = [];
        
        resp.data.map(property=>{
          newDataproperties.push({
            value: property.id,
            label: property.tipoText+'-'+property.zonaText+': '+property.numero,
          })
        });

        setDataProperties(newDataproperties);
        
        if(newDataproperties.length){
          setPropertyComboValue(newDataproperties[0]);

          setPropertyId(newDataproperties[0].value);

          filterVisits(newDataproperties[0].value, respV.data);
        }

        setLoadingText('');

      },JSON.parse(localStorage.getItem("authUser")).email));

    }));
  };

  const selectProperty = (property)=>{
    setPropertyComboValue(property);
    setPropertyId(property.value);
    
    filterVisits(property.value);
    
    setLoadingVisitors(true);
    
    setTimeout(()=>{
      setLoadingVisitors(false);
    },1000);
  };

  useEffect(()=>{
    loadInmueblesPropietarioInquilino();
  },[]);

  const columns = useMemo(
    () => [
        {
            Header: 'Inmueble',
            accessor: 'inmuebleText',
        },
        {
            Header: 'Zona',
            accessor: 'zonaText',
        },
        {
            Header: 'Concepto Visita',
            accessor: 'conceptoText',
        },
        {
            Header: 'Fecha Ingreso',
            accessor: 'fecha_ingreso',
        },
        {
            Header: 'Placa',
            accessor: 'placa',
        },
        {
            Header: 'Persona Visitante',
            accessor: 'personaVisitanteText',
        }
    ],
    []
  );
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Autorizar Visitantes" breadcrumbItem="" />
          {
            !loadingText ?
            (<>
              <Row>
                <Col xl={12}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h5 mb-4">Administrar autorizaciones de ingreso</CardTitle>

                      <Row>
                        <Col md={12}>
                            <label className="col-md-12 col-form-label">Inmueble *</label>
                            <div className="col-md-12">
                                <RemoteCombo 
                                  value={propertyComboValue}
                                  disabled={(dataProperties.length==0?true:false)}
                                  data={dataProperties}
                                  onChange={(val)=>selectProperty(val)}
                                />
                            </div>
                        </Col>
                      </Row>

                      <br />
                      <br />
                      {
                        dataProperties.length==0?
                        (<Row>
                          <Col xl={12}>
                            <Card>
                              <Row>
                                <Col md={12} style={{textAlign: 'center'}}>
                                  <br />
                                  <br />
                                  <b className="h5">No hay inmuebles asociados a tu cuenta.</b>
                                  <br />
                                  <br />
                                </Col>
                              </Row>
                            </Card>
                          </Col>
                        </Row>)
                        :
                        (<>
                          <Nav pills className="navtab-bg nav-justified">
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "7",
                                })}
                                onClick={() => {
                                  toggle1("7");
                                }}
                              >
                                Visitantes
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "8",
                                })}
                                onClick={() => {
                                  toggle1("8");
                                }}
                              >
                                Vehiculos
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "10",
                                })}
                                onClick={() => {
                                  toggle1("10");
                                }}
                              >
                                Mascotas
                              </NavLink>
                            </NavItem>
                            <NavItem>
                              <NavLink
                                style={{ cursor: "pointer" }}
                                className={classnames({
                                  active: activeTab1 === "9",
                                })}
                                onClick={() => {
                                  toggle1("9");
                                }}
                              >
                                Histórico de visitas
                              </NavLink>
                            </NavItem>
                          </Nav>
                          { 
                            loadingVisitors ?
                            (<Row>
                              <Col xl={12}>
                                <Card>
                                  <Row>
                                    <Col md={12} style={{textAlign: 'center'}}>
                                      <br />
                                      <br />
                                      <Spinner className="ms-12" color="dark" />
                                      <br />
                                      <br />
                                    </Col>
                                  </Row>
                                </Card>
                              </Col>
                            </Row>)
                            :
                            (<>
                              <TabContent activeTab={activeTab1} className="p-3 text-muted">
                                <TabPane tabId="7">
                                  <Row>
                                    <Col sm="12">
                                      {/*DATATABLE VISITAS*/}
                                        <InmuebleVisitante editInmuebleId={propertyId} authDisabled={true} />
                                      {/*DATATABLE VISITAS*/}
                                    </Col>
                                  </Row>
                                </TabPane>

                                <TabPane tabId="8">
                                  <Row>
                                    <Col sm="12">
                                      {/*DATATABLE VEHICULOS*/}
                                        <InmuebleVehiculos editInmuebleId={propertyId} authDisabled={true}  />
                                      {/*DATATABLE VEHICULOS*/}
                                    </Col>
                                  </Row>
                                </TabPane>

                                <TabPane tabId="10">
                                  <Row>
                                    <Col sm="12">
                                      {/*DATATABLE MASCOTAS*/}
                                        <InmuebleMascotas editInmuebleId={propertyId} authDisabled={true}  />
                                      {/*DATATABLE MASCOTAS*/}
                                    </Col>
                                  </Row>
                                </TabPane>

                                <TabPane tabId="9">
                                  <Row>
                                    <Col sm="12">
                                      {/*DATATABLE VISITAS*/}
                                        {<TableContainer
                                            columns={columns}
                                            data={dataVisits}
                                            isGlobalFilter={true}
                                            isAddOptions={false}
                                            customPageSize={10}
                                            customPageSizeOptions={true}
                                            className="custom-header-css"
                                        />}
                                      {/*DATATABLE VISITAS*/}
                                    </Col>
                                  </Row>
                                </TabPane>
                              </TabContent>
                            </>)
                          }
                        </>)
                      }

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </>)
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
    </React.Fragment>
  );
};

export default withRouter(IndexAutorizaVisitantes);

IndexAutorizaVisitantes.propTypes = {
  history: PropTypes.object,
};