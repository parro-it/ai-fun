for mod in `cat ~/repos/ai-fun/scripts/module-list`; do
  cd ~/repos/$mod;
  git pull;
  npm install;
  npm test;
  git config user.email andrea@parro.it;
done
