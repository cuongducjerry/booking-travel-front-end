import Header from "@/components/layout/app.header";
import Footer from "@/components/layout/app.footer";
import "styles/pages/home.scss";
import { useEffect, useState } from "react";
import HomeSearch from "@/components/user/homesearch";
import { fetchHomeProperties } from "@/services/api";

const HomePage = () => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const res = await fetchHomeProperties({
        page: 0,
        size: 8,
      });
      setProperties(res.data?.result || []);
    } catch (error) {
      console.error("Fetch home properties error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="home">
        <section className="hero">
          <h1>Find your next stay</h1>
          <p>Search deals on hotels, homes, and much more...</p>

          <HomeSearch />
        </section>

        <section className="property-list">
          {loading && <p>Loading...</p>}

          {!loading && properties.map(item => (
            <div key={item.id} className="property-card">
              <img
                src={item.images[0] || "https://picsum.photos/300/200"}
                alt={item.title}
              />
              <h3>{item.title}</h3>
              <p>{item.address}</p>
              <span>${item.pricePerNight} / night</span>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </>
  );
};

export default HomePage;

