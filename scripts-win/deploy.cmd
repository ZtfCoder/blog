@ECHO OFF



cmd /cyarn docs:build

cd docs/.vitepress/dist
git init
git add --all
git commit -m 'deploy'
git remote add origin https://github.com/ZtfCoder/ZtfCoder.github.io.git
git push -u origin master
