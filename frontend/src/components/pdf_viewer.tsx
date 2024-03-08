import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { saveAs } from 'file-saver';

interface PDFViewerProps {
    blob: Blob;
  }

const PDFViewer:  React.FC<PDFViewerProps> = ({ blob }) => {
    const [numPages, setNumPages] = useState(0);

  useEffect(() => {
    const blobURL = URL.createObjectURL(blob);
    return () => {
      URL.revokeObjectURL(blobURL);
    };
  }, [blob]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const downloadPDF = () => {
    saveAs(blob, 'document.pdf');
  };

  return (
    <div>
      <Document file={URL.createObjectURL(blob)} onLoadSuccess={onDocumentLoadSuccess}>
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      <button onClick={downloadPDF}>Download PDF</button>
    </div>
  );
};

export default PDFViewer;
