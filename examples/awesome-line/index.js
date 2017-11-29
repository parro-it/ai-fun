import { fs } from "ai-node";
import lines from "ai-lines";
import concat from "ai-concat";
import map from "ai-map";
import filter from "ai-filter";
import asfullfills from "ai-asfullfills";
import execa from "execa";
import compose from "compose-function";
import props from "p-props";

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
  map.with(buildDescriptor),
  filterNonEmpty,
  readModuleNamesFromFile
);

async function awesomeLines() {
  await readModules(`${__dirname}/../../scripts/module-list`);
}

awesomeLines().catch(err => console.error(err));
