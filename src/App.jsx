import { useState } from "react";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="oll">
      <h1>SyskenBookRental</h1>
      <div className="bookInput">
        <input placeholder="検索" />
        <p>書籍検索</p>
      </div>
      <div className="hogeButton">
        <button>バーコード読み込み</button>
        <button>バーコード読み込み</button>
        <button>書籍一覧</button>
      </div>
      <img className="icon" src="src/sys.PNG"></img>
    </div>
  );
}

export default App;
