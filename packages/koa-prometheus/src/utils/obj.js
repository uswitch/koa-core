export const path = (path, obj, def) => path
  .reduce((acc, it) => acc && acc[it] ? acc[it] : def, obj)
