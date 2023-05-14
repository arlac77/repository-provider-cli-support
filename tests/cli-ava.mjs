import test from "ava";
import { program } from "commander";
import {
  initializeRepositoryProvider,
  initializeCommandLine
} from "repository-provider-cli-support";

test("initializeCommandLine", async t => {
  initializeCommandLine(program);

  const { provider } = await initializeRepositoryProvider(program);

  t.is(provider.name, "aggregation");
});
