import path from "path"
import Debug from "debug"
import collectDeps from "collect-deps"
import { loadJsonFile } from "../lib/fs-utils"

import updateNpmModules from "../lib/update-npm-dependencies"

export default async function build(config) {
  const codeDeps = await collectDeps(
    path.resolve(config.cwd, "src", "index.js")
  )

  const mrpoConfig = await loadJsonFile(path.resolve(config.cwd, "mrpo.json"))

  const executorSpecs = mrpoConfig.executors || [mrpoConfig.executor]
  const executorDeps = executorSpecs.reduce((deps, executor) => {
    // TODO: support cross platform dep support
    if (executor[0] !== ".") {
      return [...deps, executor]
    }

    return deps
  }, [])

  await updateNpmModules([...codeDeps, ...executorDeps], config)
}
