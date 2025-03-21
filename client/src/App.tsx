import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Forum from "./components/forum/Forum";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <main>
                    <Forum />
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;