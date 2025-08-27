import React, { ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import Loader from '@/utils/loader';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {

    return (
        <>
            <Header />
            {children}
            <Loader />
            <Footer />
        </>
    );
};

export default Layout;