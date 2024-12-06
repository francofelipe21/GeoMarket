import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import {React, useContext, useState} from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "..";
import Cookies from 'js-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SessionButtons = ()=>{
    const { userData, setUserData } = useContext(AuthContext);
    let email = userData.email;
    let logged=userData.logged;
    let name = userData.name;
    let has_picture = userData.has_picture;
    let current_portal = userData.current_portal;
    let is_client = userData.is_client;
    let is_provider = userData.is_provider;
    const navigator=useNavigate();

    const logout = ()=>{
      userData.logged = "false";
      setUserData(userData);
      Cookies.set("authenticated", false, {"expires":1});
      Cookies.set("name", "", {"expires":1});
      Cookies.set("email", "", {"expires":1});
      Cookies.set("has_picture", false, {"expires":1});
      Cookies.set("is_client", false, {"expires":1});
      Cookies.set("is_provider", false, {"expires":1});
      Cookies.set("current_portal", "", {"expires":1});
      Cookies.set("shop_name", "", {"expires":1});
      Cookies.set("has_shop_picture", false, {"expires":1});
      
    }

    const MySessionButton = ({current_portal})=> {
      if(current_portal==="client"){

        let img_src = "http://localhost:3001/profiles_pictures/default.jpg"
        if(has_picture && has_picture.toString() === "true"){
          img_src = "http://localhost:3001/profiles_pictures/"+email+".jpg"
        }

        return <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
      <Image style={{width:"50px", height:"50px"}} src={img_src} roundedCircle />{"  "} {name}
      </Dropdown.Toggle>

      <Dropdown.Menu>
      <Dropdown.Item href="/my_purchases" >My Purchases</Dropdown.Item>
        <Dropdown.Item href="/" onClick={logout}>Logout</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
      }
      else{
        let has_shop_picture = userData.has_shop_picture;
        let shop_name = userData.shop_name;
        
        let img_src = "http://localhost:3001/shops_pictures/default.jpg"
        if(has_shop_picture){
          img_src = "http://localhost:3001/shops_pictures/"+email+".jpg"
        }

        return <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
        <Image style={{width:"50px", height:"50px"}} src={img_src} roundedCircle />{"  "} {shop_name}
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="/orders_received" disabled={shop_name===""}>Orders Received</Dropdown.Item>
          <Dropdown.Item href="/add_product" disabled={shop_name===""}>Add Product</Dropdown.Item>
          <Dropdown.Item href="/" onClick={logout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      }
    }
    const MyPortal = ({current_portal, is_client, is_provider})=>{
      if((is_client==="true" && is_provider==="true") || (is_client===true && is_provider===true)){
        if(current_portal === "client"){
          return <Button variant="dark" size="sm" onClick={
            ()=>{
              userData.current_portal="provider";
              setUserData(userData)
              navigator("/")
            }}>Suplier Portal</Button>
        }
        else{
          return <Button variant="dark" size="sm" onClick={
            ()=>{
              userData.current_portal="client";
              setUserData(userData)
              navigator("/")
            }
          }>Client Portal</Button>
        }
      }
    }

    if(logged === "true"){
        return <div style={{position:"absolute", right:"10px", top:"10px", display:"flex"}} >
          < MyPortal  as={Col} md="6" current_portal={current_portal} is_client={is_client} is_provider={is_provider} />
      <span style={{width:"20px"}}></span>
      < MySessionButton  as={Col} md="6" current_portal={current_portal} />
      
      </div>
    }
    else{
        return <div style={{position:"absolute", right:"10px", top:"10px"}} >
        <Button variant="dark" size="sm" onClick={()=>{navigator("/login")}}>Login</Button>{' '}
        <Button variant="dark" size="sm" onClick={()=>{navigator("/sign_up")}}>Sign up</Button>
      </div>;
    }
}

export default SessionButtons