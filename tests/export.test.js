import executor from "../pkg/dist-src"

describe("executor", () => {
  it("should export commands", () => {
    expect(Object.keys(executor)).toEqual(["build", "dev"])
  })
})
