import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.scss'
import CodeEditor from './code-editor/CodeEditor'

function App() {
  const [code, setCode] = useState('');

  return (
    <CodeEditor
      value={code}
      editorType="FORMULA"
      autoComplete={[
        { label: "table_one", type: "keyword" },
        { label: "table_two", type: "keyword" },
        { label: "table_two_123", type: "keyword" },
        {
          label: "明细表1",
          type: "keyword",
          applyLabel: "明细表1",
          children: [
            { label: "AAA", type: "keyword" },
            { label: "BBB", type: "keyword" },
          ],
        },
      ]}
      keywordMatching={[
        {
          label: "hhhh",
          attributes: {
            style: 'color: red; cursor: pointer',
            'aria-click': true,
            'title': '不支持',
            'data-mach': 'match',
          },
          className: 'hhhh field',
          inclusive: true,
        }
      ]}
      inclusive={true}
    />
    // <>
    //   <div>
    //     <a href="https://vite.dev" target="_blank">
    //       <img src={viteLogo} className="logo" alt="Vite logo" />
    //     </a>
    //     <a href="https://react.dev" target="_blank">
    //       <img src={reactLogo} className="logo react" alt="React logo" />
    //     </a>
    //   </div>
    //   <h1>Vite + React</h1>
    //   <div className="card">
    //     <button onClick={() => setCount((count) => count + 1)}>
    //       count is {count}
    //     </button>
    //     <p>
    //       Edit <code>src/App.jsx</code> and save to test HMR
    //     </p>
    //   </div>
    //   <p className="read-the-docs">
    //     Click on the Vite and React logos to learn more
    //   </p>
    // </>
  )
}

export default App
