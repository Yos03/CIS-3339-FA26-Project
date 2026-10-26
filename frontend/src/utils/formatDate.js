// Format date values consistently throughout the frontend as MM/DD/YYYY.
export function formatDate(date) {
  if (!date) return '';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '';
  const year = parsedDate.getUTCFullYear();
  const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(parsedDate.getUTCDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
}

export default formatDate;
