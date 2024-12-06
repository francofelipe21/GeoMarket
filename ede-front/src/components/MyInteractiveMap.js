import React, { useState, useMemo, useRef } from "react"
import {MapContainer, TileLayer, useMapEvents, Marker, Popup, LayerGroup} from "react-leaflet"
import "leaflet/dist/leaflet.css"
import DefaultIconElement from "./DefaultIconElement"
import Form from 'react-bootstrap/Form';


const MapListener = ({markersPositions, setMarkersPosition})=>{
    let latlng = undefined
    let aux_array = markersPositions
    useMapEvents({
        click(e){
            latlng=e.latlng
            
            if(markersPositions.length === 0){
                aux_array.push({"id":0,"lat":latlng.lat, "lng":latlng.lng})
            }
            else{
                aux_array.push({"id":markersPositions[markersPositions.length - 1].id+1,"lat":latlng.lat, "lng":latlng.lng})
            }
            setMarkersPosition(aux_array)
            console.log(markersPositions)
        }
    })

    const removeMarker = (id) => {
        setMarkersPosition((markers_data) => markers_data.filter((marker) => marker.id !== id));
      };
    if(aux_array.length>0){
        let stringPositions = ""
        for(let index=0; index<markersPositions.length; index=index+1){
            stringPositions=stringPositions+"("+markersPositions[index].lat+","+markersPositions[index].lng+"),"
        }
        document.getElementById("positions").value=stringPositions
        return markersPositions.map((markerPosition, index)=>(
            <Marker eventHandlers={{click:()=>{removeMarker(markerPosition.id)}
            }} key={markerPosition.id} position={[markerPosition.lat, markerPosition.lng]} icon={DefaultIconElement}>
            </Marker>
            ))
    }
    return <div></div>
}

const MyInteractiveMap = ({display})=>{
    const [state, setState] = useState({currentLocation : {"lat":"52.500772", "lng":"13.472764"}})  

    React.useEffect(()=>{navigator.geolocation.getCurrentPosition((position)=>{
        setState({currentLocation : {"lat":position.coords.latitude.toString(), "lng":position.coords.longitude.toString()}})
    }, function(error){
        console.log(error)        
    },{
        enableHighAccuracy:true
    })})

    const [markersPositions, setMarkersPosition] = useState([])

    if(display){
            return <MapContainer id="{id}" style={{width:"100%", height:"200px", padding:"10px"}} center={{"lat":state.currentLocation.lat, "lng":state.currentLocation.lng}} zoom={12}>
            <MapListener markersPositions={markersPositions} setMarkersPosition={setMarkersPosition} />
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Form.Control name="positions" id="positions" type="text" hidden />
            </MapContainer>
    }
}

export default MyInteractiveMap