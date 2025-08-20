import './App.css'
import Home from './components/home';

function App() {

  return (
      <>
          <div className="flex min-h-svh flex-col items-center justify-center">
              <h1 className="text-4xl font-bold">Welcome to my Website</h1>
              <Home />
          </div>
      </>
  );
}

export default App
