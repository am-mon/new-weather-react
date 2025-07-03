import { ImBin } from "react-icons/im";

export default function HistoryItemCard({ item, onDelete }) {
  return (
    <div className="relative text-center shadow bg-white rounded-2xl pt-8 pb-10 px-5">
      <button
        onClick={() => onDelete(item)}
        className="absolute z-[2] top-5 right-5 bg-gray-500 hover:bg-gray-700 text-white font-semibold p-2 rounded-xl cursor-pointer"
      >
        <ImBin className="text-lg" />
      </button>
      <h3 className="font-semibold text-xl relative z-[1] px-10">
        {item.city}, <span className="whitespace-nowrap">{item.country}</span>
      </h3>
      <img
        src={`https://openweathermap.org/img/wn/${item.icon}@4x.png`}
        alt={item.weather_desc}
        className="mx-auto my-[-40px] relative z-0"
      />
      <p className="text-xl mb-3 capitalize">{item.weather_desc}</p>
      <p>
        <b>Temperature:</b> {item.temp}°C
      </p>
      <p>
        <b>Feels Like:</b> {item.feels_like}°C
      </p>
      <p>
        <b>Humidity:</b> {item.humidity}%
      </p>
      <p>
        <b>Wind:</b> {item.wind} m/s
      </p>
      <p>
        <b>Local Time:</b> {item.localTime}
      </p>
      <p>
        <b>Sunrise:</b> {item.sunrise}
      </p>
      <p>
        <b>Sunset:</b> {item.sunset}
      </p>
    </div>
  );
}
