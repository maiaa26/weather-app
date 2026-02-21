const API_BASE = "https://weather-proxy.freecodecamp.rocks/api/city/";

function $(id) {
  return document.getElementById(id);
}

function isDefined(value) {
  return value !== undefined && value !== null;
}

function setText(id, value) {
  const el = $(id);
  if (!el) return;
  el.textContent = isDefined(value) ? String(value) : "N/A";
}

function setIcon(src) {
  const img = $("weather-icon");
  if (!img) return;
  if (isDefined(src) && String(src).trim() !== "") {
    img.src = String(src);
  } else {
    img.removeAttribute("src");
  }
}

function applyThemeFromData(data) {
  const body = document.body;

  body.classList.remove(
    "theme-sunny",
    "theme-cloudy",
    "theme-rainy",
    "theme-snowy",
    "theme-stormy"
  );

  const main = (data?.weather?.[0]?.main || "").toLowerCase();
  const temp = data?.main?.temp;


  let theme = "theme-cloudy";

  if (main.includes("thunder") || main.includes("storm")) {
    theme = "theme-stormy";
  } else if (main.includes("rain") || main.includes("drizzle")) {
    theme = "theme-rainy";
  } else if (main.includes("snow")) {
    theme = "theme-snowy";
  } else if (main.includes("clear") && isDefined(temp) && Number(temp) >= 18) {
    theme = "theme-sunny";
  } else if (main.includes("clear")) {
    theme = "theme-sunny";
  } else if (main.includes("cloud")) {
    theme = "theme-cloudy";
  } else if (main.includes("mist") || main.includes("fog") || main.includes("haze")) {
    theme = "theme-cloudy";
  }

  body.classList.add(theme);
}


async function getWeather(city) {
  try {
    const url = API_BASE + encodeURIComponent(city);
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}


async function showWeather(city) {
  const trimmed = (city || "").trim();
  if (!trimmed) return;

  const btn = $("get-weather-btn");
  if (btn) btn.disabled = true;

  const data = await getWeather(trimmed);

  if (btn) btn.disabled = false;

  if (!data) {
    alert("Something went wrong, please try again later.");
    return;
  }

  
  const panel = $("weather-panel");
  if (panel) panel.hidden = false;


  applyThemeFromData(data);

 
  setIcon(data?.weather?.[0]?.icon);
  setText("weather-main", data?.weather?.[0]?.main);


  setText("location", data?.name);


  setText("main-temperature", data?.main?.temp);
  setText("feels-like", data?.main?.feels_like);
  setText("humidity", data?.main?.humidity);
  setText("wind", data?.wind?.speed);
  setText("wind-gust", data?.wind?.gust);
}


document.addEventListener("DOMContentLoaded", () => {
  const btn = $("get-weather-btn");
  const select = $("city-select");
  const panel = $("weather-panel");


  if (panel) panel.hidden = true;

  if (btn && select) {
    btn.addEventListener("click", async () => {
      const city = select.value;
      if (!city) return;
      await showWeather(city);
    });
  }
});
