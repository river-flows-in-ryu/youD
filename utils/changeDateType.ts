export function changeDateType(utcDatestr: string) {
  const parsedDate = Date.parse(utcDatestr);

  if (!isNaN(parsedDate)) {
    const utcDate = new Date(parsedDate);
    const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().replace("T", "").replace("Z", "").slice(0, 10);
  } else {
    return "";
  }
}

export function changeEndTime(date: string) {
  return date.slice(0, 19).replaceAll("-", ".").replace("T", " ");
}
