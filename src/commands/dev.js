import path from "path"
import chokidar from "chokidar"

import DepsCollector from "../lib/DepsCollector"
import updateNpmDependencies from "../lib/update-npm-dependencies"

export default {
  stopper: null,

  async start(config) {
    const collector = new DepsCollector()
    await collector.updateFile(path.resolve(config.cwd, "src", "index.js"))
    console.log("detected dependencies", collector.dependencies)

    await updateNpmDependencies(collector.dependencies, config)

    const watcher = chokidar.watch(path.resolve(config.cwd, "src"))

    console.log("listening for changes")
    watcher.on("change", async changedPath => {
      if (await collector.updateFile(changedPath)) {
        console.log("deps changed")
        await updateNpmDependencies(collector.dependencies, config)
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
