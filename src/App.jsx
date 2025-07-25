import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.scss'
import CodeEditor from './code-editor/CodeEditor'

function App() {
  const [code, setCode] = useState('');

  return (
    <div className="root-editor-container">
      <CodeEditor
        value={code}
        editorType="JS"
      />
    </div>
  )
}

export default App
