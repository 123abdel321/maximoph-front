import PropTypes from 'prop-types';
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { layoutTypes } from "./constants/layout";
// Import Routes all
import { authProtectedRoutes, publicRoutes } from "./routes";

// Import all middleware
import Authmiddleware from "./routes/route";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import NonAuthLayout from "./components/NonAuthLayout";

// Import scss
import "./assets/scss/theme.scss";

// Import Firebase Configuration lite
import { requestFBToken, onPushNotificationFBListener } from "./helpers/lite_firebase_helper";

requestFBToken();

onPushNotificationFBListener()
.then((payload) => {

  let obj = JSON.parse(localStorage.getItem("authUser"));
  if(obj.notifications.length){
    obj.notifications.push({
      id: (obj.notifications.length+1),
      titulo: payload.notification.title,
      descripcion: payload.notification.body,
      created_at: new Date().toISOString()
    });
  }

  localStorage.setItem("authUser",JSON.stringify(obj));
})
.catch((err) => console.log('failed: ', err));


const getLayout = (layoutType) => {
  let Layout = VerticalLayout;
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout;
      break;
    default:
      break;
  }
  return Layout;
};

const App = () => {

  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }));

  const Layout = getLayout(layoutType);
  
  useEffect(() => {
    const imagenes = [
      //'general-background-2.png',
      'general-background-6.png'
    ];
    
    const claseAleatoria = `background-${Math.floor(Math.random() * imagenes.length) + 1}`;
    document.body.classList.add(claseAleatoria);
  }, []);
  
  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>{route.component}</Layout>
              </Authmiddleware>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
    </React.Fragment>
  );
};

App.propTypes = {
  layout: PropTypes.any
};

export default App;