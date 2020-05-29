export function parseMetadata(file: string, name: string): any {
  let parsedFile
  try {
    parsedFile = JSON.parse(file)
  } catch (error) {
    throw new Error(`Can't parse ${name} file, invalid JSON.`)
  }
  return parsedFile
}
