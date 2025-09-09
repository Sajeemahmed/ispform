📌 ISP Form Backend

This is the backend service for managing ISP (Internet Service Provider) customer forms.
It is built with Node.js, Express, Sequelize, and PostgreSQL.

🚀 Features

RESTful API for handling customer form submissions

Sequelize ORM for PostgreSQL database management

Organized MVC structure (controllers, models, routes)

Handles customer details, installation address, service details, payment details, declaration, and office use data

Easy integration with frontend (ispformfrontend)

📂 Project Structure
ispformbackend/
│── src
│   ├── controllers
│   │    └── formController.js     # Handles form-related logic
│   ├── models
│   │    ├── Customer.js           # Customer details model
│   │    ├── Declaration.js        # Declaration model
│   │    ├── InstallationAddress.js# Address model
│   │    ├── OfficeUse.js          # Office use data model
│   │    ├── PaymentDetails.js     # Payment details model
│   │    ├── ServiceDetails.js     # Service details model
│   │    └── index.js              # Sequelize model loader
│   └── routes
│        └── forms.js              # Routes for form APIs
│
│── config
│    └── database.js               # Database connection (PostgreSQL + Sequelize)
│
└── server.js                      # Entry point, Express app

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/ispform-backend.git
cd ispform-backend


Install dependencies

npm install


Configure environment variables
Create a .env file in the root directory and add:

PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ispform
DB_DIALECT=postgres


Run database migrations (if needed)

npx sequelize-cli db:migrate


Start the server

npm run dev


The API will run at: http://localhost:5000

🔌 API Endpoints
Method	Endpoint	Description
POST	/api/forms	Submit new form
GET	/api/forms/:id	Get form by unique ID
GET	/api/forms	Get all forms (optional)
🛠️ Tech Stack

Node.js – Server runtime

Express – Web framework

Sequelize – ORM for PostgreSQL

PostgreSQL – Database

📜 License

This project is for internal ISP form management use. Modify as needed.