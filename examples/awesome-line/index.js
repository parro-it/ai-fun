import { fs } from "ai-node";
import lines from "ai-lines";
import concat from "ai-concat";
import map from "ai-map";
import filter from "ai-filter";
import asfullfills from "ai-asfullfills";
import execa from "execa";
import compose from "compose-function";
import props from "p-props";
import { resolve } from "path";
import { unthisAll } from "unthis";
import fromStream from "ai-from-stream";
// import log from "ai-log";

const array = unthisAll(Array.prototype);
const programArgs = array.slice(2, undefined);
const configArg = array.find(arg => arg.startsWith("--config="));
const filterModuleNames = array.filter(arg => !arg.startsWith("--"));

const readConfigValue = option => option && option.split("=")[1];
const configFile = compose(readConfigValue, configArg, programArgs);
const moduleNameArgs = compose(filterModuleNames, programArgs);

const readModuleNamesFromFile = file => lines(fs.readFile(file, "utf8"));
const filterNonEmpty = filter.with(line => {
  return line !== "";
});

const runNpm = args => execa("npm", args).then(p => p.stdout);

const buildDescriptor = name => {
  const description = runNpm(["view", name, "description"]);
  const homepage = runNpm(["view", name, "homepage"]);
  return { description, homepage, name };
};

const logLine = ({ description, homepage, name }) => {
  console.log(`* [${name}](${homepage}) - ${description}`);
};

const awaitDescriptors = async iterable =>
  (await concat.obj(iterable)).map(props);

const readModules = compose(
  map.with(logLine),
  asfullfills,
  awaitDescriptors,
  map.with(buildDescriptor)
);

const readModulesFromConfig = compose(
  readModules,
  filterNonEmpty,
  readModuleNamesFromFile
);

const decodeFrom = encoding => map.with(chunk => chunk.toString(encoding));
const decode = (iterable, encoding) => decodeFrom(encoding)(iterable);
decode.with = decodeFrom;

const readModulesFromStream = compose(
  readModules,
  // log("filterNonEmpty"),
  filterNonEmpty,
  lines,
  decode.with("utf8"),
  // log("fromStream"),
  fromStream
);

const readModulesFromArgs = compose(readModules, moduleNameArgs);

async function awesomeLines() {
  const config = configFile(process.argv);
  if (config) {
    readModulesFromConfig(resolve(config));
  }

  readModulesFromArgs(process.argv);

  readModulesFromStream(process.stdin);
}

awesomeLines().catch(err => console.error(err));
