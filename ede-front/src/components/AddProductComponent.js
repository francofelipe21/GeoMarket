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
import InputGroup from 'react-bootstrap/InputGroup';
import { validateYupSchema } from "formik";

const AddProductComponent = ()=>{
    const { userData, setUserData} = useContext(AuthContext);
    const email = userData.email;
    const navigator=useNavigate();
    const { user, setUser } = useContext(AuthContext);
    const [validated, setValidated] = useState(false);
    const [mapDisplayed, setMapDisplayed] = useState(false);
    const [selectedProductPhoto, setProductPhoto] = useState(null);
    const [myCategories, setMyCategories] = useState([])
    const [categoryId, setCategoryId] = useState(1)
    const [mySubcategories, setMySubcategories] = useState([])
    const [subcategoryId, setSubcategoryId] = useState(0)
    const [MyCurrency, setMyCurrency] = useState("CLP")
    const [values, setValues] = useState({"category":categoryId, "currency":"CLP"})

    const Categories = ()=>{
        if(myCategories.length === 0){
            axios.post('http://localhost:3001/get_categories').then((res)=>{
                setMyCategories(res.data.response)
            })
        }
       
        return <Form.Select value={values.category} onChange={(e)=>{
                    values.category=e.currentTarget.value;
                    setValues(values)
                    setMySubcategories([])
                    setSubcategoryId(0)
                }}>
                {myCategories.map((e)=>(<option key={e.id} name="category" value={e.id}>{e.name}</option>))}
            </Form.Select>
    }

    const Subcategories = ()=>{
        if(mySubcategories.length === 0){
            axios.post('http://localhost:3001/get_subcategories',{"categoryId":values.category}).then((res)=>{
                setMySubcategories(res.data.response)
            })
        }
        return <Form.Select value={subcategoryId} onChange={(e)=>{
                    values.subcategory=e.currentTarget.value;
                    setValues(values)
                    setSubcategoryId(e.currentTarget.value)
                }}>
                    <option value={0}>Select an option</option>
                {mySubcategories.map((e)=>(<option key={e.id} name="subcategory" value={e.id}>{e.name}</option>))}
            </Form.Select>
    }

    const handlePhotoUpload = (event) => {
        setProductPhoto(event.target.files[0]);
    };
    const handleSubmit = (e)=>{
        let form = e.currentTarget;
        if(!form.checkValidity()){
            e.preventDefault();
            e.stopPropagation();
        }
        else{
            let name = form.name.value;
            let price = form.price.value;
            let currency = values.currency;
            let category = values.category;
            let subcategory = values.subcategory;
            let description = form.description.value;
            let has_picture = selectedProductPhoto !== null && selectedProductPhoto!== undefined? true:false
            const formData = new FormData()
            formData.append("name", name)
            formData.append("email", email)
            formData.append("price", price)
            formData.append("currency", currency)
            formData.append("category_id", category)
            formData.append("subcategory_id", subcategory)
            formData.append("description", description)
            formData.append("has_picture", has_picture)
            const shop_id = Cookies.get("shop_id")
            formData.append("shop_id", shop_id)
            formData.append("product_picture", selectedProductPhoto)
            axios.post("http://localhost:3001/save_new_product", formData, 
                {headers: {"Content-type": "multipart/form-data"}}).then((response)=>{
                    console.log(response.data)
                    if(response.data.successfull){
                        navigator("/");
                        userData.new_product = name;
                        setUserData(userData)
                    }
                    else{
                        alert("There was a problem")
                    }
                })
            e.preventDefault();
            e.stopPropagation();            
        }
        setValidated(true);
    }
    return <div className="login_form">
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row>
            <Form.Group  as={Col} md="6" controlId="groupName">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" type="text" placeholder="Enter the name of your product" required />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">This field is required</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Price</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control name="price" type="number" min={0} required />
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="3">
              <Form.Label>Currency</Form.Label>
              <Form.Select value={MyCurrency} onChange={(e)=>{
                    setMyCurrency(e.currentTarget.value)
                    console.log(MyCurrency)
                }}>
                <option name="currency" value="CLP">CLP</option>
                <option name="currency" value="USD">USD</option>
              </Form.Select>
            </Form.Group>
            </Row>
            <br/>
            <Row>
                <Form.Group as={Col} md="4">
                <Form.Label>Category</Form.Label>
                <Categories />
                </Form.Group>
                <Form.Group as={Col} md="4">
                <Form.Label>Subcategory</Form.Label>
                <Subcategories />
                </Form.Group>
                <Form.Group as={Col} md="4">
                  <Form.Label>Photo</Form.Label>
                  <Form.Control name="product_picture" type="file" accept='image/jpg, image/jpeg, image/png' onChange={handlePhotoUpload} />
                </Form.Group>
            </Row>
            <br />
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" aria-label="With textarea" />
            <br/>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form></div>
}

export default AddProductComponent