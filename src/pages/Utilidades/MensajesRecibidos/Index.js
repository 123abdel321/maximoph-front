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
import { getReceiveMessages, putMassiveMessage } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexMensajesRecibidos = props => {

  //meta title
  document.title = "Mensajes Recibidos | Maximo PH";

  const dispatch = useDispatch();
  
  const [modalViewMessage, setModalViewMessage] = useState(false);
      
  const [loadingText, setLoadingText] = useState('Cargando ...');
  
  const [data, setData] = useState([]);
  
  const loadMensajesRecibidos = ()=>{
    setLoadingText('Cargando ...');
          
    dispatch(getReceiveMessages(null, (receiveMessages)=>{

      setData(receiveMessages.data);
      
      setLoadingText('');

      if(props.onLoad) props.onLoad(receiveMessages);
    }));    
  };

  const viewMessage = (title, description, message, image)=>{
    let contentRaw = JSON.parse(description);
        contentRaw = convertFromRaw(contentRaw);
        contentRaw = EditorState.createWithContent(contentRaw);
        contentRaw = draftToHtml(convertToRaw(contentRaw.getCurrentContent()));
    
    if(message.read_at==null&&message.id_persona) dispatch(putMassiveMessage(message.id, ()=>{ loadMensajesRecibidos(); }));

    setModalViewMessage({titulo: title, descripcion: contentRaw, image});
  };

  const columns = useMemo(
      () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: row => {
            const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/messages/"+row.imagen;
            row.IMAGE_URL = IMAGE_URL;
            return (<p className="text-center">
              <Button color={'info'}className="btn-sm" onClick={()=>viewMessage(row.titulo, row.descripcion, row, IMAGE_URL)}>
                  <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                  <span className="el-desktop">Ver Mensaje</span>
              </Button>
            </p>);
          }
        },
        {
          Header: 'Imágen mensaje',
            accessor: row =>{
              const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/messages/"+row.imagen;
              row.IMAGE_URL = IMAGE_URL;
              if(row.imagen){
                return (<p className="text-center" style={{cursor: 'pointer'}} onClick={()=>viewMessage(row.titulo, row.descripcion, row, IMAGE_URL)}>
                  <img
                    data-dz-thumbnail=""
                    className="avatar-md rounded bg-light"
                    src={IMAGE_URL}
                  />
                </p>);
              }else{
                return (<></>);
              }
            }
        },
        {
            Header: 'Zona',
            accessor: 'zona',
        },
        {
            Header: 'Rol Persona',
            accessor: 'rol',
        },
        {
            Header: 'Mensaje Push',
            accessor: (row)=>{
              return (Number(row.notificacion_push)?'SI':'NO')
            },
        },
        {
            Header: 'Inquilino/Propietario',
            accessor: 'persona',
        },
        {
            Header: 'Título',
            accessor: 'titulo',
        },
        {
            Header: 'Fecha',
            accessor: row => {
              return (<p className="text-center">{row.created_at}</p>);
            }
        },
        {
            Header: 'Leido',
            accessor: row => {
              return (<p className="text-center">{row.read_at}</p>);
            }
        }
      ],
      []
  );
  
  useEffect(()=>{
    loadMensajesRecibidos();
  },[]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs title="Utilidades" breadcrumbItem="Mensajes Recibidos" />
          
          {
            !loadingText ?
            (
              <div className="" style={{borderRadius: 18, backgroundColor: '#FFFFFF', padding: 10}}>
                <TableContainer
                  columns={columns}
                  data={data}
                  isGlobalFilter={true}
                  isAddOptions={false}
                  customPageSize={10}
                  customPageSizeOptions={true}
                  className="custom-header-css"
                />
              </div>
            )
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
      
      {/*MODAL VER MENSAJE*/}
      <Modal
        isOpen={(modalViewMessage?true:false)}
        backdrop={'static'}
        size={'lg'}
      >
        <div className="modal-header system">
          <h5 className="modal-title" id="staticBackdropLabel">{modalViewMessage?.titulo}</h5>
          <button type="button" className="btn-close"
            onClick={()=>setModalViewMessage(false)} aria-label="Close"></button>
        </div>
        <div className="modal-body" dangerouslySetInnerHTML={{ __html: modalViewMessage.descripcion }} />
        <div className="modal-body text-center">
          <img
            data-dz-thumbnail=""
            className="avatar-xxl rounded bg-light"
            src={modalViewMessage.image}
          />
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-light" onClick={()=>setModalViewMessage(false)}>CERRAR</button>
        </div>
      </Modal>
      {/*MODAL VER MENSAJE*/}

    </React.Fragment>
  );
};

export default withRouter(IndexMensajesRecibidos);

IndexMensajesRecibidos.propTypes = {
  history: PropTypes.object,
};