import {React, useContext, useState, useEffect} from "react"
import { useLocation } from 'react-router-dom';
import "../styles/main_styles.css"
import { useNavigate } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import axios from 'axios';

const TradeHeader = ()=>{
    const location = useLocation();
    const name = location.state.shop_name;
    const shop_id = location.state.shop_id;
    const has_picture = location.state.has_picture;
    const navigator=useNavigate();
    const [shopPicturePath, setShopPicturePath] = useState("http://localhost:3001/shops_pictures/default.jpg")
    useEffect(()=>{
        if(has_picture){
            axios.post('http://localhost:3001/get_shop_image',{"shop_id":shop_id}).then((server_response)=>{
            setShopPicturePath(server_response.data.path);
            });
        }
    }, [])
    return <div className="form_container">
            <h5 className="subTitle" onClick={(click)=>{navigator("/");}} >GeoMarket</h5>
            <h1 className="montserrat">
            <Image style={{width:"50px", height:"50px"}} src={shopPicturePath} roundedCircle />{"   "}
            {name}
            </h1>
            </div>
    
}

export default TradeHeader