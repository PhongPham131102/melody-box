export function formatDate(date: Date): string {
  let hours: any = date.getHours();
  let minutes: any = date.getMinutes();

  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  let day: any = date.getDate();
  let month: any = date.getMonth() + 1;
  const year = date.getFullYear();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  return hours + ':' + minutes + ' - ' + day + '/' + month + '/' + year;
}
export const formatPriceVND = (input) => {
  input = input.replace(/\D/g, '').replace(/[^0-9]/g, '');

  return input.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
};
