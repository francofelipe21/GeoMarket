import L from "leaflet"

const ShopIconElement = L.icon({iconUrl:require("../media/shop_icons/tienda.svg").default, 
    iconRetinaUrl:require("../media/shop_icons/tienda.svg").default,
    iconAnchor:null,
    shadowUrl:null,
    shadowSize:null,
    shadowAnchor:null,
    iconSize:[40,40],
    className:"Leaflet-venue-icon"
})

export default ShopIconElement