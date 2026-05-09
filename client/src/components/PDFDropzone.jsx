import React, { useState } from 'react';

const PDFDropzone = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleDrag = function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = function(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF or Image file (JPG, PNG).');
      }
    }
  };

  const handleChange = function(e) {
    e.preventDefault();
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        onFileSelect(file);
      } else {
        alert('Please upload a PDF or Image file (JPG, PNG).');
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      style={{ padding: '40px', border: '2px dashed #ccc', borderRadius: '8px', textAlign: 'center', backgroundColor: dragActive ? '#f0f8ff' : '#fafafa' }}
    >
      <input 
        type="file" 
        accept="application/pdf,image/jpeg,image/png"
        className="hidden"
        style={{ display: 'none' }}
        id="pdf-upload"
        onChange={handleChange}
      />
      <label htmlFor="pdf-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <p style={{ margin: '0 0 10px', color: '#666' }}>Drag and drop your PDF or Image here, or click to browse</p>
        <span style={{ fontSize: '24px', color: '#ccc' }}>📄📸</span>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px', maxWidth: '300px' }}>
          <strong>Note:</strong> Scanned documents and images are supported via AI-powered OCR. All pages will be processed.
        </p>
        {selectedFile && <p style={{ marginTop: '15px', color: '#0066cc', fontWeight: 'bold' }}>Selected: {selectedFile.name}</p>}
      </label>
    </div>
  );
};

export default PDFDropzone;
