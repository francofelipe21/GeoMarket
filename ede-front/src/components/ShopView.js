import {React, useContext, useState, useEffect} from "react"
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "..";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ShopView = ()=>{
    const [products, setProducts] = useState([{"name":"1232"}])
    const location = useLocation();
    const shop_id = location.state.shop_id;
    const seller_email = location.state.seller_email;
    const ProductCard = ({name, price, product_id, description, seller_email})=>{
      let path_image = "http://localhost:3001/products_pictures/"+seller_email+"_"+name+".jpg";
      return (<Col sm={4}>
          <Card style={{ width: '18rem', margin:"10px" }}>
            <Card.Img variant="left" src={path_image} />
            <Card.Body>
              <Card.Title>{name}
              </Card.Title>
              <Card.Text>
                {description}
              </Card.Text>
              <Card.Text>
              Price: ${price}
              </Card.Text>
              <Button variant="primary"><Link style={{color:"white", textDecoration:"none"}} to={"/buy_product"} state={{shop_id:shop_id ,product_id:product_id, path_image:path_image, product_name:name, product_description: description, product_price:price}}> Buy </Link></Button>
            </Card.Body>
          </Card></Col>
        );
    }
  
    const ProductsList = ({products, seller_email})=>{
      return <Container><Row>{products.map((product, index)=>
          <ProductCard name={product.name} key={index} product_id={product.id} price={product.price} description={product.description} seller_email={seller_email} />)}
          </Row></Container>
    }

    useEffect(()=>{
        axios.post('http://localhost:3001/get_shop_products',{"shop_id":shop_id}).then((server_response)=>{
            setProducts(server_response.data.response)
        })
    },[])
    return <div><h3 className="montserrat trade_title">List of products</h3><ProductsList products={products} seller_email = {seller_email} /></div>
}

export default ShopView