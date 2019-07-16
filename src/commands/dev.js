import path from "path"
import chokidar from "chokidar"
import { loadJsonFile } from "../lib/fs-utils"

import DepsCollector from "../lib/DepsCollector"
import updateNpmDependencies from "../lib/update-npm-dependencies"

export default {
  stopper: null,

  async start(config) {
    const mrpoConfig = await loadJsonFile(path.resolve(config.cwd, "mrpo.json"))

    const executorSpecs = mrpoConfig.executors || [mrpoConfig.executor]
    const executorDeps = executorSpecs.reduce((deps, executor) => {
      // TODO: support cross platform dep support
      if (executor[0] !== ".") {
        return [...deps, executor]
      }

      return deps
    }, [])

    const collector = new DepsCollector()
    await collector.updateFile(path.resolve(config.cwd, "src", "index.js"))
    console.log("detected dependencies", collector.dependencies)

    await updateNpmDependencies(
      [...collector.dependencies, ...executorDeps],
      config
    )

    const watcher = chokidar.watch(path.resolve(config.cwd, "src"))

    console.log("listening for changes")
    watcher.on("change", async changedPath => {
      if (await collector.updateFile(changedPath)) {
        console.log("deps changed")
        await updateNpmDependencies(
          [...collector.dependencies, ...executorDeps],
          config
        )
      }
    })

    await new Promise(resolve => {
      this.stopper = resolve
    })

    watcher.close()
  },

  async stop() {
    if (this.stopper) {
      this.stopper()
      this.stopper = null
    }
  }
}
