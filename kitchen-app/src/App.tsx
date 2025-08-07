import React from 'react';
import Button from './components/Button';

function App() {
  const handleClick = () => {
    alert('Button clicked!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
          Kitchen App
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Welcome to your React app with TypeScript and TailwindCSS!
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={handleClick}>
            Primary Button
          </Button>
          <Button variant="secondary" onClick={handleClick}>
            Secondary Button
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
