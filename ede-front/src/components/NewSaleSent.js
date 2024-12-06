import Alert from 'react-bootstrap/Alert';
import {React, useContext, useState} from "react"
import { AuthContext } from "..";

const NewSaleSent = ({name})=>{
    const { userData, setUserData} = useContext(AuthContext);
    if(name !== undefined){
        return <Alert style={{zIndex:"1"}} key={"success"} variant={"success"} onClose={() => {userData.product_requested=undefined; setUserData(userData)}} dismissible>
                You have purchased the product "{name}" successfully!
            </Alert>
    }
    else{
        return ;
    }
}

export default NewSaleSent