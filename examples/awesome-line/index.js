import { fs } from "ai-node";
import lines from "ai-lines";
import concat from "ai-concat";
import map from "ai-map";
import filter from "ai-filter";
import asfullfills from "ai-asfullfills";
import execa from "execa";
import compose from "compose-function";
import props from "p-props";

const moduleLines = file => lines(fs.readFile(file, "utf8"));
const nonEmpty = filter.with(line => {
  return line !== "";
});

const buildDescriptor = name => {
  const description = execa("npm", ["view", name, "description"]).then(
    p => p.stdout
  );
  const homepage = execa("npm", ["view", name, "homepage"]).then(p => p.stdout);
  return { description, homepage, name };
};

const logLines = async iterable =>
  map(await iterable, ({ description, homepage, name }) => {
    console.log(`* [${name}](${homepage}) - ${description}`);
  });

const awaitDescriptors = async iterable =>
  asfullfills((await concat.obj(iterable)).map(props));

const readModules = compose(
  logLines,
  awaitDescriptors,
  map.with(buildDescriptor),
  nonEmpty,
  moduleLines
);

async function awesomeLines() {
  await readModules(`${__dirname}/../../scripts/module-list`);
}

awesomeLines().catch(err => console.error(err));
