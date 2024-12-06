import L from "leaflet"

const FoodShopIcon = L.icon({iconUrl:require("../media/shop_icons/food_shop.svg").default, 
    iconRetinaUrl:require("../media/shop_icons/food_shop.svg").default,
    iconAnchor:null,
    shadowUrl:null,
    shadowSize:null,
    shadowAnchor:null,
    iconSize:[40,40],
    className:"Leaflet-venue-icon"
})

export default FoodShopIcon