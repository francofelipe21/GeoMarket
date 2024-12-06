import Alert from 'react-bootstrap/Alert';
import {React, useContext, useState} from "react"
import { AuthContext } from "..";

const NewProductSaved = ({name})=>{
    const { userData, setUserData} = useContext(AuthContext);
    if(name !== undefined){
        return <Alert style={{zIndex:"1"}} key={"success"} variant={"success"} onClose={() => {userData.new_product=undefined; setUserData(userData)}} dismissible>
                You have saved the product "{name}" successfully!
            </Alert>
    }
    else{
        return ;
    }
}

export default NewProductSaved