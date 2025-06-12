import React from 'react';
import WorkspaceHub from './components/WorkspaceHub';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <WorkspaceHub />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
}

export default App;