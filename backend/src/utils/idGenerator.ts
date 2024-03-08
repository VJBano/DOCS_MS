import { v4 as uuidv4 } from 'uuid';



const IDgenerator = {

    IdGenerator: () => {
        const min = 999999999;
        const max = 9999999999;

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    UUIDGenerator: () => {
        return uuidv4()
    }
}

export default IDgenerator