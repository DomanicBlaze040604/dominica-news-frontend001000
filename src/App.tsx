const App = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', color: '#1f2937', marginBottom: '1rem' }}>
          🏝️ Dominica News
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
          Application is working! ✅
        </p>
        <div style={{ fontSize: '0.875rem', color: '#9ca3af' }}>
          Server running on localhost:3000
        </div>
      </div>
    </div>
  );
};

export default App;