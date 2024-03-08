interface AccessVault  {
    id:string;
    doc_access_id:number;
    user_id:string;
    created_at:string;
    created_by:string;
    updated_by:string;
}

const initAccessVault:AccessVault = {
    id:"",
    doc_access_id:0,
    user_id:"",
    created_at:"",
    created_by:"",
    updated_by:"",
}

export {
    AccessVault,
    initAccessVault
}