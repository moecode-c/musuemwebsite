const fs = require('fs')
const vm = require('vm')

const files = [
  './data/l_terrain.js',
  './data/l_buldings.js',
  './data/l_New_Layer_4.js',
  './data/l_characters.js',
  './data/l_boats.js',
]

const ctx = { console }
vm.createContext(ctx)

for (const filePath of files) {
  let code = fs.readFileSync(filePath, 'utf8')
  // Strip BOM if present
  code = code.replace(/^\uFEFF/, '')
  // Convert `const name =` to `this.name =` so it attaches to ctx
  code = code.replace(/^\s*const\s+([A-Za-z_$][\w$]*)\s*=/m, 'this.$1 =')
  vm.runInContext(code, ctx, { filename: filePath })
}

const dims = (name) => {
  const a = ctx[name]
  return {
    rows: Array.isArray(a) ? a.length : undefined,
    cols: Array.isArray(a) && Array.isArray(a[0]) ? a[0].length : undefined,
  }
}

console.log('Layer dimensions:')
console.log({
  l_terrain: dims('l_terrain'),
  l_buldings: dims('l_buldings'),
  l_New_Layer_4: dims('l_New_Layer_4'),
  l_characters: dims('l_characters'),
  l_boats: dims('l_boats'),
})

const uniqueIds = (layer) => {
  const ids = new Set()
  for (const row of layer) for (const v of row) ids.add(v)
  return ids
}

const printTop = (name, set, n = 40) => {
  const values = [...set].filter((v) => v !== 0).sort((a, b) => a - b)
  console.log(`${name} unique non-zero tile IDs (first ${n}):`, values.slice(0, n))
  console.log(`${name} unique non-zero tile IDs (last ${n}):`, values.slice(-n))
}

printTop('l_terrain', uniqueIds(ctx.l_terrain))
printTop('l_buldings', uniqueIds(ctx.l_buldings))
printTop('l_New_Layer_4', uniqueIds(ctx.l_New_Layer_4))
