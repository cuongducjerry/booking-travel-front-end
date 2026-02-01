import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import Footer from "components/layout/app.footer";
import 'styles/globals/layout.scss';

function Layout() {
    return (
        <div className="app-layout">
            <AppHeader />
            <main className="app-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout;