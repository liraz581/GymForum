import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import './App.css';

import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Header from './components/header/Header';
import Forum from "./components/forum/Forum";
import UserProfile from "./components/user/UserProfile";

import {ForumType} from "./types/Types";
import { ROUTES } from './components/gloabls/Constants';

const Layout = () => {
    return (
        <div className="App">
            <Header />
            <main>
                <Outlet />
            </main>
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path="/" element={<Layout />}>
                    <Route index element={<Navigate to={ROUTES.EXPLORE} replace />} />
                    <Route path={ROUTES.EXPLORE} element={<Forum type={ForumType.ALL_POSTS} />} />
                    <Route path={ROUTES.PROFILE} element={<UserProfile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;