import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Forum from "./components/forum/Forum";
import {ForumType} from "./types/Types";
import UserProfile from "./components/user/UserProfile";

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Header />
                <main>
                    <Routes>
                        <Route path="/explore" element={<Forum type={ForumType.ALL_POSTS} />} />
                        <Route path="/profile" element={<UserProfile />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}

export default App;