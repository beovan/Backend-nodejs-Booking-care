Công nghệ sử dụng ?
✔ Frontend: Reactjs + Redux. HTML/CSS-scss/Bootstrap4 (reactrap)
✔ Backend: Node.js (Express) + MySql (Sequelize)
//Cài công nghệ
👉 npm install --save body-parser@1.19.0 dotenv@8.2.0 ejs@3.1.5 express@4.17.1

👉 npm install --save-dev @babel/core@7.12.10 @babel/preset-env@7.12.10 
@babel/node@7.12.10 nodemon@2.0.7

👍 Chạy project === câu lệnh này:  npm start
//



🐱‍🏍Các câu lệnh mình sử dụng trong video:
👉 1. Cài đặt các thư viện: sequlize-cli, sequelize và mysql2
npm install --save-dev sequelize-cli@6.2.0
npm install --save mysql2@2.2.5
npm install --save sequelize@6.6.2

👉 2. Thêm file .sequelizerc tại thư mục root
Nội dung file .sequelizerc
const path = require('path');
module.exports = {
  'config': path.resolve('./src/config', 'config.json'),
  'migrations-path': path.resolve('./src', 'migrations'),
  'models-path': path.resolve('./src', 'models'),
  'seeders-path': path.resolve('./src', 'seeders')
}

👉 Tại thư mục root, sử dụng câu lệnh: node_modules/.bin/sequelize init
hoặc vào thư mục src chạy lệnh: npx sequelize-cli init.
👉 3. Tạo model: 
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string

👉 4: Tạo migrations:
npx sequelize-cli db:migrate

👉5. Tạo Seeder: npx sequelize-cli seed:generate --name demo-user
