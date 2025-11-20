import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast'; 

function App() {
  return (
   <div className="min-h-screen bg-gray-50">
     
      <Toaster position="top-right" />
      
      <Routes>
      
       
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
       
        
      
      </Routes>
    </div>
  );
  
}

export default App;