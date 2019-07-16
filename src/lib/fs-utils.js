import fs from "fs-extra"
import path from "path"

export async function loadTextFile(filePath, encoding = "utf-8") {
  return await fs.readFile(filePath, encoding)
}

export async function loadJsonFile(filePath) {
  const content = await loadTextFile(filePath)
  return JSON.parse(content)
}

export async function writeJsonFile(filePath, obj) {
  return fs.writeFile(filePath, JSON.stringify(obj, null, 2))
}
