import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";


// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const [logoCompany, setLogoCompany] = useState(localStorage.getItem("logo"));

  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    let me = new MetisMenu("#side-menu");
    me.update();
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);
  
  useEffect(() => {
    setLogoCompany(localStorage.getItem("logo"));
  }, [localStorage.getItem("logo")]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }
  
  function tToggle() {
    var body = document.body;
    if (window.screen.width <= 1200) {
      body.classList.toggle("sidebar-enable");
    }
  }

  let IMAGE_URL = logoCompany;
  if(IMAGE_URL) IMAGE_URL = (process.env.REACT_API_URL||'https://phapi.portafolioerp.com/')+"/uploads/company-logo/"+IMAGE_URL;

  if(([24,25,26]).indexOf(JSON.parse(localStorage.getItem("authUser")).id_rol)<0){//USUARIO DE MAXIMO P.H
    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            {IMAGE_URL&&(<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xl rounded bg-light"
                src={IMAGE_URL}
              />
              <img
                data-dz-thumbnail=""
                className="avatar-sm rounded bg-light"
                src={IMAGE_URL}
              />
            </p>)}
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{localStorage.getItem("customerUser")} </li>
              <li>
                <Link to="/#" className="has-arrow" >
                  <i className="mdi mdi-database-plus"></i>
                  <span>{"Tablas"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/tablas/inmuebles">{'Inmuebles'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/personas">{'Personas'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/proveedores">{'Proveedores'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/zonas">{'Zonas'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/tablas/conceptos-facturacion">{'Conceptos Facturación'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/conceptos-gastos">{'Conceptos Gastos'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/conceptos-visita">{'Conceptos Visita'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/tablas/tipos-tarea">{'Tipos Tarea'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/tipos-proveedor">{'Tipos Proveedor'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/tipos-vehiculo">{'Tipos Vehículo'}</Link>
                  </li>
                </ul>
              </li>
              
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-apple-keyboard-command"></i>
                  <span>{"Procesos"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/procesos/control-visitas">{'Control de Ingresos'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/tablas/facturacion-ciclica">{'Conceptos Inmuebles'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/procesos/facturacion-ciclica">{'Facturación Cíclica'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/procesos/recibos-de-caja">{'Recibos de Caja'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/procesos/gastos">{'Gastos'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/procesos/pagos">{'Pagos'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/procesos/acumulado">{'Acumulado Recibos, Gastos, Pagos'}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-account-tie-voice"></i>
                  <span>{"CRM"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/utilidades/mensajes-masivos">{'Envio de Mensajes'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/mensajes-recibidos">{'Mensajes Recibidos'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/utilidades/tareas">{'Tareas'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/tareas-recibidas">{'Mis Tareas'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/utilidades/pqrsfs">{'PQRSF Recibidos'}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow">
                  <i className="dripicons-user-group"></i>
                  <span>{"Accesos"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/accesos/usuarios-roles">{'Usuarios Roles'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/accesos/roles-permisos">{'Roles Permisos'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/accesos/usuarios">{'Usuarios'}</Link>
                  </li>
                </ul>
              </li>

              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-auto-fix"></i>
                  <span>{"Utilidades"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/utilidades/entorno">{'Entorno'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/logs">{'Logs'}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }else if(JSON.parse(localStorage.getItem("authUser")).id_rol==24){//PROPIETARIO
    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            {IMAGE_URL&&(<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xl rounded bg-light"
                src={IMAGE_URL}
              />
              <img
                data-dz-thumbnail=""
                className="avatar-sm rounded bg-light"
                src={IMAGE_URL}
              />
            </p>)}
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{props.t("Menu")} </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-apple-keyboard-command"></i>
                  <span>{"Procesos"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/procesos/facturacion-historico">{'Cuentas de Cobro'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/tablas/proveedores-landing">{'Proveedores'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/pqrsf">{'Envio de PQRSF'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/mensajes-recibidos">{'Mensajes Recibidos'}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }else if(JSON.parse(localStorage.getItem("authUser")).id_rol==25){//INQUILINO
    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            {IMAGE_URL&&(<p className="text-center">
              <img
                data-dz-thumbnail=""
                className="avatar-xl rounded bg-light"
                src={IMAGE_URL}
              />
              <img
                data-dz-thumbnail=""
                className="avatar-sm rounded bg-light"
                src={IMAGE_URL}
              />
            </p>)}
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{props.t("Menu")} </li>
              <li>
                <Link to="/#" className="has-arrow">
                  <i className="mdi mdi-apple-keyboard-command"></i>
                  <span>{"Procesos"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/procesos/autorizar-visitantes">{'Visitas y Autorizados'}</Link>
                  </li>
                  <hr />
                  <li>
                    <Link onClick={tToggle} to="/procesos/facturacion-historico">{'Cuentas de Cobro'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/tablas/proveedores-landing">{'Proveedores'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/pqrsf">{'Envio de PQRSF'}</Link>
                  </li>
                  <li>
                    <Link onClick={tToggle} to="/utilidades/mensajes-recibidos">{'Mensajes Recibidos'}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }else if(JSON.parse(localStorage.getItem("authUser")).id_rol==26){//MÁXIMO P.H ADMIN
    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={ref}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{props.t("Menu")} </li>
              <li>
                <Link onClick={tToggle} to="/#" className="has-arrow">
                  <i className="mdi mdi-apple-keyboard-command"></i>
                  <span>{"Procesos"}</span>
                </Link>
                <ul className="sub-menu">
                  <li>
                    <Link onClick={tToggle} to="/procesos/clientes-instalados-maximo">{'Clientes Instalados'}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
