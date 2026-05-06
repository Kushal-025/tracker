import { use, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {

  const [counter, setCounter] = useState(15);
  const addValue = () => {
    console.log("Button clicked", counter);
    if (counter < 30) {
      setCounter(counter + 1);
    }
  }
  const subtractValue = () => {
    console.log("Button clicked", counter);
    if (counter > 0) {
      setCounter(counter - 1);
    }
  }
  return (
    <>
     <h1>kushal aur react</h1>
     <h2>Counter value: {counter}</h2>

     <button onClick={addValue}>Add value {counter}</button>
    <br />
     <button onClick={subtractValue}>Subtract value {counter}</button>
     <p>footer: {counter}</p>
    </>
  )
}

export default App
