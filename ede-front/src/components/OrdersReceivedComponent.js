import {React, useEffect, useState, useContext, useRef, ReactDOM, DOM} from "react"
import "../styles/main_styles.css"
import axios from 'axios';
import { AuthContext } from "..";
import { Card } from 'react-bootstrap';
import CardSale from "./CardSale";

const OrdersReceivedComponent = ()=>{
    const { userData, setUserData } = useContext(AuthContext);
    let email = userData.email
    const [sales, setSales] = useState([])
    const Sales = ()=>{
        return sales.map((sale, index)=><CardSale is_my_purchase={false} sale={sale} key={index} />)
    }
    useEffect(()=>{
        axios.post('http://localhost:3001/get_sales', {email: email}).then((server_response)=>{
            setSales(server_response.data.sales)
        })
    },[])
    return <Sales />
}

export default OrdersReceivedComponent