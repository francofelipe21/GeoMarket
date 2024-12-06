import React, { useState } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';

export const UploadFile = ({multiple}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append('file', selectedFile);
    axios.post('/api/upload', formData)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if(multiple){
    return <Form.Control type="file" accept='image/jpg, image/jpeg, image/png' onChange={handleFileUpload} />
  }
  else{
    return <Form.Control type="file" accept='image/jpg, image/jpeg, image/png' onChange={handleFileUpload} />
  }
};

