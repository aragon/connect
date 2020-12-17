// For now this function only serializes the passed value,
// but we might want to introduce a fast hashing library
// at some point to optimize memory.
export function hash(data: any) {
  try {
    return JSON.stringify(data)
  } catch (err) {
    return err.message
  }
}
