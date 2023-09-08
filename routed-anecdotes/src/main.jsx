import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { useState } from 'react'

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    console.log('hello')
    if(!event) return setValue('')
    setValue(event.target.value)
  }

  // I love all of you guys bye bye

  return {
    type,
    value,
    onChange,
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)