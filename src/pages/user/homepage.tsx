import Header from "@/components/layout/app.header";
import Footer from "@/components/layout/app.footer";
import "styles/pages/home.scss";
import { useEffect } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import HomeSearch from "@/components/user/homesearch";

const HomePage = () => {
  const { user } = useCurrentApp();

  useEffect(() => {
    console.log("User in context:", user);
  }, [user]);

  return (
    <>
      <Header />

      <main className="home">
        <section className="hero">
          <h1>Find your next stay</h1>
          <p>Search deals on hotels, homes, and much more...</p>

          <HomeSearch/>
        </section>

        <section className="property-list">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="property-card">
              <img src="https://picsum.photos/300/200" />
              <h3>Luxury Apartment</h3>
              <p>Hà Nội, Việt Nam</p>
              <span>$120 / night</span>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;

