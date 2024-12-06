import React, {createContext, useContext, useState} from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { AuthContext } from "..";

const BuyProductView = ()=>{
    const { userData, setUserData } = useContext(AuthContext);
    let email = userData.email;
    const location = useLocation();
    if(location.state === null){
        location.state = {product_id:0, path_image:0, product_name:"", product_price:0}
    }
    const product_id = location.state.product_id;
    const shop_id = location.state.shop_id;
    const path_image = location.state.path_image;
    const product_name = location.state.product_name;
    const product_price = location.state.product_price;
    
    const [totalAmount, setTotalAmount] = useState(product_price)
    const [quantity, setQuantity] = useState(1)
    const product_description = location.state.product_description;
    const today = new Date().toISOString().split('T')[0];
    const [saleDate, setSaleDate] = useState(today);
    const [deliveryType, setDeliveryType] = useState("dispatch")
    const [displayDeliveryDetails, setDisplayDeliveryDetails] = useState(false)
    const navigator=useNavigate();

    const DeliveryDetails = ({display, today, type})=>{
        let label_date = "Dispatch Date"
        const AskAddress = ({type})=>{
            if(type === "dispatch"){
                return <Form.Group>
                    <Form.Label>Write your address please: </Form.Label>
                    <Form.Control id="input_text_ask_address" style={{width:"100%"}} type="text" />
                    </Form.Group>
            }
        }
        if(type === "pickup"){
            label_date = "Since when could you withdraw it?"
        }
        if(display){
            return <div><Form.Group>
            <Form.Label>{label_date}</Form.Label>
            <Form.Control value={saleDate} onChange={(e)=>{setSaleDate(e.currentTarget.value)}} min={today} style={{width:"200px"}} type="date" />
            </Form.Group><AskAddress type={type} /></div>
        }
    }

    const handleSubmit = (event)=>{
        const form = event.currentTarget;
        if(quantity<1 || totalAmount<1 || saleDate === "" || form.checkValidity() === false){
            event.stopPropagation()
            event.preventDefault()
            alert("There was an error")
        }
        else{
            let formData = {}
            formData.email = email
            formData.product_id= product_id
            formData.shop_id= shop_id
            formData.quantity= quantity
            formData.amount = totalAmount
            formData.delivery_date = saleDate
            let address = document.getElementById("input_text_ask_address")
            if(address !== null){
                address = address.value;
            }
            formData.address = address
            formData.has_dispatch = deliveryType === "dispatch"
            console.log(formData)
            axios.post('http://localhost:3001/save_new_sale', formData).then((server_response)=>{
                server_response = server_response.data
                console.log(server_response)
                if(server_response.successfull){
                    userData.product_requested = product_name;
                    setUserData(userData)
                    navigator("/")
                }
            })
            event.stopPropagation()
            event.preventDefault()
        }
    }
    
    return <Card style={{ marginTop:"50px", marginLeft:"5%", width:"90%" }}>
        <Form noValidate onSubmit={handleSubmit}><div style={{ display: 'flex', flexDirection: 'row'}}>
    <Card.Img 
      variant="left" 
      src={path_image} 
      style={{ maxWidth: '300px'}} 
    />
    <div style={{ display: 'flex', flexDirection: 'row'}}>
    <Card.Body style={{maxWidth:"50%"}}>
      <Card.Title>{product_name}</Card.Title>
      <Card.Text>
        {product_description}
      </Card.Text>
      <Card.Text>
        Price: ${product_price}
      </Card.Text>
    </Card.Body>
    <Card.Body>
        
            <Form.Group>
                <Form.Label>Quantity</Form.Label>
                <Form.Control value={quantity} onChange={(e)=>{setTotalAmount(e.currentTarget.value*product_price); setQuantity(e.currentTarget.value)}} style={{width:"100px"}} type="number" min="1" />
            </Form.Group>
            <Form.Group>
                <Form.Check required onChange={()=>{setDisplayDeliveryDetails(true);setDeliveryType("dispatch")}} name="delivery_type" type={"radio"} id={"dispatch"} label={"Home Delivery"} />
                <Form.Check required onChange={()=>{setDisplayDeliveryDetails(true);setDeliveryType("pickup")}} name="delivery_type" type={"radio"} id={"pickup"} label={"In-Store Pickup"} />
            </Form.Group>
            <DeliveryDetails display={displayDeliveryDetails} today={today} type={deliveryType} />
        
    </Card.Body>
    </div></div>
    <Card.Footer>
    <Card.Body>
        <div style={{textAlign:"right"}}>
        <label><b>Total amount:&nbsp;&nbsp;</b>{"$"+totalAmount+""}&nbsp;&nbsp;&nbsp;&nbsp;</label>
        <Button variant="primary" type='submit'>Buy</Button>
        </div>
    </Card.Body>
    </Card.Footer></Form>
  </Card>
}

export default BuyProductView