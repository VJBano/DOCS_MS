import mammoth from 'mammoth';

export const DocxBlob = async (docxBlob: ArrayBuffer | null) => {
  try {

    if(docxBlob){
    const { value } = await mammoth.convertToHtml({ arrayBuffer: docxBlob });
    return value;
    }
  } catch (error) {
    console.error('Error handling DOCX document:', error);
    return null;
  }
};