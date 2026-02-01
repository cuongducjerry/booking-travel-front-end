import Header from "@/components/layout/app.header";
import Footer from "@/components/layout/app.footer";
import "styles/pages/home.scss";
import { useEffect, useState } from "react";
import HomeSearch from "@/components/user/home.search";
import { fetchHomeProperties } from "@/services/api";
import HomePropertySlider from "@/components/user/home.property.slider";
import { Divider } from "antd";

const HomePage = () => {
  const [villas, setVillas] = useState<IProperty[]>([]);
  const [homes, setHomes] = useState<IProperty[]>([]);
  const [resorts, setResorts] = useState<IProperty[]>([]);
  const [apartments, setApartments] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [
        villaRes,
        resortRes,
        homeRes,
        apartmentRes,
      ] = await Promise.all([
        fetchHomeProperties({ page: 0, size: 8, propertyType: 'Villa' }),
        fetchHomeProperties({ page: 0, size: 8, propertyType: 'Resort' }),
        fetchHomeProperties({ page: 0, size: 8, propertyType: 'Homestay' }),
        fetchHomeProperties({ page: 0, size: 8, propertyType: 'Apartment' }),
      ]);

      setVillas(villaRes.data?.result || []);
      setResorts(resortRes.data?.result || []);
      setHomes(homeRes.data?.result || []);
      setApartments(apartmentRes.data?.result || []);
    };

    load();
  }, []);

  return (
    <>
      <main className="home">
        {/* HERO */}
        <section className="hero">
          <h1>Find your next stay</h1>
          <p>Search deals on hotels, homes, and much more...</p>
          <HomeSearch />
        </section>

        {/* SLIDER */}
        <section className="property-slider">
          <div className="property-slider-container">
            {loading ? <p>Loading...</p> :
              <HomePropertySlider
                title="Villa"
                properties={villas}
              />}
          </div>
        </section>
        <Divider />
        <section className="property-slider">
          <div className="property-slider-container">
            {loading ? <p>Loading...</p> :
              <HomePropertySlider
                title="Homes"
                properties={homes}
              />}
          </div>
        </section>
        <Divider />
        <section className="property-slider">
          <div className="property-slider-container">
            {loading ? <p>Loading...</p> :
              <HomePropertySlider
                title="Resorts"
                properties={resorts}
              />}
          </div>
        </section>
        <Divider />
        <section className="property-slider">
          <div className="property-slider-container">
            {loading ? <p>Loading...</p> :
              <HomePropertySlider
                title="Apartments"
                properties={apartments}
              />}
          </div>
        </section>
        <Divider />
      </main>
    </>
  );
};

export default HomePage;
