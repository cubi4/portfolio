import './App.css'
import { Button } from './components/ui/button'

function App() {

  return (
      <>
          <div className="flex min-h-svh flex-col items-center justify-center">
              <h1 className="text-4xl font-bold">Welcome to my Website</h1>
              <p className="text-lg pb-4">This is a simple website built with React and Tailwind CSS.</p>
              <Button>Click me</Button>
          </div>
      </>
  );
}

export default App
