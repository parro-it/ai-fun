for mod in `cat module-list`; do
  git clone "https://github.com/parro-it/$mod" ~/Desktop/repos/$mod;
  cd ~/Desktop/repos/$mod;
  npm install;
  npm test;
  git config user.email andrea@parro.it;
done
