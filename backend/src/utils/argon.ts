import argon2 from 'argon2';

const Argon = {
    createHash: async (password:string) => {
        try {
          return await argon2.hash(password)
        } catch (error) {
            return error
        }
    },

    verifyHash: async (hashPassword:string, password:string) => {

        try {
            return await argon2.verify(hashPassword, password);
        } catch (error) {
            return error
        }
    }
}

export default Argon