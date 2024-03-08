interface AccessLog {
    id:string;
    doc_id:string;
    user_id:string;
    access_date:string;
}

const initAccessLog:AccessLog = {
    id:"",
    doc_id:"",
    user_id:"",
    access_date:"",
}

export {
    AccessLog,
    initAccessLog
}