import Alert from 'react-bootstrap/Alert';
import {React, useContext, useState} from "react"
import { AuthContext } from "..";

const WelcomeMessage = ({name})=>{
    const { userData, setUserData} = useContext(AuthContext);
    let show = userData.first_logged
    if(show === "true"){
        return <Alert style={{zIndex:"1"}} key={"success"} variant={"success"} onClose={() => {userData.first_logged="false"; setUserData(userData);show="false"}} dismissible>
                Welcome {name}! You have created successfully your account.
            </Alert>
    }
    else{
        return ;
    }
}

export default WelcomeMessage