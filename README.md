📌 ISP Form Management System

This project is a full-stack ISP (Internet Service Provider) Form Management System.
It consists of:

Frontend (React + Vite) → User-facing form for collecting customer data

Backend (Node.js + Express + Sequelize + PostgreSQL) → API for storing and retrieving form data

🚀 Features

Customer form with validation (personal, service, payment, declaration, office use)

Digital signature capture (SignatureCanvas)

Unique form ID generation

RESTful API to store and retrieve form data

PostgreSQL database with Sequelize ORM

Modular, clean code structure

📂 Project Structure
ispform/
│── ispformfrontend/         # React frontend
│   ├── src
│   │   ├── components/       # Form UI components
│   │   ├── services/         # API service
│   │   └── utils/            # Constants
│   └── ...                  # Vite + React setup
│
│── ispformbackend/          # Node.js backend
│   ├── src
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Sequelize models
│   │   └── routes/           # API routes
│   ├── config/              # Database config
│   └── server.js            # Express entry point

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/your-username/ispform.git
cd ispform

2️⃣ Setup Backend (API)
cd ispformbackend
npm install


Create a .env file:

PORT=5000
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ispform
DB_DIALECT=postgres


Run server:

npm start


API will run on → http://localhost:5000

3️⃣ Setup Frontend (React)
cd ispformfrontend
npm install
npm run dev


Frontend will run on → http://localhost:5173

🔌 API Endpoints (Backend)
Method	Endpoint	Description
POST	/api/forms	Submit new form
GET	/api/forms/:id	Get form by unique ID

🛠️ Tech Stack
Frontend

React + Vite

Tailwind CSS , CSS(if styled further)

Backend

Node.js + Express

Sequelize ORM

PostgreSQL

📜 License

This project is for internal ISP form management use. Modify as per requirements.