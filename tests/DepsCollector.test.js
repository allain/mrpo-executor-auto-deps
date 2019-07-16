import * as path from "path"

import DepsCollector from "../src/lib/DepsCollector"

describe("DepsCollector", () => {
  it("works with optional extensions", async () => {
    const collected = await DepsCollector.collectFrom(
      path.resolve(__dirname, "fixtures", "simple", "src", "index.js")
    )

    expect(collected).toEqual(["a-external", "b-external", "lodash"])
  })
})
