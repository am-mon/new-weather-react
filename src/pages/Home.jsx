import React, { useEffect, useState } from "react";
import Loader from "../components/Loader";
import { BsExclamationCircle } from "react-icons/bs";
import HistoryItemCard from "../components/HistoryItemCard";
import { ImBin } from "react-icons/im";
import ScrollToTop from "../components/ScrollToTop";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryName, setSelectedCountryName] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [localTime, setLocalTime] = useState("");

  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory =
      JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];
    setHistory(storedHistory);
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries");
      const data = await res.json();
      console.log("data", data);
      setCountries(data.data);
    };
    fetchCountries();
  }, []);

  const handleSelectCountry = (e) => {
    const iso2 = e.target.value;
    setWeather(null);
    if (iso2 === "") {
      setSelectedCountry("");
      setSelectedCountryName("");
      setCities([]);
      setSelectedCity("");
      setError("");
      setWeather(null);
      return;
    }

    const result = countries.find((c) => c.iso2 === iso2);
    if (result) {
      setSelectedCountry(iso2);
      setSelectedCountryName(result.country);
      setCities(result.cities);
      setSelectedCity("");
      setError("");
    }
  };

  const handleSelectCity = (e) => {
    setSelectedCity(e.target.value);
    setError("");
    setWeather(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCity || !selectedCountry) {
      setError("Please select both country and city.");
      return;
    }

    const api_key = "1baf41538ffb1d7b4b5560b86ccc414b";
    const countryCodeLower = selectedCountry.toLowerCase();

    try {
      setLoading(true);

      await new Promise((resolve) => setTimeout(resolve, 600));

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          selectedCity
        )},${countryCodeLower}&appid=${api_key}&units=metric`
      );

      const data = await res.json();

      if (res.ok) {
        console.log("weather", data);
        setWeather(data);
        setError(null);

        // Checking if DST is active in the UK
        const isDST = new Date().getHours() === new Date().getUTCHours() + 1;
        const localTimeInOtherCountry = new Date(
          (data?.dt + data?.timezone) * 1000
        );
        const adjustedLocalTime = isDST
          ? new Date(localTimeInOtherCountry.getTime() - 60 * 60 * 1000)
          : localTimeInOtherCountry;
        setLocalTime(adjustedLocalTime.toLocaleString());

        const newHistoryItem = {
          country: selectedCountryName,
          city: selectedCity,
          icon: data.weather?.[0].icon,
          weather_desc: data.weather[0].description,
          temp: data.main.temp,
          feels_like: data.main.feels_like,
          humidity: data.main.humidity,
          wind: data.wind.speed,
          localTime: adjustedLocalTime.toLocaleString(),
          sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString(),
          sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString(),
        };

        const updatedHistory = [newHistoryItem, ...history].slice(0, 9); //Set to 9 items
        setHistory(updatedHistory);
        localStorage.setItem(
          "weatherSearchHistory",
          JSON.stringify(updatedHistory)
        );
      } else {
        setError(
          "The weather for this country or city is not available at the moment."
        );
        setWeather(null);
      }
    } catch (error) {
      alert("Failed to fetch weather data.");
      console.error(error);
      setError("Something went wrong while fetching the weather.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistoryItem = (itemToDelete) => {
    const filtered = history.filter((i) => i !== itemToDelete);
    setHistory(filtered);
    localStorage.setItem("weatherSearchHistory", JSON.stringify(filtered));
  };

  const handleDeleteAllHistoryItems = () => {
    setHistory([]);
    localStorage.setItem("weatherSearchHistory", JSON.stringify([]));
  };

  return (
    <div className="border-t-8 border-b-8 border-blue-300 min-h-[100vh]">
      <div className="max-w-[1100px] mx-auto px-5 mt-15 mb-18">
        <h1 className="text-blue-500 text-3xl md:text-4xl font-bold text-center mb-10">
          Find Current Weather
        </h1>
        <div className="bg-blue-100 shadow-sm px-5 py-7 md:p-10 rounded-2xl">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row flex-wrap justify-between items-center gap-3 md:gap-0"
          >
            <select
              value={selectedCountry}
              onChange={handleSelectCountry}
              className="w-full md:w-[40%] px-3 py-2 text-lg font-medium border-2 rounded-xl bg-white border-gray-500 outline-0 focus:border-blue-500"
            >
              <option value="">Select Country</option>
              {countries?.map((c) => (
                <option key={c.iso2} value={c.iso2}>
                  {c.country}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={handleSelectCity}
              className="w-full md:w-[40%] px-3 py-2 text-lg font-medium border-2 rounded-xl bg-white border-gray-500 outline-0 focus:border-blue-500"
            >
              <option value="">Select City</option>
              {cities?.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full md:w-[17%] px-5 py-2 text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl cursor-pointer"
            >
              Search
            </button>
          </form>
          {error && (
            <p className="text-pink-500 font-medium mt-6 flex gap-2 items-center text-sm md:text-base justify-center">
              <BsExclamationCircle className="text-2xl min-w-[30px] max-w-[30px]" />
              {error}
            </p>
          )}
        </div>

        {loading ? (
          <p className="text-center">
            <Loader />
          </p>
        ) : (
          <>
            {weather && (
              <div className="mt-8 shadow py-7 px-5 md:p-10 rounded-2xl bg-blue-600 text-white text-lg text-center">
                <div className="grid md:grid-cols-3 items-center md:gap-5">
                  <div className="mb-5 md:mb-0">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather?.[0].icon}@4x.png`}
                      alt={weather.weather[0].description}
                      className="mx-auto my-[-40px]"
                    />
                    <p className="text-xl mb-1 capitalize">
                      {weather.weather[0].description}
                    </p>
                    <h3 className="font-semibold text-xl">
                      {selectedCity}, {selectedCountryName}
                    </h3>
                  </div>
                  <div className="md:border-l-2 md:border-r-2 border-white px-5 md:p-5">
                    <p className="mb-2">
                      <b>Temperature:</b> {weather.main.temp}°C <br />
                      <b>Feels Like:</b> {weather.main.feels_like}°C
                    </p>
                    <p className="mb-2">
                      <b>Humidity:</b> {weather.main.humidity}%
                    </p>
                    <p className="mb-2">
                      <b>Wind:</b> {weather.wind.speed} m/s
                    </p>
                  </div>
                  <div className="px-5 md:p-5">
                    <p className="mb-2">
                      <b>Local Time:</b> {localTime.toLocaleString()}
                    </p>
                    <p className="mb-2">
                      <b>Sunrise:</b>{" "}
                      {new Date(
                        weather.sys.sunrise * 1000
                      ).toLocaleTimeString()}
                    </p>
                    <p className="mb-2">
                      <b>Sunset:</b>{" "}
                      {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* <pre className="mt-10">{JSON.stringify(weather, null, 2)}</pre> */}
          </>
        )}
      </div>

      {history.length > 0 && (
        <div className="bg-slate-200 py-15">
          <div className="max-w-[1100px] mx-auto px-5">
            <h2 className="text-gray-600 text-3xl md:text-4xl font-bold text-center mb-10">
              Search History
            </h2>
            <div className="grid md:grid-cols-3 gap-5">
              {history?.map((item, index) => (
                <HistoryItemCard
                  key={index}
                  item={item}
                  onDelete={handleDeleteHistoryItem}
                />
              ))}
            </div>

            <button
              onClick={handleDeleteAllHistoryItems}
              className="flex items-center justify-center gap-2 mx-auto mt-8 bg-gray-600 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-2xl cursor-pointer"
            >
              <ImBin className="text-lg" /> Clear All Items
            </button>
          </div>
        </div>
      )}

      <p className="my-10 text-center text-gray-500">
        © 2025 Mon. Learned React.
      </p>
      <ScrollToTop />
    </div>
  );
}
