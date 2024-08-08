export const capitalizeFullName = (fullName: string): string => {
  return fullName
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
