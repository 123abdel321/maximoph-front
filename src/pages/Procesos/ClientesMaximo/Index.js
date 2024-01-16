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
  Spinner,
  CardTitle,
  DropdownMenu,
  ButtonDropdown,
  FormFeedback,
  DropdownItem,
  DropdownToggle
} from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import Select from "react-select";

//Import Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import TableContainer from '../../../components/Common/TableContainer';

import ModalConfirmAction from '../../../components/Maximo/ModalConfirmAction';

// Notifications
import toastr from "toastr";
import "toastr/build/toastr.min.css";

// actions
import { getCustomersM, createCustomer, editCustomer, deletePerson } from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const IndexClientesMaximo = props => {

  //meta title
  document.title = "Clientes | Maximo PH";

  const dispatch = useDispatch();

  const initialValuesCustomerForm = {
    'cliente-numero-documento': '',
    'cliente-razon-social': '',
    'cliente-nombres': '',
    'cliente-telefono': '',
    'cliente-direccion': '',
    'cliente-telefono': '',
    'cliente-correo': '',
    'cliente-numero-unidades': '',
    'cliente-numero-documentos': '',
    'cliente-descripcion': '',
    'cliente-valor-suscripcion-mensual': '',
  };

  toastr.options = {
    positionClass: 'toast-bottom-right',
    timeOut: 5000,
    extendedTimeOut: 1000,
    progressBar: true,
    newestOnTop: true
  };

  const [loadingText, setLoadingText] = useState('Cargando ...');
  const [dataCustomers, setDataCustomers] = useState([]);

  const [companyLogo, setCompanyLogo] = useState(null);

  const [ciudad, setCiudad] = useState();
  const [estado, setEstado] = useState({ label: "ACTIVO", value: "1" });
  const [tipoUnidad, setTipoUnidad] = useState({ label: "APARTAMENTOS", value: "1" });
  const [tipoDocumento, setTipoDocumento] = useState({ label: "NIT", value: "1" });

  const [editCustomerId, setEditCustomer] = useState(false);
  
  const [confirmEliminarPersona, setConfirmEliminarPersona] = useState(false);
  const [confirmModalEliminarPersona, setConfirmModalEliminarPersona] = useState(false);

  const [accessModule, setAccessModule] = useState({INGRESAR: true, CREAR: true, ACTUALIZAR: true, ELIMINAR: true});
  
  const [errorSyncPersona, setErrorSyncPersona] = useState(false);
  const [confirmSyncPersona, setConfirmSyncPersona] = useState(false);
  const [errorSavePersona, setErrorSavePersona] = useState(false);
  const [errorModalSavePersona, setErrorModalSavePersona] = useState(false);
  const [readyModalSyncPersona, setReadyModalSyncPersona] = useState(false);
  const [errorModalSyncPersona, setErrorModalSyncPersona] = useState(false);
  const [confirmModalSyncPersona, setConfirmModalSyncPersona] = useState(false);

  const editCustomerFn = async (customer)=>{
    if(accessModule.ACTUALIZAR==true){
      let fieldName = '';
      let fieldValue = '';
      let editCustomerObj = {};

      Object.entries(customer).map((field)=>{
        if(field[0]!="label"&&field[0]!="value"&&field[0]!="ciudadLabel"){
          fieldValue = field[1];
          
          if(field[0]=="fecha_nacimiento"){
            fieldValue = new Date(fieldValue).toISOString().split('T')[0];;
          }
          
          fieldName = field[0].replaceAll('_','-');
          fieldName = `cliente-${fieldName}`;
          
          if(fieldName=="valor-suscripcion-mensual"){
            fieldValue = Number(fieldValue.replaceAll(".","")).toLocaleString('es-ES');
          }

          editCustomerObj[fieldName] = fieldValue;
          
          fieldName = '';
          fieldValue = '';
        }
      });

      if(customer.logo){
        const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com/')+"/uploads/company-logo/"+customer.logo;
        const response = await fetch(IMAGE_URL);
        const blob = await response.blob();
        const fileType = blob.type;
        const file = new File([blob], customer.logo, { type: fileType });

        addLogoCompany(file);
      }


      setEditCustomer(Number(customer.id));

      setTipoDocumento({value: customer.tipo_documento, label: (customer.tipo_documento==1?'NIT':'CÉDULA') });

      let estadoText = '';
      switch(customer.estado){
        case 1: estadoText = "ACTIVO"; break;
        case 0: estadoText = "ELIMINADO"; break;
        case 2: estadoText = "MOROSO"; break;
        case 3: estadoText = "INACTIVO"; break;
     }

      setEstado({value: customer.estado, label: estadoText });

      let tipoUnidadText = '';
      switch(customer.tipo_unidad){
        case 1: tipoUnidadText = "APARTAMENTOS"; break;
        case 0: tipoUnidadText = "CASAS"; break;
        case 2: tipoUnidadText = "OFICINAS"; break;
        case 3: tipoUnidadText = "BODEGAS"; break;
        case 4: tipoUnidadText = "LOCALES COMERCIALES"; break;
     }

      setTipoUnidad({value: customer.tipo_unidad, label: tipoUnidadText });
      setCiudad({value: customer.ciudad, label: customer.ciudad });

      setLoadingText('hidden')
      
      validation.setValues(editCustomerObj);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a editar un cliente", "Permisos");
    }
  };

  const deletePersonModal = (person)=>{
    if(accessModule.ELIMINAR==true){
      setConfirmEliminarPersona(person);
      setConfirmModalEliminarPersona(true);
    }else{
      toastr.options = { positionClass: 'toast-top-right' };
      toastr.warning("No tienes acceso a eliminar un cliente", "Permisos");
    }
  };
  
  const deletePersonConfirm = ()=>{
    cancelCustomer();
    setConfirmEliminarPersona(false);
    setConfirmModalEliminarPersona(false);
    

    setLoadingText('Eliminando persona...')

    dispatch(deletePerson(confirmEliminarPersona.id, ()=>{
      cancelCustomer();
      loadCustomers();
      toastr.success("Persona eliminada.", "Operación Ejecutada");
    }));
  };

  // Form validation 
  const validation = useFormik({
    enableReinitialize: true,
    initialValues: initialValuesCustomerForm,
    validationSchema: Yup.object({
      'cliente-numero-documento': Yup.string().required("Por favor ingresa el número de documento"),
      'cliente-nombres': Yup.string().required("Por favor ingresa el nombre"),
      'cliente-direccion': Yup.string().required("Por favor ingresa la dirección"),
      'cliente-telefono': Yup.string().required("Por favor ingresa el celular"),
      'cliente-correo': Yup.string().required("Por favor ingresa el correo"),
      'cliente-numero-unidades': Yup.string().required("Por favor ingresa el número de unidades"),
      'cliente-numero-documentos': Yup.string().required("Por favor ingresa el número de documentos"),
      'cliente-valor-suscripcion-mensual': Yup.string().required("Por favor ingresa el valor de la mensualidad")
    }),
    onSubmit: (values) => {
      
      const customerValues = new FormData();

      let fieldName = '';
      let fieldValue = '';
      let numeroDocumento = '';

      Object.entries(values).map((field)=>{
        fieldValue = field[1];
        fieldName = field[0].replace('cliente-','');
        fieldName = fieldName.replaceAll('-','_');
        
        if(["operaciones","tipo_documento","ciudad","tipo_unidad","estado"].includes(fieldName)===false){
          if(fieldName=="valor_suscripcion_mensual"){
            customerValues.append(fieldName,fieldValue.replaceAll(".","").replaceAll(",",""));
          }else if(fieldName=='numero_documento'){ 
            const caracteresEspeciales = /[^a-zA-Z0-9]/g;
            numeroDocumento = fieldValue.split("-")[0].replace(caracteresEspeciales, '');
  
            customerValues.append("numero_documento",numeroDocumento);
          }else{
            customerValues.append(fieldName,fieldValue);
          }
        }

        fieldName = '';
        fieldValue = '';
      });
      
      if(!tipoDocumento){
        toastr.error("Seleccione el tipo de documento", "Error de validación");
        return;
      }
  
      if(!ciudad){
        toastr.error("Seleccione la ciudad", "Error de validación");
        return;
      }

      if(!estado){
        toastr.error("Seleccione el estado", "Error de validación");
        return;
      }

      if(!tipoUnidad){
        toastr.error("Seleccione el tipo de unidad", "Error de validación");
        return;
      }

      customerValues.append("password", numeroDocumento);
      customerValues.append('image', companyLogo);
      customerValues.append('tipo_image', companyLogo?.type);
      customerValues.append("ciudad", ciudad.value);
      customerValues.append("estado", estado.value);
      customerValues.append("tipo_unidad", tipoUnidad.value);
      customerValues.append("tipo_documento", tipoDocumento.value);
      
      setLoadingText("Guardando ...");
      
      if(!editCustomerId){
        dispatch(createCustomer(customerValues, (response)=>{
          if(response.success){
            cancelCustomer();
            loadCustomers();
            toastr.success("Nuevo cliente registrado.", "Operación Ejecutada");
          }else{
            setLoadingText('hidden');
            toastr.error((response.error?response.error:'Contacte al equipo de soporte Máximo PH'), "Error en la operación");
          }
        }));
      }else{
        dispatch(editCustomer(customerValues, (response)=>{
          if(response.success){
            cancelCustomer();
            loadCustomers();
            toastr.success("Cliente editado.", "Operación Ejecutada");
          }else{
            setLoadingText('hidden');
            toastr.error((response.error?response.error:'Contacte al equipo de soporte Máximo PH'), "Error en la operación",);
          }
        }));
      }
    }
  });

  const cancelCustomer = ()=>{
    setEstado({ label: "ACTIVO", value: "1" });
    setTipoUnidad({ label: "APARTAMENTOS", value: "1" });
    setTipoDocumento({ label: "NIT", value: "1" });
    setCiudad(null);

    setEditCustomer(false);
    setLoadingText(false);
    validation.handleReset();
  };

  const columns = useMemo(
    () => [
        {
          sticky: true,
          Header: 'Operaciones',
          accessor: customer => {
            let classEditBtn = accessModule.ACTUALIZAR==true ? "primary" : "secondary";
            let classDeleteBtn = accessModule.ELIMINAR==true ? "danger" : "secondary";

            return (<p className="text-center">
              <Button color={classEditBtn} className="btn-sm" onClick={()=>{editCustomerFn(customer)}}>
                <i className="bx bx-pencil font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Editar</span>
              </Button>
            </p>);
            
            /*<Button color={classDeleteBtn} className="btn btn-sm" onClick={()=>{deletePersonModal(person)}}> 
                <i className="bx bxs-trash font-size-14 align-middle el-mobile"></i>
                <span className="el-desktop">Eliminar</span>
              </Button>*/
          }
        },
        {
          Header: 'Logo',
          accessor: row =>{
            const IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com/')+"/uploads/company-logo/"+row.logo;
            if(row.logo){
              return (<p className="text-center">
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
            Header: 'Tipo Documento',
            accessor: row => (<p className="text-center">{Number(row.tipo_documento)==1?"NIT":"CÉDULA"}</p>)
        },
        {
            Header: 'Número Documento',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{Number(row.numero_documento).toLocaleString()}</p>)
        },
        {
            Header: 'Razón Social',
            accessor: 'razon_social',
        },
        {
            Header: 'Nombre',
            accessor: 'nombres',
        },
        {
            Header: 'Ciudad',
            accessor: 'ciudad',
        },
        {
            Header: 'Dirección',
            accessor: 'direccion',
        },
        {
            Header: 'Celular',
            accessor: 'telefono'
        },
        {
            Header: 'E-mail',
            accessor: 'correo'
        },
        {
            Header: 'Estado',
            accessor: customer => {
              let estadoText = '';

              switch(customer.estado){
                  case 1: estadoText = "ACTIVO"; break;
                  case 0: estadoText = "ELIMINADO"; break;
                  case 2: estadoText = "MOROSO"; break;
                  case 3: estadoText = "INACTIVO"; break;
              }
  
              return (<p className="text-center">{estadoText}</p>)
            }
        },
        {
            Header: 'Tipo Unidad',
            accessor: customer => {
              let tipoUnidad = "";

              switch(customer.tipo_unidad){
                 case 1: tipoUnidad = "APARTAMENTOS"; break;
                 case 0: tipoUnidad = "CASAS"; break;
                 case 2: tipoUnidad = "OFICINAS"; break;
                 case 3: tipoUnidad = "BODEGAS"; break;
                 case 4: tipoUnidad = "LOCALES COMERCIALES"; break;
              }
  
              return (<p className="text-center">{tipoUnidad}</p>)
            }
        },
        {
            Header: 'Número de Unidades',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{Number(row.numero_unidades).toLocaleString()}</p>)
        },
        {
            Header: 'Número de Documentos Mensuales',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{Number(row.numero_documentos).toLocaleString()}</p>)
        },
        {
            Header: 'Mensualidad',
            HeaderClass: 'text-end',
            accessor: row => (<p className="text-end">{Number(row.valor_suscripcion_mensual).toLocaleString()}</p>)
        }
    ],
    []
  );

  const loadCustomers = ()=>{
    setLoadingText('Cargando ...');

    dispatch(getCustomersM(null, (dataCustomers)=>{ 
      setDataCustomers(dataCustomers.data);
      setLoadingText('');
    }));
  };

  useEffect(()=>{
    loadCustomers();
  },[]);

  const addLogoCompany = (image)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      setCompanyLogo(image);
    }else{
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };

  if(JSON.parse(localStorage.getItem("authUser")).id_rol==26){
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid={true}>
            <Breadcrumbs title="Procesos" breadcrumbItem="Clientes Máximo P.H" />
            {
            accessModule.CREAR==true &&
              (<Row>
                <Col xl={12}>
                  <Card>
                    <CardBody>
                      <CardTitle className="h5 mb-4">{editCustomerId==false ? 'Nuevo Cliente' : 'Editando Cliente'}</CardTitle>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          
                          validation.submitForm();

                          return false;
                        }}>

                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Tipo Documento</label>
                            <div className="col-md-12">
                              <Select
                                value={tipoDocumento}
                                onChange={value=>setTipoDocumento(value)}
                                options={[
                                  { label: "NIT", value: "1" },
                                  { label: "CÉDULA", value: "0" }
                                ]}
                                className="select2-selection"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Número Documento *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-numero-documento"
                                value={validation.values['cliente-numero-documento'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched['cliente-numero-documento'] && validation.errors['cliente-numero-documento'] && !validation.values['cliente-numero-documento'] ? true : false
                                }
                              />
                              {validation.touched['cliente-numero-documento'] && validation.errors['cliente-numero-documento'] && !validation.values['cliente-numero-documento'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-numero-documento']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Razon Social</label>
                            <div className="col-md-12">
                              <input
                                type="text"
                                className="form-control"
                                name="cliente-razon-social"
                                value={validation.values['cliente-razon-social'] || ""}
                                onChange={validation.handleChange}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Nombre *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-nombres"
                                value={validation.values['cliente-nombres'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched['cliente-nombres'] && validation.errors['cliente-nombres'] && !validation.values['cliente-nombres'] ? true : false
                                }
                              />
                              {validation.touched['cliente-nombres'] && validation.errors['cliente-nombres'] && !validation.values['cliente-nombres'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-nombres']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Ciudad *</label>
                            <div className="col-md-12">
                              <Select
                                value={ciudad}
                                onChange={value=>setCiudad(value)}
                                options={[
                                  { label: '002 - ABEJORRAL', value: '002 - ABEJORRAL'},
                                  { label: '004 - ABRIAQUÍ', value: '004 - ABRIAQUÍ'},
                                  { label: '021 - ALEJANDRÍA', value: '021 - ALEJANDRÍA'},
                                  { label: '030 - AMAGÁ', value: '030 - AMAGÁ'},
                                  { label: '031 - AMALFI', value: '031 - AMALFI'},
                                  { label: '034 - ANDES', value: '034 - ANDES'},
                                  { label: '036 - ANGELÓPOLIS', value: '036 - ANGELÓPOLIS'},
                                  { label: '038 - ANGOSTURA', value: '038 - ANGOSTURA'},
                                  { label: '040 - ANORÍ', value: '040 - ANORÍ'},
                                  { label: '044 - ANZA', value: '044 - ANZA'},
                                  { label: '045 - APARTADÓ', value: '045 - APARTADÓ'},
                                  { label: '051 - ARBOLETES', value: '051 - ARBOLETES'},
                                  { label: '055 - ARGELIA', value: '055 - ARGELIA'},
                                  { label: '059 - ARMENIA', value: '059 - ARMENIA'},
                                  { label: '079 - BARBOSA', value: '079 - BARBOSA'},
                                  { label: '088 - BELLO', value: '088 - BELLO'},
                                  { label: '086 - BELMIRA', value: '086 - BELMIRA'},
                                  { label: '091 - BETANIA', value: '091 - BETANIA'},
                                  { label: '093 - BETULIA', value: '093 - BETULIA'},
                                  { label: '107 - BRICEÑO', value: '107 - BRICEÑO'},
                                  { label: '113 - BURITICÁ', value: '113 - BURITICÁ'},
                                  { label: '120 - CÁCERES', value: '120 - CÁCERES'},
                                  { label: '125 - CAICEDO', value: '125 - CAICEDO'},
                                  { label: '129 - CALDAS', value: '129 - CALDAS'},
                                  { label: '134 - CAMPAMENTO', value: '134 - CAMPAMENTO'},
                                  { label: '138 - CAÑASGORDAS', value: '138 - CAÑASGORDAS'},
                                  { label: '142 - CARACOLÍ', value: '142 - CARACOLÍ'},
                                  { label: '145 - CARAMANTA', value: '145 - CARAMANTA'},
                                  { label: '147 - CAREPA', value: '147 - CAREPA'},
                                  { label: '150 - CAROLINA', value: '150 - CAROLINA'},
                                  { label: '154 - CAUCASIA', value: '154 - CAUCASIA'},
                                  { label: '172 - CHIGORODÓ', value: '172 - CHIGORODÓ'},
                                  { label: '190 - CISNEROS', value: '190 - CISNEROS'},
                                  { label: '101 - CIUDAD BOLÍVAR', value: '101 - CIUDAD BOLÍVAR'},
                                  { label: '197 - COCORNÁ', value: '197 - COCORNÁ'},
                                  { label: '206 - CONCEPCIÓN', value: '206 - CONCEPCIÓN'},
                                  { label: '209 - CONCORDIA', value: '209 - CONCORDIA'},
                                  { label: '212 - COPACABANA', value: '212 - COPACABANA'},
                                  { label: '234 - DABEIBA', value: '234 - DABEIBA'},
                                  { label: '237 - DON MATÍAS', value: '237 - DON MATÍAS'},
                                  { label: '240 - EBÉJICO', value: '240 - EBÉJICO'},
                                  { label: '250 - EL BAGRE', value: '250 - EL BAGRE'},
                                  { label: '148 - EL CARMEN DE VIBORAL', value: '148 - EL CARMEN DE VIBORAL'},
                                  { label: '697 - EL SANTUARIO', value: '697 - EL SANTUARIO'},
                                  { label: '264 - ENTRERRIOS', value: '264 - ENTRERRIOS'},
                                  { label: '266 - ENVIGADO', value: '266 - ENVIGADO'},
                                  { label: '282 - FREDONIA', value: '282 - FREDONIA'},
                                  { label: '284 - FRONTINO', value: '284 - FRONTINO'},
                                  { label: '306 - GIRALDO', value: '306 - GIRALDO'},
                                  { label: '308 - GIRARDOTA', value: '308 - GIRARDOTA'},
                                  { label: '310 - GÓMEZ PLATA', value: '310 - GÓMEZ PLATA'},
                                  { label: '313 - GRANADA', value: '313 - GRANADA'},
                                  { label: '315 - GUADALUPE', value: '315 - GUADALUPE'},
                                  { label: '318 - GUARNE', value: '318 - GUARNE'},
                                  { label: '321 - GUATAPE', value: '321 - GUATAPE'},
                                  { label: '347 - HELICONIA', value: '347 - HELICONIA'},
                                  { label: '353 - HISPANIA', value: '353 - HISPANIA'},
                                  { label: '360 - ITAGUI', value: '360 - ITAGUI'},
                                  { label: '361 - ITUANGO', value: '361 - ITUANGO'},
                                  { label: '364 - JARDÍN', value: '364 - JARDÍN'},
                                  { label: '368 - JERICÓ', value: '368 - JERICÓ'},
                                  { label: '376 - LA CEJA', value: '376 - LA CEJA'},
                                  { label: '380 - LA ESTRELLA', value: '380 - LA ESTRELLA'},
                                  { label: '390 - LA PINTADA', value: '390 - LA PINTADA'},
                                  { label: '400 - LA UNIÓN', value: '400 - LA UNIÓN'},
                                  { label: '411 - LIBORINA', value: '411 - LIBORINA'},
                                  { label: '425 - MACEO', value: '425 - MACEO'},
                                  { label: '440 - MARINILLA', value: '440 - MARINILLA'},
                                  { label: '001 - MEDELLÍN', value: '001 - MEDELLÍN'},
                                  { label: '467 - MONTEBELLO', value: '467 - MONTEBELLO'},
                                  { label: '475 - MURINDÓ', value: '475 - MURINDÓ'},
                                  { label: '480 - MUTATÁ', value: '480 - MUTATÁ'},
                                  { label: '483 - NARIÑO', value: '483 - NARIÑO'},
                                  { label: '495 - NECHÍ', value: '495 - NECHÍ'},
                                  { label: '490 - NECOCLÍ', value: '490 - NECOCLÍ'},
                                  { label: '501 - OLAYA', value: '501 - OLAYA'},
                                  { label: '541 - PEÑOL', value: '541 - PEÑOL'},
                                  { label: '543 - PEQUE', value: '543 - PEQUE'},
                                  { label: '576 - PUEBLORRICO', value: '576 - PUEBLORRICO'},
                                  { label: '579 - PUERTO BERRÍO', value: '579 - PUERTO BERRÍO'},
                                  { label: '585 - PUERTO NARE', value: '585 - PUERTO NARE'},
                                  { label: '591 - PUERTO TRIUNFO', value: '591 - PUERTO TRIUNFO'},
                                  { label: '604 - REMEDIOS', value: '604 - REMEDIOS'},
                                  { label: '607 - RETIRO', value: '607 - RETIRO'},
                                  { label: '615 - RIONEGRO', value: '615 - RIONEGRO'},
                                  { label: '628 - SABANALARGA', value: '628 - SABANALARGA'},
                                  { label: '631 - SABANETA', value: '631 - SABANETA'},
                                  { label: '642 - SALGAR', value: '642 - SALGAR'},
                                  { label: '647 - SAN ANDRÉS', value: '647 - SAN ANDRÉS'},
                                  { label: '649 - SAN CARLOS', value: '649 - SAN CARLOS'},
                                  { label: '652 - SAN FRANCISCO', value: '652 - SAN FRANCISCO'},
                                  { label: '656 - SAN JERÓNIMO', value: '656 - SAN JERÓNIMO'},
                                  { label: '658 - SAN JOSÉ DE LA MONTAÑA', value: '658 - SAN JOSÉ DE LA MONTAÑA'},
                                  { label: '659 - SAN JUAN DE URABÁ', value: '659 - SAN JUAN DE URABÁ'},
                                  { label: '660 - SAN LUIS', value: '660 - SAN LUIS'},
                                  { label: '664 - SAN PEDRO', value: '664 - SAN PEDRO'},
                                  { label: '665 - SAN PEDRO DE URABA', value: '665 - SAN PEDRO DE URABA'},
                                  { label: '667 - SAN RAFAEL', value: '667 - SAN RAFAEL'},
                                  { label: '670 - SAN ROQUE', value: '670 - SAN ROQUE'},
                                  { label: '674 - SAN VICENTE', value: '674 - SAN VICENTE'},
                                  { label: '679 - SANTA BÁRBARA', value: '679 - SANTA BÁRBARA'},
                                  { label: '686 - SANTA ROSA DE OSOS', value: '686 - SANTA ROSA DE OSOS'},
                                  { label: '042 - SANTAFÉ DE ANTIOQUIA', value: '042 - SANTAFÉ DE ANTIOQUIA'},
                                  { label: '690 - SANTO DOMINGO', value: '690 - SANTO DOMINGO'},
                                  { label: '736 - SEGOVIA', value: '736 - SEGOVIA'},
                                  { label: '756 - SONSON', value: '756 - SONSON'},
                                  { label: '761 - SOPETRÁN', value: '761 - SOPETRÁN'},
                                  { label: '789 - TÁMESIS', value: '789 - TÁMESIS'},
                                  { label: '790 - TARAZÁ', value: '790 - TARAZÁ'},
                                  { label: '792 - TARSO', value: '792 - TARSO'},
                                  { label: '809 - TITIRIBÍ', value: '809 - TITIRIBÍ'},
                                  { label: '819 - TOLEDO', value: '819 - TOLEDO'},
                                  { label: '837 - TURBO', value: '837 - TURBO'},
                                  { label: '842 - URAMITA', value: '842 - URAMITA'},
                                  { label: '847 - URRAO', value: '847 - URRAO'},
                                  { label: '854 - VALDIVIA', value: '854 - VALDIVIA'},
                                  { label: '856 - VALPARAÍSO', value: '856 - VALPARAÍSO'},
                                  { label: '858 - VEGACHÍ', value: '858 - VEGACHÍ'},
                                  { label: '861 - VENECIA', value: '861 - VENECIA'},
                                  { label: '873 - VIGÍA DEL FUERTE', value: '873 - VIGÍA DEL FUERTE'},
                                  { label: '885 - YALÍ', value: '885 - YALÍ'},
                                  { label: '887 - YARUMAL', value: '887 - YARUMAL'},
                                  { label: '890 - YOLOMBÓ', value: '890 - YOLOMBÓ'},
                                  { label: '893 - YONDÓ', value: '893 - YONDÓ'},
                                  { label: '895 - ZARAGOZA', value: '895 - ZARAGOZA'}
                                ]}
                                className="select2-selection"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Dirección *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-direccion"
                                value={validation.values['cliente-direccion'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched['cliente-direccion'] && validation.errors['cliente-direccion'] && !validation.values['cliente-direccion'] ? true : false
                                }
                              />
                              {validation.touched['cliente-direccion'] && validation.errors['cliente-direccion'] && !validation.values['cliente-direccion'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-direccion']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Celular *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-telefono"
                                value={validation.values['cliente-telefono'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched['cliente-telefono'] && validation.errors['cliente-telefono'] && !validation.values['cliente-telefono'] ? true : false
                                }
                              />
                              {validation.touched['cliente-telefono'] && validation.errors['cliente-telefono'] && !validation.values['cliente-telefono'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-telefono']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Correo Electrónico *</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-correo"
                                value={validation.values['cliente-correo'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                invalid={
                                    validation.touched['cliente-correo'] && validation.errors['cliente-correo'] && !validation.values['cliente-correo'] ? true : false
                                }
                              />
                              {validation.touched['cliente-correo'] && validation.errors['cliente-correo'] && !validation.values['cliente-correo'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-correo']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Estado *</label>
                            <div className="col-md-12">
                              <Select
                                value={estado}
                                onChange={value=>setEstado(value)}
                                options={[
                                  { label: "ACTIVO", value: "1" },
                                  { label: "EN MORA", value: "2" },
                                  { label: "INACTIVO", value: "3" }
                                ]}
                                className="select2-selection"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Tipo Unidad *</label>
                            <div className="col-md-12">
                              <Select
                                value={tipoUnidad}
                                onChange={value=>setTipoUnidad(value)}
                                options={[
                                  { label: "APARTAMENTOS", value: "1" },
                                  { label: "CASAS", value: "0" },
                                  { label: "OFICINAS", value: "2" },
                                  { label: "BODEGAS", value: "3" },
                                  { label: "LOCALES COMERCIALES", value: "4" }
                                ]}
                                className="select2-selection"
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Número Unidades *</label>
                            <div className="col-md-12">
                              <Input
                                  type="number"
                                  className="form-control"
                                  min={0}
                                  name="cliente-numero-unidades"
                                  value={validation.values['cliente-numero-unidades'] || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                      validation.touched['cliente-numero-unidades'] && validation.errors['cliente-numero-unidades'] && !validation.values['cliente-numero-unidades'] ? true : false
                                  }
                              />
                              {validation.touched['cliente-numero-unidades'] && validation.errors['cliente-numero-unidades'] && !validation.values['cliente-numero-unidades'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-numero-unidades']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Número Documentos *</label>
                            <div className="col-md-12">
                              <Input
                                  type="number"
                                  className="form-control"
                                  min={0}
                                  name="cliente-numero-documentos"
                                  value={validation.values['cliente-numero-documentos'] || ""}
                                  onChange={validation.handleChange}
                                  onBlur={validation.handleBlur}
                                  invalid={
                                      validation.touched['cliente-numero-documentos'] && validation.errors['cliente-numero-documentos'] && !validation.values['cliente-numero-documentos'] ? true : false
                                  }
                              />
                              {validation.touched['cliente-numero-documentos'] && validation.errors['cliente-numero-documentos'] && !validation.values['cliente-numero-documentos'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-numero-documentos']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={3}>
                            <label className="col-md-12 col-form-label">Valor Mensualidad *</label>
                            <div className="col-md-12">
                              <Input
                                  type="text"
                                  className="form-control"
                                  min={0}
                                  name="cliente-valor-suscripcion-mensual"
                                  value={validation.values['cliente-valor-suscripcion-mensual'] || ""}
                                  onBlur={validation.handleBlur}
                                  onChange={(e)=>{
                                    let val = Number(e.target.value.replaceAll(".","")).toLocaleString('es-ES');
                                    validation.setFieldValue("cliente-valor-suscripcion-mensual", val);
                                  }}
                                  invalid={
                                      validation.touched['cliente-valor-suscripcion-mensual'] && validation.errors['cliente-valor-suscripcion-mensual'] && !validation.values['cliente-valor-suscripcion-mensual'] ? true : false
                                  }
                              />
                              {validation.touched['cliente-valor-suscripcion-mensual'] && validation.errors['cliente-valor-suscripcion-mensual'] && !validation.values['cliente-valor-suscripcion-mensual'] ? (
                              <FormFeedback type="invalid">{validation.errors['cliente-valor-suscripcion-mensual']}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col md={6}>
                            <label className="col-md-12 col-form-label">Descripción</label>
                            <div className="col-md-12">
                              <Input
                                type="text"
                                className="form-control"
                                name="cliente-descripcion"
                                value={validation.values['cliente-descripcion'] || ""}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                              />
                            </div>
                          </Col>
                          <Col md={3}>
                              <label className="col-md-12 col-form-label">Anexar Logo</label>
                              <div className="col-md-12">
                                <Dropzone onDrop={imageFile => addLogoCompany(imageFile[0])} >
                                  {({ getRootProps, getInputProps }) => (
                                    <Button color={'primary'} {...getRootProps()} className="btn-m"> 
                                      <input {...getInputProps()} />
                                      <i className="bx bx-upload font-size-14 align-middle me-2"></i>
                                      {(companyLogo ? 'Cambiar logo' : 'Seleccionar logo')}
                                    </Button>
                                  )}
                                </Dropzone>
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
                                  <Button type="reset" color="warning" onClick={cancelCustomer} >
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

            {accessModule.CREAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A CREAR CLIENTES</b></p></Col></Row></Card>)}
            
            {accessModule.INGRESAR==false&&(<Card><Row><Col xl={12}><p className="text-center"><br /><b>NO TIENES ACCESO A VISUALIZAR CLIENTES</b></p></Col></Row></Card>)}
            
            {
              accessModule.INGRESAR==true && !loadingText ?
              (<TableContainer
                  columns={columns}
                  data={dataCustomers}
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
                        loadingText=="Cargando ..." || loadingText=="Guardando ..." || loadingText=="Eliminando persona..." ?
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

        <ModalConfirmAction 
          confirmModal={confirmModalEliminarPersona}
          title={"Confirmación"}
          onClose={() => {
            setConfirmEliminarPersona(false);
            setConfirmModalEliminarPersona(false);
          }}
          description={`¿Estás seguro que deseas eliminar la persona ${(confirmEliminarPersona!==false ? confirmEliminarPersona.email : '')}?, Toda la información asociada a él no se perderá, pero ya no podrás usar nuevamente a esta persona en la plataforma.`}
          onYes={() => {
            deletePersonConfirm();
          }}
        />

      </React.Fragment>
    );
  }else{
    return (<></>);
  }
};

export default withRouter(IndexClientesMaximo);

IndexClientesMaximo.propTypes = {
  history: PropTypes.object,
};