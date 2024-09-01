export const formatISODateString = (isoDateString: string): string => {
  if (!isoDateString) return "-";
  
  const date = new Date(isoDateString);
  
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
  const year = date.getUTCFullYear().toString();
  
  return `${day}/${month}/${year}`;
};


export const formatDateStringBack = (dateString:string)=> {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  }

  export const convertToFullDateString = (formattedDate: string): string => {
    if (!formattedDate) return "-";
    
    const [day, month, year] = formattedDate.split('/');
    
    // Ensure day, month, and year are valid
    if (!day || !month || !year) return "-";

    // Return the date in the desired format yyyy-mm-dd
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};
export const convertToDisplayDateString = (isoDateString: string): string => {
  if (!isoDateString) return "-";
  
  const [year, month, day] = isoDateString.split('-');
  
  // Ensure year, month, and day are valid
  if (!year || !month || !day) return "-";

  // Return the date in the desired format dd/mm/yyyy
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};
