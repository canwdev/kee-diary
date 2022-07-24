import * as fs from 'fs-extra'
export {isDev} from '@canwdev/electron-utils'

export async function readFileAsArrayBuffer(path: string) {
  const file = fs.readFileSync(path)
  return new Uint8Array(file).buffer
}

export async function saveFileFromArrayBuffer(path: string, arrayBuffer: ArrayBuffer) {
  await fs.writeFile(path, Buffer.from(arrayBuffer))
}
