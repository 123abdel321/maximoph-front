import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { Row, Col, CardBody, Card, Alert, Container, Form, Input, FormFeedback, Spinner, Label } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

// actions
import { loginUser } from "../../store/actions";

// import images
import profile from "assets/images/logo-dark.png";
import logo from "assets/images/logo.svg";

//Import RemoteCombo
import RemoteCombo from "../../components/Maximo/RemoteCombo";

import ModalConfirmAction from '../../components/Maximo/ModalConfirmAction';

const Login = props => {

  //meta title
  document.title = "Login | Maximo PH";

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [errorMora, setErrorMora] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customersUser, setCustomersUser] = useState(localStorage.getItem("authUser")?JSON.parse(localStorage.getItem("authUser")):false);

  const multipleCustomer = (respCustomers, success)=>{
    if(success){
      let customersToCombo = [];
      let customerActual = false;

      respCustomers.map(cus=>{
        customersToCombo.push({
          label: cus.cliente_numero_documento+' '+cus.cliente_nombre,
          value: cus.id,
          estado: cus.estado
        })

        if(localStorage.getItem("customerUser")==cus.cliente_nombre){
          setCustomer({
            label: cus.cliente_numero_documento+' '+cus.cliente_nombre,
            value: cus.id
          });
        }
      });

      setCustomers(customersToCombo);
    }

    setLoading(false);
  };

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Por favor ingrese su Correo Electrónico"),
      password: Yup.string().required("Por favor ingrese su Contraseña"),
    }),
    onSubmit: (values) => {
      setLoading(true);

      dispatch(loginUser(values, props.router.navigate, multipleCustomer, customer?.value));
    }
  });

  const cancelLogin = ()=>{
    if(localStorage.getItem("customersUser")){
      props.router.navigate("/");
    }else{
      validation.handleReset();
      setCustomers([]);
      setCustomer(false);
    }
  };

  const { error } = useSelector(state => ({
    error: state.Login.error,
  }));

  useEffect(() => {
    if(localStorage.getItem("customersUser")){
      let csU = JSON.parse(localStorage.getItem("customersUser"));
      multipleCustomer(csU, true);
      validation.setValues({email: customersUser.email, password: localStorage.getItem('2._mu')});
    }
  },[]);

  return (
    <React.Fragment>
      {/*<div className="home-btn d-none d-sm-block">
        <Link to="/" className="text-dark">
          <i className="bx bx-home h2" />
        </Link>
      </div>*/}
      <div className="account-pages my-5 pt-sm-5">
        <Container>
          <Row className="justify-content-center">
            <Col md={(customers.length>1?11:8)} lg={(customers.length>1?9:6)} xl={(customers.length>1?8:5)}>
              <Card className="overflow-hidden">
                <div className="bg-primary bg-soft">
                  <Row>
                    <Col xs={7}>
                      <div className="text-primary p-4">
                        <h5 className="text-primary btn-primary bg-transparent" >{customersUser?"Cambio de Administración!":"Bienvenido !"}</h5>
                        <p className="btn-primary bg-transparent" >{customersUser?"Por seguridad solicitamos tu contraseña nuevamente":"Inicia Sesión para continuar con Maximo PH."}</p>
                      </div>
                    </Col>
                    <Col className="col-5 align-self-end text-center">
                      <div className="p-4">
                        <img src={profile} alt="" className="img-fluid" width="100" />
                      </div>
                    </Col>
                  </Row>
                </div>
                <CardBody className="pt-0">
                  <div>
                    <Link to="/" className="logo-light-element">
                      <div className="avatar-md profile-user-wid mb-4">
                        <span className="avatar-title rounded-circle bg-light">
                        <img
                            src={logo}
                            alt=""
                            className="rounded-circle"
                            height="34"
                          />
                        </span>
                      </div>
                    </Link>
                  </div>
                  <div className="p-2">
                    <Form
                      className="form-horizontal"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      {error ? <Alert color="danger">{error}</Alert> : null}

                      {!customers.length&&!customersUser&&(<div className="mb-3">
                        <Label className="form-label">Correo Electrónico</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Ingresa tu correo"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                        ) : null}
                      </div>)}

                      {!customers.length&&!customersUser&&(<div className="mb-3">
                        <Label className="form-label">Contraseña</Label>
                        <Input
                          name="password"
                          value={validation.values.password || ""}
                          type="password"
                          placeholder="Ingresa Contraseña"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          invalid={
                            validation.touched.password && validation.errors.password ? true : false
                          }
                        />
                        {validation.touched.password && validation.errors.password ? (
                          <FormFeedback type="invalid">{validation.errors.password}</FormFeedback>
                        ) : null}
                      </div>)}

                      {customers.length>1&&(<div className="mb-3">
                          <Label className="form-label">¿A cuál administración ingresarás? *</Label>
                          <RemoteCombo
                            value={customer}
                            data={customers}
                            onChange={(val)=>{
                              if(Number(val.estado)==1){
                                setCustomer(val);
                              }else{
                                setErrorMora(`Actualmente ${val.label} se encuentra con saldo pendiente con Máximo P.H. Para mayor información comunicarse con la siguiente línea 312 8576683.`)
                                setCustomer(null);
                              }
                            }}
                          />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </div>)}

                      <div className="mt-3 d-grid">
                        {
                          !loading ?
                            (<>
                              <button className="btn btn-primary btn-block" type="submit">
                                {!customers.length?'Iniciar Sesión':'Ingresar'}
                              </button>
                              <br />
                              {customers.length>1&&(<button className="btn btn-secondary btn-block" type="reset" onClick={cancelLogin}>
                                Cancelar
                              </button>)}
                            </>)
                          :
                            (<div className="text-center"><Spinner className="ms-12" color="dark" /></div>)
                        }
                      </div>

                      {/*<div className="mt-4 text-center">
                        <Link to="/forgot-password" className="text-muted">
                          <i className="mdi mdi-lock me-1" />
                          Recuperar mi contraseña
                        </Link>
                      </div>*/}
                    </Form>
                  </div>
                </CardBody>
              </Card>
              <div className="mt-5 text-center text-white">
                <p>
                  © {new Date().getFullYear()} Maximo PH
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/*MODAL ERROR MORA*/}
      <ModalConfirmAction 
        confirmModal={(errorMora?true:false)}
        information={true}
        error={false}
        onClose={()=>{
          setErrorMora(false);
        }}
        title={"Cliente en mora"}
        description={errorMora}
      />
      {/*MODAL ERROR MORA*/}
    </React.Fragment>
  );
};

export default withRouter(Login);

Login.propTypes = {
  history: PropTypes.object,
};
