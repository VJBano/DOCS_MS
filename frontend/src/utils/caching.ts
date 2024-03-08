import ls from "localstorage-slim"
ls.config.encrypt = true;

const Caching = {

    setCache: (key: string, value: any, ttl: number) => {
        try {
            const data = {
              user: value,
              expiry: Date.now() + ttl,
            };
      
            ls.set(key, JSON.stringify(data));
          } catch (error) {
            console.error('Error while setting cache:', error);
          }
    },

    getCache: (key:string) => {

        try {
            
            const encrypted_data: any = ls.get(key);
      
            if (!encrypted_data) {
              return null;
            }
      
            const data = JSON.parse(encrypted_data);
      
            if (Date.now() > data.expiry) {
              window.localStorage.removeItem(key);
              return null;
            }
      
            return data.user;
          } catch (error) {
            console.error('Error while getting cache:', error);
            return null;
          }
    }
}

export default Caching