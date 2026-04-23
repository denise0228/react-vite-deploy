import { useRef, useState, useEffect } from 'react'
import TicTac from './TicTac.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <TicTac />
    </>
  )
}

export default App
