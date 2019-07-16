import path from "path"
import Debug from "debug"
import DepsCollector from "../lib/DepsCollector"

import updateNpmModules from "../lib/update-npm-dependencies"

const debug = Debug("mrpo:executor-pika-js")

export default async function build(config) {
  const dependencies = DepsCollector.collectFrom(
    path.resolve(config.cwd, "src", "index.js")
  )
  await updateNpmModules(dependencies, config)
}
