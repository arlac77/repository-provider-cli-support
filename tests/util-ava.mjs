import test from "ava";
import { repositoryUrl } from "repository-provider-cli-support";

test("repositoryUrl", async t => {
  t.is(
    await repositoryUrl(import.meta.dirname + "/.."),
    "https://github.com/arlac77/repository-provider-cli-support.git"
  );
});
