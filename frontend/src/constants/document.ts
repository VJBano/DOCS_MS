interface Document {
    id:string;
    doc_name:string;
    doc_type:string;
    doc_description:string;
    category:string;
    path:string;
    created_at:string;
    created_by:string;
    doc_access_id:number;
    is_deleted:boolean;
}

const initDocument:Document = {
    id:"",
    doc_name:"",
    doc_type:"",
    doc_description:"",
    category:"",
    path:"",
    created_at:"",
    created_by:"",
    doc_access_id:0,
    is_deleted:false,
}

interface DocumentPayload {
    doc_name: string;
    doc_description:string;
    permitted_user: string;
    file:any
}

interface SelectDocument {
    id:string;
    isSelected:boolean;
}

export {
    Document,
    initDocument,
    DocumentPayload,
    SelectDocument
}