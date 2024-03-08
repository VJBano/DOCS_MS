interface User {

    id:string;
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    role:string;
    recovery_key:string;
    token:string;
    reset_token:string;
    created_at:string;
    is_deleted:boolean;
}

interface SelectUser {
    id:string,
    isSelected:boolean;
}
interface UserUpdatePayload {
    firstname : string;
    lastname :  string;
    role :  string;
};

interface UserAddPayload {
    firstname:string;
    lastname:string;
    email:string;
    password:string;
    role:string;
    recovery_key:string;
}

const initUser:User = {
    id:"",
    firstname:"",
    lastname:"",
    email:"",
    password:"",
    role:"",
    recovery_key:"",
    token:"",
    reset_token:"",
    created_at:"",
    is_deleted:false,
}



export {
    User,
    initUser,
    UserUpdatePayload,
    UserAddPayload,
    SelectUser
}