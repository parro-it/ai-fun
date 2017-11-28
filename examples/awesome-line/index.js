import { fs } from "ai-node";
import lines from "ai-lines";
import concat from "ai-concat";
import map from "ai-map";
import filter from "ai-filter";
import execa from "execa";

const moduleLines = lines(
  fs.readFile(`${__dirname}/../../scripts/module-list`, "utf8")
);

const moduleNames = filter(Boolean, moduleLines);

const infos = map(moduleNames, name => {
  const description = execa("npm", ["view", name, "description"]).then(
    p => p.stdout
  );
  const homepage = execa("npm", ["view", name, "homepage"]).then(p => p.stdout);
  return Promise.all([description, homepage, name]);
});

const objs = map(infos, ([description, homepage, name]) => {
  return { description, homepage, name };
});

const awesomeLines = map(objs, ({ description, homepage, name }) => {
  return `* [${name}](${homepage}) - ${description}`;
});

concat.obj(awesomeLines).then(lines => {
  console.log(lines.join("\n"));
});
