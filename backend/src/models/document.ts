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

interface DocumentStatus {
    id: string;
    doc_id:string;
    user_id:string;
    status:string;
    created_at: string;
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

interface ArchivedYear {
    archived_year:string
} 

export {
    Document,
    initDocument,
    ArchivedYear,
    DocumentStatus
}