import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Spinner,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getLogs } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexLogs = props => {

  //meta title
  document.title = "Logs | Maximo PH";

  const dispatch = useDispatch();
  
  const [dataLogs, setDataLogs] = useState([]);
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
    
  const columns = useMemo(
    () => [
        {
          Header: 'Tipo Operación',
          accessor: row => {
            let operations = {"CREATE":"CREAR","UPDATE":"ACTUALIZAR","DELETE":"ELIMINAR"};

            return (<p className="text-center"><b>{operations[row.tipo_operacion]}</b></p>);
          }
        },
        {
            Header: 'Fecha',
            accessor: row => {
              return (<p className="text-center"><b>{row.fecha}</b></p>);
            }
        },
        {
            Header: 'Descripción',
            accessor: 'descripcion',
        }
    ],
    []
  );

  const loadLogs = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getLogs(null, (resp)=>{
      setDataLogs(resp.data);

      let newAccessModule = accessModule;
      resp.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);
      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadLogs();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utilidades" breadcrumbItem="Logs" />
          
          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR LOGS</b></p></Col></Row></Card>)}

          {
            accessModule.INGRESAR==true && !loadingText ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={dataLogs}
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
                      loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando tipo vehiculo..." ?
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
    </React.Fragment>
  );
};

export default withRouter(IndexLogs);

IndexLogs.propTypes = {
  history: PropTypes.object,
};