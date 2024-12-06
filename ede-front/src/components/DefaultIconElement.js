import L from "leaflet"

const DefaultIconElement = L.icon({iconUrl:require("../media/icons_svg/map_marker_default.svg").default, 
    iconRetinaUrl:require("../media/icons_svg/map_marker_default.svg").default,
    iconAnchor:null,
    shadowUrl:null,
    shadowSize:null,
    shadowAnchor:null,
    iconSize:[50,50],
    className:"Leaflet-venue-icon"
})

export default DefaultIconElement