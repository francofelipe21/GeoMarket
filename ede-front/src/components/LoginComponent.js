import {React, useState, useContext} from "react"
import "../styles/main_styles.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as formik from 'formik';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "..";
import Cookies from 'js-cookie';

function validateEmail(value){
    let error
    if(!value){
        error = "The email is required"
    }
    console.log(error);
    return error
}

const LoginComponent = ()=>{
    const navigator=useNavigate();
    const { userData, setUserData } = useContext(AuthContext);
    const [validated, setValidated] = useState(false);
    const handleSubmit = (e)=>{
        setValidated(true);
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
          e.preventDefault();
          e.stopPropagation();
          return ;
        }
        let email = form.email.value;
        let password= form.password.value;
        e.preventDefault();
        e.stopPropagation();
        axios.post('http://localhost:3001/authenticate', {
            email:email,
            password:password
        }).then(response=>{
            var valid_authentication = response.data.valid_authentication;
            if(valid_authentication){
                console.log(response.data)
                Cookies.set("authenticated",true,{"expires":1});
                Cookies.set("email",email,{"expires":1});
                userData.logged="true";
                userData.first_logged="false"
                userData.name = response.data.name;
                userData.email = email;
                userData.is_client = response.data.is_client;
                userData.is_provider = response.data.is_provider;
                userData.shop_name = response.data.shop_name;
                userData.has_shop_picture = response.data.has_shop_picture;
                let current_portal_value = "client"
                if(userData.is_provider && !userData.is_client){
                    current_portal_value = "provider"
                }
                userData.current_portal = current_portal_value
                userData.has_picture = response.data.has_picture
                setUserData(userData);

                Cookies.set("name", response.data.name, {"expires":1});
                Cookies.set("email", email, {"expires":1});
                Cookies.set("has_picture", response.data.has_picture, {"expires":1});
                Cookies.set("is_client", response.data.is_client, {"expires":1});
                Cookies.set("is_provider", response.data.is_provider, {"expires":1});
                Cookies.set("current_portal", current_portal_value, {"expires":1});
                Cookies.set("shop_name", response.data.shop_name, {"expires":1});
                Cookies.set("has_shop_picture", response.data.has_shop_picture, {"expires":1});
                Cookies.set("shop_id", response.data.shop_id, {"expires":1});

                navigator("/");
            }
            else{
                e.preventDefault();
                e.stopPropagation();
                alert("Your email and password don't match")
                return;
            }
        }).catch(error => { 
            console.error(error); 
            });
        
    }
    return <div className="login_form">
        <Form method="POST" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control name="email" type="email" placeholder="Enter your email" required />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control name="password" type="password" placeholder="Password" required />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form></div>
}

export default LoginComponent