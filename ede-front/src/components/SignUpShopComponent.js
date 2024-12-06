import {React, useState, useContext, useRef, ReactDOM, DOM} from "react"
import "../styles/main_styles.css"
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "..";
import Cookies from 'js-cookie';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MyInteractiveMap from "./MyInteractiveMap";

const SignUpShopComponent = ()=>{
    const { userData, setUserData} = useContext(AuthContext);
    const email = userData.email;
    const navigator=useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [validated, setValidated] = useState(false);
    const [mapDisplayed, setMapDisplayed] = useState(false);
    const [selectedShopProfilePhoto, setShopProfilePhoto] = useState(null);
    const [shopCategories, setShopCategories] = useState([])
    const [shopCategory, setShopCategory] = useState("1")
    const Categories = ()=>{
        if(shopCategories.length === 0){
            axios.post('http://localhost:3001/get_categories').then((res)=>{
                setShopCategories(res.data.response)
            })
        }
       
        return <Form.Select value={shopCategory} onChange={(e)=>{
                    let value=e.currentTarget.value;
                    setShopCategory(value)
                    console.log(value)
                }}>
                {shopCategories.map((e)=>(<option key={e.id} name="category" value={e.id}>{e.name}</option>))}
            </Form.Select>
    }
    const handlePhotoUpload = (event) => {
        setShopProfilePhoto(event.target.files[0]);
    };
    const handleSubmit = (e)=>{
        console.log(email)
        let form = e.currentTarget;
        if(!form.checkValidity()){
            e.preventDefault();
            e.stopPropagation();
        }
        else{
            let shop_name = form.name.value;
            let has_position = form.yes_no_shop_locations.value;
            let has_shop_picture = selectedShopProfilePhoto !== null && selectedShopProfilePhoto!== undefined? true:false
            let shop_positions=[]
            let shop_coordinates=[]
            if(has_position === "yes"){
                shop_positions = form.positions.value.replace(/\(|\)/g,'').split(',');
                console.log(shop_positions)
                for(let index=0; index+1<shop_positions.length; index=index + 2){
                    if(shop_positions[index] !== '' && shop_positions[index+1] !== ''){
                        shop_coordinates.push(shop_positions[index], shop_positions[index+1])
                    }
                }
                console.log(shop_coordinates)
            }
            const formData = new FormData()
            formData.append("email", email)
            formData.append("name", shop_name)
            formData.append("positions", shop_coordinates)
            formData.append("has_shop_picture", has_shop_picture)
            formData.append("shop_picture", selectedShopProfilePhoto)
            formData.append("shop_category", shopCategory)

            userData.has_shop_picture = has_shop_picture
            userData.shop_name = shop_name
            setUserData(userData)
            Cookies.set("shop_name", shop_name, {"expires":1});
            Cookies.set("has_shop_picture", has_shop_picture, {"expires":1});
            axios.post('http://localhost:3001/save_new_shop',formData, {
                headers: {
                    "Content-type": "multipart/form-data",
                }}).then((response)=>{
                if(response.data.successfull){
                    axios.post('http://localhost:3001/update_user_shop',{
                        email:email,
                        shop_id:response.data.shop_id
                    }).then((response)=>{
                        console.log(response)
                        if(response.data.successfull){
                            Cookies.set("shop_id", response.data.shop_id, {"expires":1});
                            navigator("/")
                        }
                        else{
                            alert("There was a problem. We are sorry.")
                        }
                    })
                }
              }).catch(error => { 
                console.error(error);
                })
            e.preventDefault();
            e.stopPropagation();            
        }
        setValidated(true);
    }
    return <div className="login_form">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
            <Form.Group  as={Col} md="4" controlId="groupName">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" type="text" placeholder="Enter the name of your shop" required />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group  as={Col} md="4" controlId="groupName">
                <Form.Label>Category:</Form.Label>
                <Categories />
            </Form.Group>
            <Form.Group as={Col} md="4">
              <Form.Label>Profile photo</Form.Label>
              <Form.Control name="shop_picture" type="file" accept='image/jpg, image/jpeg, image/png' onChange={handlePhotoUpload} />
            </Form.Group>
            </Row>
            <Form.Group className="mb-3" id="radioShopLocation">
                <Form.Label>Do you want to add the locations of your shops?</Form.Label>
                {'\u00A0\u00A0\u00A0\u00A0\u00A0'}
                <Form.Check inline label="Yes" onClick={()=>{setMapDisplayed(true)}} name="yes_no_shop_locations" value={"yes"} type="radio" id="yes" required />
                <Form.Check inline label="No" onClick={()=>setMapDisplayed(false)} name="yes_no_shop_locations" value={"no"} type="radio" id="no" required />
                <Form.Control.Feedback type="invalid">You must answer yes or no</Form.Control.Feedback>
            </Form.Group>
            <MyInteractiveMap display={mapDisplayed} />
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form></div>
}

export default SignUpShopComponent