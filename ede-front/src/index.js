import React, {createContext, useContext, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import {createBrowserRouter, RouterProvider, Link} from "react-router-dom";
import LoginTemplate from "./components/LoginComponent.js"
import SignUpTemplate from "./components/SignUpComponent.js"
import Cookies from 'js-cookie';
import FormContainer from "./components/FormContainer.js";
import SignUpComponent from './components/SignUpComponent.js';
import LoginComponent from './components/LoginComponent.js';
import SignUpShopComponent from './components/SignUpShopComponent.js';
import AddProductComponent from './components/AddProductComponent.js';
import OrdersReceivedComponent from './components/OrdersReceivedComponent.js';
import axios from 'axios';
import ShopView from './components/ShopView.js';
import TradeHeader from './components/TradeHeader.js';
import BuyProductView from './components/BuyProductView.js';
import MyPurchasesComponent from './components/MyPurchasesComponent.js'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/sign_up",
    element: <div><FormContainer title={"Sign Up Form"} /><SignUpComponent /></div>,
  },
  {
    path: "/login",
    element: <div><FormContainer title={"Login Form"} /><LoginComponent /></div>,
  },
  {
    path: "/sign_up_shop",
    element: <div><FormContainer title={"Sign Up Your Shop"} /><SignUpShopComponent /></div>
  },
  {
    path: "/shops",
    element: <div><TradeHeader /><ShopView /></div>
  },
  {
    path: "/buy_product",
    element: <div><FormContainer title={"Detail your purchase"} /><BuyProductView /></div>
  },
  {
    path: "/add_product",
    element: <div><FormContainer title={"Add your product"} /><AddProductComponent /></div>
  },
  {
    path: "/orders_received",
    element: <div><FormContainer title={"Orders Received"} /><OrdersReceivedComponent /></div>
  },
  {
    path: "/my_purchases",
    element: <div><FormContainer title={"My Purchases"} /><MyPurchasesComponent /></div>
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));

const authenticated = Cookies.get('authenticated');
if(authenticated === undefined){
  Cookies.set("authenticated", false, {"expires":1})
  authenticated = false
}

function getCookieValue(field, default_value){
  let value = Cookies.get(field);
  if(value === undefined){
    Cookies.set(field, default_value, {"expires":1})
    value = default_value
  } 
  return value
}

export const AuthContext = createContext();
const MainView = ({children})=>{
  var name=getCookieValue("name", "");
  let email = getCookieValue('email', "");
  let has_picture = getCookieValue('has_picture', false);
  let is_client = getCookieValue('is_client', false)
  let is_provider = getCookieValue('is_provider', false)
  let current_portal = getCookieValue('current_portal', "")
  let shop_name = getCookieValue('shop_name', "")
  let has_shop_picture = getCookieValue('has_shop_picture', false)
  let shop_id = getCookieValue('shop_id', 0)
  let userDict = {"logged":authenticated, "first_logged":"false", "name":name, "email":email, 
    "has_picture":has_picture, "is_client":is_client, "is_provider":is_provider, "current_portal":current_portal, 
    "shop_name":shop_name, "has_shop_picture":has_shop_picture}
  const [userData, setUserData] = useState(userDict);
  return <AuthContext.Provider value={{userData, setUserData}}>{children}</AuthContext.Provider>
}
root.render(
  <MainView><React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode></MainView>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
