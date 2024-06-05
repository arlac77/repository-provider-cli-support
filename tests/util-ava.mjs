import test from "ava";
import { repositoryUrl } from "repository-provider-cli-support";

test("repositoryUrl", async t => {
  t.true(
    (await repositoryUrl(import.meta.dirname + "/.."))?.startsWith(
      "https://github.com/arlac77/repository-provider-cli-support"
    )
  );
});
