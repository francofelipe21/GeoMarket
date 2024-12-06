import React, { useState, useMemo, useCallback, useEffect } from "react"
import {MapContainer, TileLayer, useMap, Marker, Popup, LayersControl, LayerGroup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import DefaultIconElement from "./DefaultIconElement"
import ShopIconElement from "./ShopIcon";
import FoodShopIcon from "./FoodShopIcon";
import ClothesShopIcon from "./ClothesShopIcon";
import { Link } from "react-router-dom";

const MapLayers = ({markers_dict})=>{

  const MyLayerControlOverlay = ({title})=>{
  return <LayersControl.Overlay checked name={title}>
        <LayerGroup>
          {markers_dict[title].map((marker,index)=>marker)}
      </LayerGroup>
      </LayersControl.Overlay>
  }


  console.log()
  for(let index=0; index<Object.keys(markers_dict); index = index + 1){
    
  }

  return <LayersControl position="topright">
    {Object.keys(markers_dict).map((key,index)=><MyLayerControlOverlay title={key} key={index} />)}
    </LayersControl>
}

const ShopsMarkers = ({data})=>{
  const IconsDict = {"Other":ShopIconElement, "Foods":FoodShopIcon, "Clothes":ClothesShopIcon}
  let markers_response = {}
  if(data.length > 0){  
    for(let index=0; index<data.length; index = index + 1){
      let shop = data[index]
      let shop_id = shop.id;
      let seller_email = shop.seller_email;
      let positions = shop.positions;
      let shop_name = shop.name;
      let has_picture = shop.has_picture;
      let shop_category = shop.shop_category;
      if(markers_response[shop_category] === undefined){
        markers_response[shop_category] = []
      }
      let MyShopIcon = IconsDict[shop_category]
      markers_response[shop_category].push(positions.map((coord, index)=>(
        <Marker key={index} position={[coord[0], coord[1]]} icon={MyShopIcon}>
          <Popup><Link  to={"/shops"} state={{"shop_id":shop_id,"seller_email":seller_email, "has_picture":has_picture, "shop_name":shop_name}} style={{textDecoration:"None"}}>Visit {shop_name}</Link></Popup>
        </Marker>)))
    }
    return <MapLayers markers_dict={markers_response} />
  }
}

const Map = ({shopsData}) => {
  const [position, setPosition] = useState([51.505, -0.09]);
  React.useEffect((shopsData) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.error("Error obteniendo la geolocalización:", err);
        }
      );
    } else {
      console.warn("La geolocalización no está soportada por este navegador.");
    }
  }, []);

  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <ShopsMarkers data={shopsData} />
      <CenterMap position={position} />
    </MapContainer>
  );
};

const CenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 13); 
  }, [position, map]);
  return null;
};

const MainMap = ()=>{
    const [shopsData, setShopsData] = useState([])
    React.useEffect(()=>{
      if(shopsData.length === 0){
        axios.post('http://localhost:3001/get_shops_positions',{}).then((server_response)=>{
          setShopsData(server_response.data.response)
          console.log(server_response.data.response)
        })
      }
    },[])
    
    return <div style={{margin:"50px"}}>
      <h3 style={{textAlign:"center"}}>Let's explore the map</h3>
        <Map shopsData={shopsData} />
    </div>
}

export default MainMap

//<InputGroup>
//<InputGroup.Text>
//<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
//<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
//</svg>
//</InputGroup.Text>
//<Form.Control name="search_shops" type="text" />
//</InputGroup>
