import {React, useEffect, useState, useContext, useRef, ReactDOM, DOM} from "react"
import "../styles/main_styles.css"
import { AuthContext } from "..";
import { Card } from 'react-bootstrap';

const CardSale = ({sale, is_my_purchase})=>{
    let email;
    const { userData, setUserData } = useContext(AuthContext);
    if(!is_my_purchase){
        
        email = userData.email
    }
    else{
        console.log(sale)
        email = sale.email
    }
    let client_name = sale.client_name;
    let amount = sale.amount;
    let address = sale.address;
    let delivery_date = sale.delivery_date.split('T')[0];
    let has_dispatch = sale.has_dispatch;
    let product_name = sale.product_name;
    let quantity = sale.quantity;
    let shop_name = sale.shop_name;
    console.log(sale.email)
    return (
        <Card className="mb-3" style={{ width:"50%", marginLeft:"25%", marginTop:"25px" }}>
          <div className="row g-0">
            <div className="col-md-4">
              <Card.Img
                src={"http://localhost:3001/products_pictures/"+email+"_"+product_name+".jpg"}
                alt="Imagen de ejemplo"
                className="img-fluid rounded-start"
              />
            </div>
            <div className="col-md-8">
              <Card.Body>
                <Card.Title> Purchase Request </Card.Title>
                <Card.Text>
                <b>Product: </b> {product_name}
                <br/>
                <b>Quantity: </b> {quantity}
                <br/>
                <b>Amount: </b> ${amount}
                <br/>
                {is_my_purchase?<span><b>Shop: </b>{shop_name}</span> :<span><b>Client: </b>{client_name}</span>}
                <br/>
                <b>Type Of Delivery: </b>{has_dispatch?"Home Delivery":"Pick-Up Store"}
                <br/>
                <b>Delivery Date: </b>{delivery_date}
                <br/>
                {has_dispatch?
                <span><b>Address: </b>{address}</span>
                :
                ""}
                </Card.Text>
              </Card.Body>
            </div>
          </div>
        </Card>
      );
}

export default CardSale