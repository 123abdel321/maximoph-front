import React, { useState, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Col,
  Container,
  Row,
  Button,
  Modal,
  Spinner
} from "reactstrap";

import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

// actions
import { getPqrsf } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

import withRouter from "components/Common/withRouter";

const IndexPQRSF = props => {

  //meta title
  document.title = "Listado de PQRSF | Maximo PH";

  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const [modalViewPqrsf, setModalViewPqrsf] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: null, CREAR: null, ACTUALIZAR: null, ELIMINAR: null});
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [data, setData] = useState([]);
  
  const loadPQRSF = ()=>{
    setLoadingText('Cargando ...');
    
    dispatch(getPqrsf(null, (pqrsf)=>{ 
      let newAccessModule = pqrsf;

      pqrsf.access.map(access=>newAccessModule[access.permiso] = (access.asignado==1?true:false));

      setAccessModule(newAccessModule);
      setData(pqrsf.data);
      
      setLoadingText('');

      if(props.onLoad) props.onLoad(pqrsf);
    }));
  };

  const viewPqrsf = (titulo, description, imagen)=>{
    let contentRaw = JSON.parse(description);
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));

    if(imagen){
      imagen = (process.env.REACT_API_URL||'http://localhost:3002')+"/uploads/pqrsf/"+imagen;
    }

    setModalViewPqrsf({titulo, descripcion: contentRaw, imagen});
  };

  const answerPqrsf = (pqrsf)=>{
    navigate('/utilidades/mensajes-masivos', {state: {pqrsf}})
  };

  const columns = useMemo(
      () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            return (<p className="text-center">
              <Button color={'info'}className="btn-sm" onClick={()=>viewPqrsf(row.asunto, row.descripcion, row.imagen)}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver PQRSF</span>
              </Button>
              {' '}
              <Button color={row.respuestas>0?'secondary':'primary'}className="btn-sm" onClick={()=>answerPqrsf(row)}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">{(row.respuestas>0?'Agregar respuesta':'Responder PQRSF')}</span>
              </Button>
            </p>);
          }
        },
        {
            Header: '# PQRSF',
            accessor: row => {
              return (<p className="text-center">{row.id}</p>);
            }
        },
        {
            Header: 'Respuestas',
            accessor: row => {
              if(Number(row.respuestas)){
                return (<p className="text-center">
                  <Button color={'info'}className="btn-info" onClick={()=>viewPqrsf(`ÚLTIMA RESPUESTA PQRSF #${row.id}`, row.ultima_respuesta, false)}>
                      <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                      <span className="el-desktop">Ver última respuesta ({row.respuestas})</span>
                  </Button>
                </p>);
              }else{
                return (<p className="text-center">{row.respuestas}</p>);
              }
            }
        },
        {
            Header: 'Inmueble',
            accessor: row => {
              return (`${row.tipoInmuebleText} ${row.inmuebleText}`);
            }
        },
        {
            Header: 'Persona',
            accessor: 'personaText'
        },
        {
            Header: 'Tipo',
            accessor: row => {
              let tipoPqrsf = '';
              switch(Number(row.tipo)){
                case 0: tipoPqrsf = 'Pregunta'; break;
                case 1: tipoPqrsf = 'Queja'; break;
                case 2: tipoPqrsf = 'Reclamo'; break;
                case 3: tipoPqrsf = 'Solicitud'; break;
                case 4: tipoPqrsf = 'Felicitación'; break;
              }
              return tipoPqrsf;
            }
        },
        {
            Header: 'Asunto',
            accessor: 'asunto',
        },
        {
            Header: 'Imágen',
            accessor: row => {
              return (row.imagen ? 'SI' : 'NO');
            }
        },
        {
            Header: 'Fecha',
            accessor: row => {
              return (<p className="text-center">{row.created_at}</p>);
            }
        }
      ],
      []
  );
  
  useEffect(()=>{
    loadPQRSF();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utilidades" breadcrumbItem="Listado de PQRSF recibidos" />
          
          {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR LOS PQRSF RECIBIDOS</b></p></Col></Row></Card>)}

          {
            accessModule.INGRESAR==true && !loadingText ?
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
                      loadingText=="Cargando ..." ?
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
      
      {/*MODAL VER PQRSF*/}
      <Modal
        isOpen={(modalViewPqrsf?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewPqrsf?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewPqrsf(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewPqrsf.descripcion }} />
        {(
            modalViewPqrsf.imagen ?
            (<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xxl rounded bg-light"
                alt={modalViewPqrsf.imagen}
                src={modalViewPqrsf.imagen}
              />
            </p>)
            :
            (<></>)
        )}
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewPqrsf(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER PQRSF*/}

    </React.Fragment>
  );
};

export default withRouter(IndexPQRSF);

IndexPQRSF.propTypes = {
  history: PropTypes.object,
};