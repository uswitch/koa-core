import stringify from 'json-stringify-safe'

export default ({ label }) => (json) => {
  const outputObj = typeof json === "string" ? { "message": json } : json
  return stringify({ ...outputObj, label }, null, 0)
}
