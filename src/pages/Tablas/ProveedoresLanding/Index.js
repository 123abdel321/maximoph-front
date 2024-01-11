import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  Input,
  CardBody
} from "reactstrap";


// Notifications
import "toastr/build/toastr.min.css";

// actions
import { getProviders } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const Proveedores = props => {

  //meta title
  document.title = "Proveedores | Maximo PH";

  const dispatch = useDispatch();

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [searchProvider, setSearchProvider] = useState('');
  const [dataProvidersCustom, setDataProvidersCustom] = useState([]);

  const { dataProviders } = useSelector(state => ({
    dataProviders: state.Providers.providers
  }));

  const loadProveedores = ()=>{
    setLoadingText('Cargando ...');
    
    dispatch(getProviders(null, (response)=>{ 
      setDataProvidersCustom(response.data);
      setLoadingText('');
    }));
  };

  const searchProviderFn = (val)=>{
    let newDataProviders = [];

    dataProviders.map(provider=>{
      if(provider.nombre_negocio.indexOf(val)>=0||provider.actividadProveedor.indexOf(val)>=0||provider.observacion.indexOf(val)>=0||provider.direccionProveedor.indexOf(val)>=0){
        newDataProviders.push(provider);
      }
    });

    
    setSearchProvider(val);
    setDataProvidersCustom(newDataProviders);
  };

  useEffect(()=>{
    loadProveedores();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row className="g-3">
              <Col xxl={10} lg={10}>
                  <div className="position-relative">
                      <Input type="text" className="form-control" value={searchProvider} onChange={search=>searchProviderFn(search.target.value)} placeholder="Encuentra tu proveedor" />
                  </div>
              </Col>

              <Col xxl={2} lg={2}>
                  <div className="position-relative h-100 hstack gap-3">
                      <button type="submit" className="btn btn-primary h-100 w-100"><i className="bx bx-search-alt align-middle"></i> Busca Proveedor</button>
                  </div>
              </Col>
          </Row>
          <br />
          <Row>
            {dataProvidersCustom.map((provider,index)=>(
              <Col xl={4}  key={index}>
                <Card>
                  <CardBody>
                    <div className="d-flex py-3">
                      <div className="avatar-xs me-3">
                        <div className="avatar-title rounded-circle bg-light text-primary">
                          <i className="bx bxs-user"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="font-size-14 mb-1">
                          {provider.nombre_negocio}<br />
                          <small className="text-muted">{provider.actividadProveedor}</small>
                        </h5>
                        <hr />
                        <h5 className="font-size-16 mb-1">
                          <small className="text-muted"><b>Dirección:</b> {provider.direccionProveedor}</small><br />
                          <small className="text-muted">
                            <b>Teléfonos:</b> {provider.telefonoProveedor} / {provider.celularProveedor}
                          </small>
                        </h5>
                        <hr />
                        <p className="text-muted">{provider.observacion}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(Proveedores);

Proveedores.propTypes = {
  history: PropTypes.object,
};