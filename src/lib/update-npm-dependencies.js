import path from "path"
import { loadJsonFile } from "./fs-utils"
import fs from "fs-extra"
import execa from "execa"
import Debug from "debug"

const debug = Debug("mrpo:javascript-pika-executor")

export default async function installNodeModules(dependencies, config) {
  const pkg = await loadJsonFile(path.resolve(config.cwd, "package.json"))

  await fs.ensureDir(path.resolve(config.cwd, "node_modules"))

  const needsRemoving = new Set(Object.keys(pkg.dependencies))

  for (const dependency of dependencies) {
    try {
      // Check to see if the dep is already instealled
      require.resolve(dependency, { paths: [config.cwd] })
    } catch (err) {
      await installNodeModule(dependency, config)
    }
    needsRemoving.delete(dependency)
  }

  for (const name of needsRemoving) {
    await removeNpmModule(name)
  }
}

async function installNodeModule(name, config) {
  console.log("installing", name, "dependency")
  const installing = execa("npm", ["install", "--save", name], {
    cwd: config.cwd
  })
  installing.stdout.pipe(process.stdout)
  installing.stderr.pipe(process.stderr)
  await installing
}

async function removeNpmModule(name, config) {
  console.log("removing", name, "dependency")
  const removing = execa("npm", ["remove", "--save", name], {
    cwd: config.cwd
  })
  removing.stdout.pipe(process.stdout)
  removing.stderr.pipe(process.stderr)
  await removing
}
