📌 ISP Form Frontend

This is the frontend application for managing ISP (Internet Service Provider) customer forms.
It is built using React and communicates with the backend via API calls.

🚀 Features

Customer form with validation (personal details, address, service, payment, etc.)

Digital signature support (SignatureCanvas)

Unique ID generation for each form

Submits form data to backend API

Displays submitted form details (FormView)

Organized code structure with reusable components

📂 Project Structure
src/
│   App.css              # Global styles
│   App.jsx              # Root React component
│   index.css            # Base CSS
│   main.jsx             # Entry point for React
│
├───assets
│       react.svg        # Static assets
│
├───components
│       CustomerForm.jsx     # Main customer form
│       FormView.jsx         # View submitted form data
│       SignatureCanvas.jsx  # Signature capture component
│
├───services
│       api.js           # Handles API requests
│
└───utils
        constants.js     # App-wide constants

⚙️ Installation & Setup

Clone the repository

git clone https://github.com/your-username/ispform-frontend.git
cd ispform-frontend


Install dependencies

npm install


Start the development server

npm run dev


The app will run at: http://localhost:5173
 (Vite default)

🔌 API Integration

All API calls are managed in src/services/api.js.

Update the API base URL inside api.js to point to your backend server.

🛠️ Scripts

npm run dev → Start development server

npm run build → Build production-ready app

npm run preview → Preview production build locally

📜 License

This project is for internal ISP form management use. Modify as per your needs.