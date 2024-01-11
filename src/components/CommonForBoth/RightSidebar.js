import React from "react";
import PropTypes from "prop-types";
import { Row, Col, FormGroup } from "reactstrap";

import { connect } from "react-redux";
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changePreloader,
  changeTopbarTheme,
  showRightSidebarAction,
} from "../../store/actions";

//SimpleBar
import SimpleBar from "simplebar-react";

import { Link } from "react-router-dom";

import "../../components/CommonForBoth/rightbar.scss";

//Import images
import bgimg1 from "../../assets/images/sidebar/img1.jpg";
import bgimg2 from "../../assets/images/sidebar/img2.jpg";
import bgimg3 from "../../assets/images/sidebar/img3.jpg";
import bgimg4 from "../../assets/images/sidebar/img4.jpg";
import layout1 from "../../assets/images/layouts/layout-1.jpg";
import layout2 from "../../assets/images/layouts/layout-2.jpg";
import layout3 from "../../assets/images/layouts/layout-3.jpg";

//constants
import {
  layoutTypes,
  layoutModeTypes,
  layoutWidthTypes,
  topBarThemeTypes,
  leftBarThemeImageTypes,
  leftSidebarTypes,
  leftSideBarThemeTypes,
} from "../../constants/layout";

const RightSidebar = props => {
  return (
    <React.Fragment>
     <div className="right-bar" id="right-bar">
      <SimpleBar style={{ height: "900px" }}>
        <div data-simplebar className="h-100">
          <div className="rightbar-title px-3 py-4">
            <Link
              to="#"
              onClick={e => {
                  e.preventDefault()
                  props.showRightSidebarAction(false)
                }}
              className="right-bar-toggle float-end"
            >
              <i className="mdi mdi-close noti-icon" />
            </Link>
            <h5 className="m-0">Color MAXIMO PH</h5>
          </div>

          <hr className="my-0" />

          <div className="p-4">
            <hr className="mt-1" />
            <div className="radio-toolbar">
              <span className="mb-2 d-block">Color Sistema</span>
              <input
                type="radio"
                id="radioLight"
                name="radioLight"
                value={layoutModeTypes.LIGHT}
                checked={props.layoutModeType === layoutModeTypes.LIGHT}
                onChange={e => {
                  if (e.target.checked) {
                    props.changeLayoutMode(e.target.value);
                  }
                }}
              />
              <label className="me-1" htmlFor="radioLight">CLARO</label>
              <input
                type="radio"
                id="radioDark"
                name="radioDark"
                value={layoutModeTypes.DARK}
                checked={props.layoutModeType === layoutModeTypes.DARK}
                onChange={e => {
                  if (e.target.checked) {
                    props.changeLayoutMode(e.target.value);
                  }
                }}
              />
              <label htmlFor="radioDark">OSCURO</label>
            </div>

            <hr className="mt-1" />

            <div className="radio-toolbar">
              <span className="mb-2 d-block" id="radio-title">
                Barrra Navegación Color
              </span>
              <input
                type="radio"
                id="radioThemeLight"
                name="radioTheme"
                value={topBarThemeTypes.LIGHT}
                checked={props.topbarTheme === topBarThemeTypes.LIGHT}
                onChange={e => {
                  if (e.target.checked) { 
                    props.changeTopbarTheme(e.target.value);
                  }
                }}
              />
              <label className="me-1" htmlFor="radioThemeLight">CLARO</label>
              <input
                type="radio"
                id="radioThemeDark"
                name="radioTheme"
                value={topBarThemeTypes.DARK}
                checked={props.topbarTheme === topBarThemeTypes.DARK}
                onChange={e => {
                  if (e.target.checked) {
                    props.changeTopbarTheme(e.target.value);
                  }
                }}
              />
              <label className="me-1" htmlFor="radioThemeDark">OSCURO</label>
              {props.layoutType === "vertical" ? null : (
                <>
                  <input
                    type="radio"
                    id="radioThemeColored"
                    name="radioTheme"
                    value={topBarThemeTypes.COLORED}
                    checked={props.topbarTheme === topBarThemeTypes.COLORED}
                    onChange={e => {
                      if (e.target.checked) {
                        props.changeTopbarTheme(e.target.value);
                      }
                    }}
                  />
                  <label className="me-1" htmlFor="radioThemeColored">FULL-COLOR</label>{" "}
                </>
              )}
            </div>

            {/*<FormGroup>
              <span className="mb-2 d-block" id="radio-title">
                Preloader
              </span>

              <div className="form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input checkbox"
                  id="checkbox_1"
                  checked={props.isPreloader}
                  onChange={() => {
                    props.changePreloader(!props.isPreloader);
                  }}
                />

                <label className="form-check-label" htmlFor="checkbox_1">
                  Preloader
                </label>
              </div>
            </FormGroup>*/}
          </div>
        </div>
      </SimpleBar>
      </div>
      <div className="rightbar-overlay"></div>
    </React.Fragment>
  );
};

RightSidebar.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changePreloader: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  isPreloader: PropTypes.any,
  layoutType: PropTypes.any,
  layoutModeType : PropTypes.any,
  changeLayoutMode : PropTypes.func,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
  onClose: PropTypes.func,
};

const mapStateToProps = state => {
  return { ...state.Layout };
};

export default connect(mapStateToProps, {
  changeLayout,
  changeLayoutMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  changePreloader,
  showRightSidebarAction,
})(RightSidebar);
