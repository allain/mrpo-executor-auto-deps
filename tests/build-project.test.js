import fs from "fs-extra"
import { loadJsonFile } from "../src/lib/fs-utils"

import path from "path"

import buildProject from "../pkg/dist-src/lib/build-project"

describe("build-project", () => {
  it("throws when project does not have package.json", async () => {
    const cwd = path.resolve(__dirname, "fixtures", "missing-package-json")
    return expect(
      buildProject({
        cwd
      })
    ).rejects.toThrow(/^package.json not found in project$/)
  })

  it("throws when project does not contain src directory", async () => {
    const cwd = path.resolve(__dirname, "fixtures", "missing-src")
    return expect(
      buildProject({
        cwd
      })
    ).rejects.toThrow(/^src directory not found in project$/)
  })

  it("throws when project does not contain src/index.js directory", async () => {
    const cwd = path.resolve(__dirname, "fixtures", "missing-src-index")
    return expect(
      buildProject({
        cwd
      })
    ).rejects.toThrow(/^src\/index.js not found in project$/)
  })

  it("works on simple project", async () => {
    const buildPath = await buildProject({
      name: "simple",
      version: "0.1.0",
      cwd: path.resolve(__dirname, "fixtures", "simple")
    })

    expect(await fs.pathExists(buildPath)).toBeTruthy()

    const pkg = await loadJsonFile(path.resolve(buildPath, "package.json"))
    expect(pkg.name).toEqual("simple")
    expect(pkg.version).toEqual("0.1.0")
  })
})
