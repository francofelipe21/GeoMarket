import {React, useState, useContext} from "react"
import "../styles/main_styles.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "..";
import Cookies from 'js-cookie';
import * as yup from 'yup';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';

function SignUpComponent() {
  const [touched, setTouched] = useState({"fullname":false, "email":false, "phonenumber":false, "password":false})
  const [errors, setErrors] = useState({})
  const [values, setValues] = useState({"fullname":'', "email":'', "phonenumber_code":"+569", "phonenumber":'', "client_client":true, "client_provider":false, "password1":'', "password2":''})
  const [validated, setValidated] = useState(false)
  const [show, setShow] = useState(false);
  const [selectedProfilePhoto, setProfilePhoto] = useState(null);
  const handlePhotoUpload = (event) => {
    setProfilePhoto(event.target.files[0]);
  };
  
  const navigator=useNavigate();
  const { userData, setUserData} = useContext(AuthContext);
  
  const redirectToShopSignUp = () => navigator("/sign_up_shop");
  const handleClose = () => {navigator("/");setShow(false);}
  const handleShow = () => setShow(true);
  
  const handleChange = (e)=>{
    console.log(values)
    let field = e.target.name;
    touched[field]=true
    setTouched(touched)
    let new_value;
    if(field==="client_client" || field==="client_provider"){
      new_value = document.getElementById(field).checked
    }
    else{
      new_value = e.currentTarget.value
    }
    values[field] = new_value
    setValues({
        ...values,
        [field]: new_value,
    });
    checkValidity()
  }

  const checkValidity = ()=>{
    let fullname = values.fullname;
    let email = values.email;
    let phonenumber = values.phonenumber;
    let client_client = values.client_client;
    let client_provider = values.client_provider;
    let password1 = values.password1;
    let password2 = values.password2;
    let fullnameRegExp=/^[a-zA-Z ]*$/;
    let emailRegExp =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/ ;
    let phonenumberRegExp = /^[0-9]*$/;
    if(fullname.length === 0 || fullname.length > 100){
      errors.fullname="This field is required"
      if(fullname.length > 100){
        errors.fullname="We can not store more than 100 characters for a name"
      }
    }
    else if(!fullnameRegExp.test(fullname)){
      errors.fullname =  "Only the characters of the alphabet are allowed"
    }
    else{
      delete errors.fullname
    }
    if(email.length === 0 || email.length > 100){
      errors.email="This field is required"
      if(email.length > 100){
        errors.email="We can not store more than 100 characters for a email"
      }
    }
    else if(!emailRegExp.test(email)){
      errors.email =  "The email is invalid"
    }
    else{
      delete errors.email
    }
    if(phonenumber.length !== 8 && phonenumber.length>0){
      errors.phonenumber="Your phonenumber has to have 8 numbers"
    }
    else if(!phonenumberRegExp.test(phonenumber)){
      errors.phonenumber =  "The phonenumber only can has numbers"
    }
    else{
      delete errors.phonenumber
    }
    if(client_client === false && client_provider === false){
      errors.user_type = "You must chose at least one option"
    }
    else{
      delete errors.user_type;
    }
    if(password1.length === 0 || password1.length<8 || password1.length > 100){
      errors.password1 = "The password is required"
      if(password1.length>0 && password1.length<8){
        errors.password1 = "The minimun length for the password is 8 characters"
      }
      else if(password1.length > 100){
        errors.password1 = "The password is so long"
      }
    }
    else{
      delete errors.password1;
    }
    if(password2 !== password1){
      errors.password2="The passwords don't match"
    }
    else{
      delete errors.password2;
    }
    console.log(errors)
    setErrors(errors)
  }

  const handleSubmit = (event)=>{
    checkValidity()
    if (Object.keys(errors).length !== 0) {
      event.preventDefault();
      event.stopPropagation();
      alert("The form has errors")
      setValidated(true)
      console.log(errors)
      console.log(Object.keys(errors))
    }
    else{
    const formData = new FormData()
    formData.append("fullname", values.fullname)
    formData.append("email", values.email)
    formData.append("phonenumber_code", values.phonenumber_code)
    formData.append("phonenumber", values.phonenumber)
    formData.append("client_type", values.client_client)
    formData.append("provider_type", values.client_provider)
    formData.append("password", values.password1)
    formData.append("profile_picture", selectedProfilePhoto)
    formData.append("has_picture", selectedProfilePhoto !== null && selectedProfilePhoto!== undefined? true:false)
    axios.post('http://localhost:3001/save_new_user', formData,{
      headers: {
          "Content-type": "multipart/form-data",
      }}).then(response => {    
            let successfull = response.data.successfull;
            console.log(response.data)
            if(!successfull){
              errors.email = response.data.message;
              setErrors(errors)
              touched.email = true;
              setTouched(touched)
              alert(response.data.message)
            }
            else{
              
              userData.first_logged="true";
              userData.logged="true"
              userData.name = values.fullname;
              userData.email = values.email;
              userData.is_client = values.client_client;
              userData.is_provider = values.client_provider;
              let current_portal_value = "client"
              if(userData.is_provider && !userData.is_client){
                current_portal_value = "provider"
              }
              userData.current_portal = current_portal_value
              userData.has_picture =selectedProfilePhoto !== null && selectedProfilePhoto!== undefined? true:false;
              setUserData(userData);
              Cookies.set("authenticated","true",{"expires":1});
              Cookies.set("email",values.email,{"expires":1});

              Cookies.set("name", values.fullname, {"expires":1});
              Cookies.set("email", values.email, {"expires":1});
              Cookies.set("has_picture", selectedProfilePhoto !== null && selectedProfilePhoto!== undefined? true:false, {"expires":1});
              Cookies.set("is_client", values.client_client.toString(), {"expires":1});
              Cookies.set("is_provider", values.client_provider.toString(), {"expires":1});
              Cookies.set("current_portal", current_portal_value, {"expires":1});

              if(!values.client_provider){
                navigator("/");
              }
              else{
                handleShow();
              }
            }
          }).catch(error => { 
            console.error(error); 
            });
            event.preventDefault();
      event.stopPropagation();
    }
  }

  const schema = yup.object().shape({
    password1: yup.string().required("The password is required").min(8, "The minimun length is of 8 characters"),
    password2: yup.string().required("You must to confirm your password").oneOf([yup.ref('password1'), null], "The passwords don't match")
  });

  

  return (<div className="signup_form">
    <Form encType={'multipart/form-data'} noValidate validated={validated} onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Form.Group as={Col} md="6">
              <Form.Label>Full name</Form.Label>
              <Form.Control
                type="text"
                required
                name="fullname"
                id="fullname"
                value={values.fullname}
                onChange={handleChange}
                isValid={touched.fullname && !errors.fullname}
                isInvalid={touched.fullname && !!errors.fullname}
              />
              <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">{errors.fullname}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                required
                name="email"
                id="email"
                value={values.email}
                onChange={handleChange}
                placeholder="example@email.com"
                isValid={touched.email && !errors.email}
                isInvalid={touched.email && !!errors.email}
              />
              <Form.Control.Feedback  type="valid">
                The email has correct syntaxis
              </Form.Control.Feedback >
              <Form.Control.Feedback type="invalid" id="email_error_id">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row className="mb-2">
            <Form.Group as={Col} md="4">
              <Form.Label>Phonenumber</Form.Label>
              <InputGroup>
                <div style={{"width":"50%"}}>
                  <Form.Select name="phonenumber_code" id="phonenumber_code" value={values.phonenumber_code} onChange={handleChange}>
                    <option value="+569">+569</option>
                    <option value="+562">+562</option>    
                  </Form.Select>
                </div>
                <Form.Control 
                  name="phonenumber"
                  id="phonenumber"
                  onChange={handleChange}
                  value={values.phonenumber}
                  isValid={touched.phonenumber && !errors.phonenumber}
                  isInvalid={touched.phonenumber && !!errors.phonenumber} 
                  type="text" 
                  placeholder="12345678" />
              </InputGroup>
              <Form.Control.Feedback type="valid">Looks good!</Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">{errors.phonenumber}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>On the platform you intend:</Form.Label>
              <Form.Check 
                checked={values.client_client}
                onChange={handleChange} 
                name="client_client" 
                id="client_client" 
                type={"checkbox"} 
                isInvalid={!!errors.user_type}
                label={'Buy'} 
                />
              <Form.Check 
                checked={values.client_provider}
                onChange={handleChange} 
                name="client_provider" 
                id="client_provider" 
                type={"checkbox"}
                label={'Sell'}
                feedback={errors.user_type}
                feedbackType="invalid"
                isInvalid={!!errors.user_type}
                />

        </Form.Group>
        <Form.Group as={Col} md="4">
          <Form.Label>Profile photo</Form.Label>
          <Form.Control name="profile_picture" type="file" accept='image/jpg, image/jpeg, image/png' onChange={handlePhotoUpload} />
        </Form.Group>
      </Row>
      <Row>
        <Form.Group className="mb-3" as={Col} md="6">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            value={values.password1}
            onChange={handleChange} 
            name="password1" 
            id="password1"
            isValid={touched.password1 && !errors.password1} 
            isInvalid={touched.password1 && !!errors.password1} 
            required 
            type="password" 
            placeholder="Password" />
          <Form.Control.Feedback type="valid">
            Looks good!
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            {errors.password1}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" as={Col} md="6">
          <Form.Label>Confirm password</Form.Label>
          <Form.Control 
            value={values.password2}
            onChange={handleChange} 
            isInvalid={touched.password2 && !!errors.password2} 
            isValid={touched.password2 && !errors.password2} 
            id="password2"
            name="password2" 
            required 
            type="password" 
            placeholder="Password" />
          <Form.Control.Feedback type="valid">
            Looks good!
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            {errors.password2}
          </Form.Control.Feedback>
        </Form.Group>
      </Row>
      <Button type="submit">Create account</Button>


<Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>User Created Successfully</Modal.Title>
        </Modal.Header>
        <Modal.Body>Would you like to add your store to the platform?</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={redirectToShopSignUp}>
            Yes
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            No
          </Button>
          
        </Modal.Footer>
      </Modal>
    </Form></div>
  );
}

export default SignUpComponent