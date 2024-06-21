export PATH=$PATH:/home/ubuntu/.nvm/versions/node/v22.3.0

cd Notes-App-Backend
 git pull origin master
 cd server
 pm2 kill
 pm2 start src/index.js