import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";

//Import images
import avatar3 from "../../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../../assets/images/users/avatar-4.jpg";

// actions
import { removeNotification } from "../../../store/actions";

//redux
import { useDispatch } from "react-redux";

import withRouter from "components/Common/withRouter";

const NotificationDropdown = props => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);
  const [pendingNotifications, setPendingNotifications] = useState('');
  const [notifications, setNotifications] = useState([]);
  
  const dispatch = useDispatch();

  useEffect(() => {
    const obj = JSON.parse(localStorage.getItem("authUser"));
    setNotifications(obj.notifications);
    if(obj.notifications.length){
      setPendingNotifications(obj.notifications.length);
    }else{
      setPendingNotifications('');
    }

  }, [localStorage.getItem("authUser")]);

  const deleteNotification = (notificationId)=>{
    const obj = JSON.parse(localStorage.getItem("authUser"));
    
    let newNotifications = []
    obj.notifications.map(notification=>{
      if(notification.id!=notificationId) newNotifications.push(notification);
    });
    
    obj.notifications = newNotifications;

    localStorage.setItem("authUser",JSON.stringify(obj));

    dispatch(removeNotification(notificationId));
  };

  return (
    <React.Fragment>
      {pendingNotifications>0&&(<Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="dropdown d-inline-block"
        tag="li"
      >
        <DropdownToggle
          className="btn header-item noti-icon position-relative"
          tag="button"
          id="page-header-notifications-dropdown"
        >
          <i className="bx bx-bell bx-tada" />
          <span className="badge bg-danger rounded-pill">{pendingNotifications}</span>
        </DropdownToggle>

        <DropdownMenu className="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0">
          <div className="p-3">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0"> {'Notificaciones'} </h6>
              </Col>
              {/*<div className="col-auto">
                <a href="#" className="small">
                  {" "}
                  View All
                </a>
              </div>*/}
            </Row>
          </div>

          <SimpleBar style={{ height: "230px" }}>
            {notifications.map(notification=>(<Link to="" key={`notification-${notification.id}`} className="text-reset notification-item">
              <div className="d-flex">
                <div className="avatar-xs me-3">
                  <span className="avatar-title bg-primary rounded-circle font-size-16" title="Eliminar" onClick={()=>deleteNotification(notification.id)}>
                    <i className="bx bx-trash-alt" />
                  </span>
                </div>
                <div className="flex-grow-1">
                  <h6 className="mt-0 mb-1">
                    {notification.titulo}
                  </h6>
                  <div className="font-size-12 text-muted">
                    <p className="mb-1">
                      {notification.descripcion}
                    </p>
                    <p className="mb-0">
                      <i className="mdi mdi-clock-outline" />{" "}
                      {notification.created_at.split("T")[0]}{" "}{notification.created_at.split("T")[1].split(".")[0]}
                    </p>
                  </div>
                </div>
              </div>
            </Link>))}
            
          </SimpleBar>
          {/*<div className="p-2 border-top d-grid">
            <Link className="btn btn-sm btn-link font-size-14 text-center" to="#">
              <i className="mdi mdi-arrow-right-circle me-1"></i> <span key="t-view-more">{props.t("View More..")}</span>
            </Link>
          </div>*/}
        </DropdownMenu>
      </Dropdown>)}
    </React.Fragment>
  );
};

export default withRouter(NotificationDropdown);

NotificationDropdown.propTypes = {
  t: PropTypes.any
};