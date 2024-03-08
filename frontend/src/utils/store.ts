import { create } from "zustand";
import Caching from "./caching";
import { SelectDocument } from "../constants/document";
import { SelectUser } from "../constants/user";

type RoleProps = {
    role:string;
    setRole:(role:string) => void;
}

type NavProps = {
    navClicked:number;
    setNavClicked: (id:number) => void;

    globalCategory:string;
    setGlobalCategory: (val:string) => void;
}

interface Peek {
    id:string,
    isSelected:boolean;

}
type ModalProps = {

    peek:Peek;
    setPeek: (modal:Peek) => void;

    addDocumentModal: boolean;
    setAddDocumentModal: (modal:boolean) => void;

    addUserModal:boolean;
    setAddUserModal: (modal:boolean) => void;

 
    successModal:boolean;
    setSuccessModal: (val:boolean) => void;

    selectDocumentModal: SelectDocument;
    setSelectDocumentModal: (val: SelectDocument) => void;

    selectUserModal: SelectUser;
    setSelectUserModal: (val: SelectDocument) => void;
}

const StateStore = {


    ModalStore: create<ModalProps>((set) => ({
        addDocumentModal:false,
        setAddDocumentModal: (val) => set(() => ({addDocumentModal:val})),

        addUserModal:false,
        setAddUserModal: (val) => set(() => ({addUserModal:val})),

        successModal:false,
        setSuccessModal: (val) => set(() => ({successModal:val})),

        selectDocumentModal: {id: "", isSelected:false},
        setSelectDocumentModal: (val) => set(() => ({selectDocumentModal:val})),

        selectUserModal: {id:"", isSelected:false},
        setSelectUserModal: (val) => set(() => ({selectUserModal:val})),

        peek:{id:"", isSelected:false},
        setPeek: (val) => set(() => ({peek:val}))


    })),

    roleStore: create<RoleProps>((set) => ({
        role:"",
        setRole: (val) => set(() => ({role:val}))
    })),

    navStore: create<NavProps>((set) => ({
        navClicked:Caching.getCache("nav") != null? Caching.getCache("nav").option: 1,
        setNavClicked: (val) => set(() => ({navClicked:val})),

        globalCategory:"All",
        setGlobalCategory: (val) => set(() => ({globalCategory:val})),
    }))

    //TODO: add more here...
}

export default StateStore