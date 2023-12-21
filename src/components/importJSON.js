import React, { useState } from 'react';

const FileInput = (data, setData) => {
  const [file, setFile] = useState(null);

  const handleChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleParse = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        let jsonData = ""
        try {
        jsonData = JSON.parse(e.target.result);
        } catch {return}
        setData(jsonData);
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <input type="file" accept=".json" onChange={handleChange} />
      <button onClick={handleParse}>Импорт JSON</button>
    </div>
  );
};

export default FileInput;