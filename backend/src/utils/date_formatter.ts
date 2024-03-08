
export const DateFormatter = (date:string) => {

    try {
        
        if(date !== undefined) {

            const FormattedDate = new Date(date).toLocaleDateString("en-PH", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              });
          
              return FormattedDate;

        } else {
            return ""
        }

    } catch (error) {
        return error
    }
}