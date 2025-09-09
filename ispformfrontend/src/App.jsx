import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import CustomerForm from './components/CustomerForm';
import FormView from './components/FormView';
import { formAPI } from './services/api';
import './App.css';

// Component to handle form viewing by URL (READ-ONLY)
const FormViewer = () => {
  const { uniqueId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const loadFormData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching form data for ID:', uniqueId);
        const response = await formAPI.getForm(uniqueId);
        
        console.log('Received form data:', response.data);
        // Extract the actual form data from the response
        setFormData(response.data.data);
      } catch (err) {
        console.error('Failed to load form data:', err);
        setError(err.response?.data?.message || err.message || 'Form not found');
      } finally {
        setLoading(false);
      }
    };

    if (uniqueId) {
      loadFormData();
    }
  }, [uniqueId]);

  const handleBackToForm = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        textAlign: 'center' 
      }}>
        <h2>Loading form data...</h2>
        <p>Please wait while we fetch the form data for ID: {uniqueId}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        textAlign: 'center' 
      }}>
        <h2 style={{ color: '#dc3545' }}>Error Loading Form</h2>
        <p>Could not load form with ID: {uniqueId}</p>
        <p style={{ color: '#6c757d' }}>{error}</p>
        <button onClick={handleBackToForm} style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          ← Back to New Form
        </button>
      </div>
    );
  }

  // This is the key fix - render FormView (read-only) not CustomerForm (editable)
  return <FormView formData={formData} onBackToForm={handleBackToForm} />;
};

// Home component for the form (EDITABLE)
const Home = () => {
  const navigate = useNavigate();

  const handleFormSubmit = (formData) => {
    // After successful submission, navigate to the form view
    if (formData.uniqueId) {
      navigate(`/${formData.uniqueId}`);
    }
  };

  // This renders the editable form
  return <CustomerForm onFormSubmit={handleFormSubmit} />;
};

// Main App component with routing
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home route - shows editable form */}
          <Route path="/" element={<Home />} />
          {/* View route - shows read-only form data */}
          <Route path="/:uniqueId" element={<FormViewer />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;