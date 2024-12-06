import {React, useContext, useState} from "react"
import "../styles/main_styles.css"
import WelcomeMessage from "./WelcomeMessage.js"
import SessionButtons from "./SessionButtons.js";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "..";
import NewProductSaved from "./NewProductSaved.js"
import NewSaleSent from "./NewSaleSent.js";

const MyHeader = ()=>{
  const { userData, setUserData } = useContext(AuthContext);
  const new_product = userData.new_product
  const product_requested = userData.product_requested
  return <div className="my_header">
      <SessionButtons />
      <h1 className="montserrat main_header" style={{textAlign:"center"}}>GeoMarket</h1>
      <WelcomeMessage name={userData.name}/>
      <NewProductSaved name={new_product} />
      <NewSaleSent name={product_requested} />
    </div>
}

export default MyHeader