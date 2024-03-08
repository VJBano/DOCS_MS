interface Comment {
    id:string;
    document_id:string;
    user_id:string;
    user_name:string;
    comment:string;
    created_at:string;
}

const initComment:Comment = {
    id:"",
    document_id:"",
    user_id:"",
    user_name:"",
    comment:"",
    created_at:"",
}

export {
    Comment,
    initComment
}