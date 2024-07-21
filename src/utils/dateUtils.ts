export const formatDate = (dateString: string): string => {
    if (dateString === undefined) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Los meses empiezan en 0
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
};