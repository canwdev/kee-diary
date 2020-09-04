export function formatDateLite(d) {
  // let time = pad2Num(d.getHours()) + ':' + pad2Num(d.getMinutes())
  return d.toISOString().substr(0, 10)
}
