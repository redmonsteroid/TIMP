import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

export default function FileManager() {
  const [file, setFile] = useState(null);
  const [password, setPassword] = useState('');

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('username', localStorage.getItem('username'));
    formData.append('password', password);

    await axios.post('http://localhost:8000/upload', formData);
    alert('File uploaded!');
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="password"
        placeholder="Encryption password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}