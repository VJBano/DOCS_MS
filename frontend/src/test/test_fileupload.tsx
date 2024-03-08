import axios from 'axios';
import { useState } from 'react';

const Test_Fileupload = () => {

  const [fileType, setFileType] = useState("")

  const uploadFile = async () => {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;

    if (!fileInput) {
      alert('File input not found');
      return;
    }

    const file = fileInput.files?.[0];

    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log("file: ", file)


    const dataFile = {
      doc_name: file.name,
      doc_description:" this is for",
      permitted_user: JSON.stringify(["72730c4e-67cf-4816-87c1-5c695d839cb4",]),
      file:file
    }

    console.log("string: ",typeof dataFile.permitted_user)
    try {
      const response = await axios.post('http://localhost:2023/docman/doc/create', dataFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjcyNzMwYzRlLTY3Y2YtNDgxNi04N2MxLTVjNjk1ZDgzOWNiNCIsImVtYWlsIjoidmp2YW56MjFAZ21haWwuY29tIiwicm9sZSI6IkFkbWluIiwiaWF0IjoxNjk4MDQ0OTc1LCJleHAiOjE2OTgxMzEzNzUsImlzcyI6IkRPQ01BTjIwMjMifQ.D_LYuWM8rKcVfs2aqed_VpRRC2DAvAFZBcWTpia3QNA'
        },
      });

      console.log(response.data); // Handle the response from the server
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <input type="file" id="fileInput" />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
};

export default Test_Fileupload;
