import {React, useState, useContext} from "react"
import "../styles/main_styles.css"
import { useNavigate } from "react-router-dom";


function FormContainer({title}){
    const navigator=useNavigate();
    return <div className="form_container">
        <h5 className="subTitle" onClick={(click)=>{navigator("/");}} >GeoMarket</h5>
        <h1 className="montserrat">{title}</h1>
        </div>
}

export default FormContainer