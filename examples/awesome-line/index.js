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

const readModuleNamesFromFile = compose(concat.obj, nonEmpty, moduleLines);

const buildDescriptor = name => {
  const description = execa("npm", ["view", name, "description"]).then(
    p => p.stdout
  );
  const homepage = execa("npm", ["view", name, "homepage"]).then(p => p.stdout);
  return props({ description, homepage, name });
};

async function awesomeLines() {
  const moduleNames = await readModuleNamesFromFile(
    `${__dirname}/../../scripts/module-list`
  );

  const moduleDescriptors = asfullfills(moduleNames.map(buildDescriptor));

  map(moduleDescriptors, ({ description, homepage, name }) => {
    console.log(`* [${name}](${homepage}) - ${description}`);
  });
}

awesomeLines().catch(err => console.error(err));
