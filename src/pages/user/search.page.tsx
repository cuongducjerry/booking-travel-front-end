import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchHomeProperties } from "@/services/api";
import PropertyList from "components/user/search/property.list";
import PropertyMap from "@/components/user/map/property.map";
import "styles/pages/search.scss";

const SearchPage = () => {
  const [params] = useSearchParams();

  const [data, setData] = useState<IPropertyResponse | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const [meta, setMeta] = useState({
    current: 1,
    pageSize: 8,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const res = await fetchHomeProperties({
        address: params.get("address") || undefined,
        guests: params.get("guests")
          ? Number(params.get("guests"))
          : undefined,
        checkIn: params.get("checkIn") || undefined,
        checkOut: params.get("checkOut") || undefined,
        page: meta.current - 1, 
        size: meta.pageSize,
      });

      setData(res.data);
      setLoading(false);
    };

    fetchData();
  }, [params, meta.current, meta.pageSize]);

  return (
    <div className="search-page">
      {/* LEFT */}
      <div className="search-left">
        <PropertyList
          properties={data?.result || []}
          loading={loading}
          total={data?.meta.total || 0}
          page={meta.current}
          pageSize={meta.pageSize}
          onPageChange={(page, pageSize) =>
            setMeta({ current: page, pageSize })
          }
        />
      </div>
    </div>
  );
};

export default SearchPage;
