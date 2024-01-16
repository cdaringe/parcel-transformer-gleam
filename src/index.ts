import { Transformer } from "@parcel/plugin";
import { spawn } from "node:child_process";
import { join, relative, sep } from "node:path";
import { readFile } from "node:fs/promises";
import { parse } from "toml";
import { ok, equal } from "node:assert";

export default new Transformer({
  async transform({ asset }) {
    const baseDirname = asset.fs.cwd();
    const pkgName = await readFile(join(baseDirname, "gleam.toml")).then(
      (x) => parse(x.toString()).name
    );
    ok(pkgName, "missing gleam.toml pkg name");

    const relativeAssetpath = relative(baseDirname, asset.filePath);

    await new Promise<void>((res, rej) =>
      spawn("gleam", ["build", "-t=javascript"], {
        stdio: "inherit",
        cwd: baseDirname,
      })
        .addListener("error", rej)
        .addListener("exit", res)
        .addListener("close", res)
    );

    const [srcPart, ...rest] = relativeAssetpath.split(sep);
    equal(srcPart, "src", `expected path segment of src, got ${srcPart}`);

    const srclessOutRelative = rest.join(sep);

    const outputAssetFilename = join(
      [...new Array(rest.length)].map(() => "..").join(sep),
      "build/dev/javascript",
      pkgName,
      srclessOutRelative.replace(/gleam$/, "mjs")
    );

    asset.setCode(`import { main } from "${outputAssetFilename}"; main()`);
    asset.type = "js";

    return [asset];
  },
});
