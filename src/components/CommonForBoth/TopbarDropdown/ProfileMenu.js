import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import withRouter from "components/Common/withRouter";

// users
import user2 from "../../../assets/images/users/avatar-2.jpg";
import Dropzone from "react-dropzone";

import { editLogoCustomer } from "../../../store/actions";

import { useSelector, useDispatch } from "react-redux";

const ProfileMenu = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);

  const [username, setusername] = useState("Admin");
  const [avatarHeader, setAvatarHeader] = useState(user2);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"));

        setusername((obj.nombre||obj.email));
      }
      const PATH_AVATAR = JSON.parse(localStorage.getItem("authUser")).avatar_origin=='user' ? 'company-logo' : 'avatar';
      const AVATAR = JSON.parse(localStorage.getItem("authUser")).avatar ? (process.env.REACT_API_URL||'https://phapi.portafolioerp.com')+"/uploads/"+PATH_AVATAR+"/"+JSON.parse(localStorage.getItem("authUser")).avatar : user2;

      setAvatarHeader(AVATAR);
    }
  }, [localStorage.getItem("authUser")]);

  const addAvatarUser = (image)=>{
    if(['image/png','image/jpg','image/jpeg'].indexOf(image.type)>=0){
      const userValues = new FormData();
      userValues.append('user', true);
      userValues.append('image', image);
      userValues.append('tipo_logo', image?.type);
      userValues.append('id',JSON.parse(localStorage.getItem("authUser")).id);

      dispatch(editLogoCustomer(userValues, (response)=>{
        let newAuthUser = JSON.parse(localStorage.getItem("authUser"));
            newAuthUser.avatar_origin = 'user';
            newAuthUser.avatar = response.logo;
            newAuthUser = JSON.stringify(newAuthUser);
        
        localStorage.setItem("authUser", newAuthUser);
      }));
    }else if(image){
      toastr.error("Por favor seleccione una imágen válida (png, jpg ó jpeg).", "Error de validación");
    }
  };

  return (
    <React.Fragment>
      <Dropzone onDrop={imageFile => addAvatarUser(imageFile[0])} >
        {({ getRootProps, getInputProps }) => (<div className="d-inline-block">
            <input {...getInputProps()} />
            <div {...getRootProps()} title={'Cambiar foto de perfil'} style={{cursor: 'pointer'}}>
              <span className="d-none d-xl-inline-block ms-2 me-1" style={{color: '#FFFFFF', fontWeight: 'bold', marginTop: '25px'}}>{username}</span>
              <img
                className="rounded-circle header-profile-user"
                
                src={avatarHeader}
                style={{marginTop: '1px'}}
                
                alt="Header Avatar"
                />
            </div>
        </div>)}
      </Dropzone>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item "
          id="page-header-user-dropdown"
          tag="button"
        >
          <span className="d-none d-xl-inline-block ms-2 me-1" style={{color: '#FFFFFF', fontWeight: 'bold'}}>{localStorage.getItem("customerUser")}</span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <div className="dropdown-divider" />
          {JSON.parse(localStorage.getItem("customersUser")).length>1&&(<><Link to="/login" className="dropdown-item">
            <i className="bx bx-rotate-left font-size-16 align-middle me-1 text-danger" />
            <span>{"Cambiar de administración"}</span>
          </Link>
          <div className="dropdown-divider" /></>)}
          <Link to="/logout" className="dropdown-item">
            <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
            <span>{"Cerrar Sesión"}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any
};

const mapStatetoProps = state => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default withRouter(
  connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
