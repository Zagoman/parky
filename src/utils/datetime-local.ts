export function toDatetimeLocal(date: Date) {
  const ten = function (i: number): string {
    return (i < 10 ? "0" : "") + String(i)
  }
  const YYYY = String(date.getFullYear())
  const MM = ten(date.getMonth() + 1)
  const DD = ten(date.getDate())
  const HH = ten(date.getHours())
  const II = ten(date.getMinutes())
  const SS = ten(date.getSeconds())
  return YYYY + "-" + MM + "-" + DD + "T" + HH + ":" + II + ":" + SS
}
