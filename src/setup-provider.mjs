import AggregationProvider from "aggregation-repository-provider";
import { ETagCacheLevelDB } from "etag-cache-leveldb";
import levelup from "levelup";
import leveldown from "leveldown";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";
import { Agent } from "node:https";

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

async function createCache() {
  const dir = join(homedir(), ".cache/repository-provider");
  await mkdir(dir, { recursive: true });
  const db = await levelup(leveldown(dir));
  return new ETagCacheLevelDB(db);
}

const httpsAgent = new Agent({ keepAlive: true });

/**
 * 
 * @param {*} program 
 * @param {Object} properties 
 * @returns {Promise<{provider: AggregationProvider, options: Object, cache: ETagCacheLevelDB|undefined}>}
 */
export async function initializeRepositoryProvider(program, properties) {
  const provider = await AggregationProvider.initialize(
    [],
    properties,
    process.env
  );

  const options = program.opts();

  // @ts-ignore
  provider.messageDestination = {
    ...console,
    trace: options.trace ? console.log : () => {}
  };

  let cache;
  if (options.cache) {
    cache = await createCache();
    provider._providers.forEach(p => (p.cache = cache));
  }

  provider._providers.forEach(p => (p.agent = url => httpsAgent));

  return { provider, options, cache };
}

/**
 * Add extra cli options.
 * @param {*} program 
 */
export function initializeCommandLine(program) {
  program
    .option("--no-cache", "cache requests")
    .option("--statistics", "show cache statistics");
}
