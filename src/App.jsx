import Blog from '@components/Blog/Blog';
import HomePage from '@components/Homepage/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import routers from '@/routers/routers';
import { Suspense } from 'react';
import { SideBarProvider } from '@/context/SideBarProvider';
import SideBar from '@components/SideBar/SideBar';
import { ToastProvider } from '@/context/ToastProvider';
import { StoreProvider } from '@/context/storeProvider';

function App() {
    return (
        <StoreProvider>
            <ToastProvider>
                <SideBarProvider>
                    <BrowserRouter>
                        <SideBar />
                        <Suspense fallback={<div>Loading...</div>}>
                            <Routes>
                                {routers.map((item, index) => {
                                    return (
                                        <Route
                                            key={index}
                                            path={item.path}
                                            element={<item.component />}
                                        />
                                    );
                                })}
                            </Routes>
                        </Suspense>
                    </BrowserRouter>
                </SideBarProvider>
            </ToastProvider>
        </StoreProvider>
    );
}

export default App;
