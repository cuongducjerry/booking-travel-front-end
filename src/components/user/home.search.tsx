import { useEffect, useState } from "react";
import { DatePicker, Dropdown, Input } from "antd";
import "styles/components/home.search.scss";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { getPropertyTypesAPI } from "@/services/api";

const locations = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Nha Trang", "Phú Quốc"];

const HomeSearch = () => {
  const navigate = useNavigate();
  const [where, setWhere] = useState("");
  const [checkIn, setCheckIn] = useState<any>(null);
  const [checkOut, setCheckOut] = useState<any>(null);
  const [guests, setGuests] = useState(1);
  const [openWhere, setOpenWhere] = useState(false);
  const [openGuest, setOpenGuest] = useState(false);

  const [types, setTypes] = useState<IPropertyType[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [openType, setOpenType] = useState(false);

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await getPropertyTypesAPI({ page: 0, size: 20 });
      setTypes(res.data?.result || []);
    };
    fetchTypes();
  }, []);

  const filteredLocations = locations.filter((l) =>
    l.toLowerCase().includes(where.toLowerCase()),
  );

  const onSearch = () => {
    navigate({
      pathname: "/search",
      search: new URLSearchParams({
        address: where,
        guests: String(guests),
        checkIn: checkIn ? dayjs(checkIn).format("YYYY-MM-DD") : "",
        checkOut: checkOut ? dayjs(checkOut).format("YYYY-MM-DD") : "",
        type: selectedType,
      }).toString(),
    });
  };

  return (
    <div className="airbnb-search">
      {/* WHERE */}
      <Dropdown
        trigger={["click"]}
        open={openWhere}
        onOpenChange={setOpenWhere}
        dropdownRender={() => (
          <div className="dropdown-box">
            {filteredLocations.map((item) => (
              <div
                key={item}
                className="dropdown-item"
                onClick={() => {
                  setWhere(item);
                  setOpenWhere(false);
                }}
              >
                {item}
              </div>
            ))}
            {!filteredLocations.length && (
              <div className="dropdown-empty">Not found</div>
            )}
          </div>
        )}
      >
        <div
          className={`search-section ${openWhere ? "active" : ""}`}
          onClick={() => setOpenWhere(true)}
        >
          <span className="label">Where</span>
          <Input
            className="value-input"
            placeholder="Search destinations"
            value={where}
            onChange={(e) => setWhere(e.target.value)}
            bordered={false}
          />
        </div>
      </Dropdown>

      <div className="divider" />

      {/* TYPE */}
      <Dropdown
        trigger={["click"]}
        open={openType}
        onOpenChange={setOpenType}
        dropdownRender={() => (
          <div className="dropdown-box">
            {types.map((item) => (
              <div
                key={item.id}
                className="dropdown-item"
                onClick={() => {
                  setSelectedType(item.name);
                  setOpenType(false);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      >
        <div
          className={`search-section ${openType ? "active" : ""}`}
          onClick={() => setOpenType(true)}
        >
          <span className="label">Property Type</span>
          <p className="value">{selectedType || "Select type"}</p>
        </div>
      </Dropdown>

      <div className="divider" />

      {/* WHEN */}
      <div className="search-section date-section">
        <span className="label">When</span>
        <div className="date-group">
          <DatePicker
            placeholder="Check in"
            value={checkIn}
            onChange={setCheckIn}
            format="DD-MM-YYYY"
            getPopupContainer={() => document.body}
          />

          <DatePicker
            placeholder="Check out"
            value={checkOut}
            onChange={setCheckOut}
            format="DD-MM-YYYY"
            getPopupContainer={() => document.body}
          />
        </div>
      </div>

      <div className="divider" />

      {/* WHO */}
      <Dropdown
        trigger={["click"]}
        open={openGuest}
        onOpenChange={setOpenGuest}
        dropdownRender={() => (
          <div className="dropdown-box">
            <div className="guest-row">
              <span>Guests</span>
              <div className="guest-control">
                <button onClick={() => setGuests(Math.max(1, guests - 1))}>
                  −
                </button>
                <b>{guests}</b>
                <button onClick={() => setGuests(guests + 1)}>+</button>
              </div>
            </div>
          </div>
        )}
      >
        <div
          className={`search-section ${openGuest ? "active" : ""}`}
          onClick={() => setOpenGuest(true)}
        >
          <span className="label">Who</span>
          <p className="value">
            {guests} guest{guests > 1 && "s"}
          </p>
        </div>
      </Dropdown>

      {/* SEARCH */}
      <button className="search-btn" onClick={onSearch}>
        🔍 <span>Search</span>
      </button>
    </div>
  );
};

export default HomeSearch;
