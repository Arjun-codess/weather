const apiKey = "08a85d511a494ccd9be51750250209";
    const themeToggle = document.getElementById("themeToggle");

    themeToggle.addEventListener("change", () => {
      document.body.classList.toggle("dark");
      document.body.classList.toggle("light");
    });

    let chart;

    async function getWeather() {
      const location = document.getElementById("locationInput").value;
      if (!location) {
        alert("Please enter a location.");
        return;
      }

      const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${encodeURIComponent(location)}&aqi=yes`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        const weatherDiv = document.getElementById("weatherInfo");
        const weather = data.current;
        const locationName = `${data.location.name}, ${data.location.country}`;
        const iconUrl = "https:" + weather.condition.icon;

        weatherDiv.innerHTML = `
          <div class="icon">
            <img src="${iconUrl}" alt="icon" />
          </div>
          <h2>${locationName}</h2>
          <div class="data-row"><strong>Temperature:</strong> ${weather.temp_c} °C</div>
          <div class="data-row"><strong>Humidity:</strong> ${weather.humidity} %</div>
          <div class="data-row"><strong>Rain:</strong> ${weather.precip_mm} mm</div>
          <div class="data-row"><strong>Wind:</strong> ${weather.wind_kph} kph</div>
          <div class="data-row"><strong>Condition:</strong> ${weather.condition.text}</div>
        `;

        // Prepare data for graph
        const labels = ["Temperature (°C)", "Humidity (%)", "Rainfall (mm)", "Wind (kph)"];
        const values = [weather.temp_c, weather.humidity, weather.precip_mm, weather.wind_kph];

        // Destroy existing chart
        if (chart) {
          chart.destroy();
        }

        chart = new Chart(document.getElementById("weatherChart"), {
          type: "bar",
          data: {
            labels: labels,
            datasets: [{
              label: `Current Weather in ${data.location.name}`,
              data: values,
              backgroundColor: [
                "#007BFF", "#17a2b8", "#28a745", "#ffc107"
              ],
              borderRadius: 6
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: { display: false },
              title: {
                display: true,
                text: 'Weather Overview'
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function (value) {
                    return value;
                  }
                }
              }
            }
          }
        });

      } catch (error) {
        console.error("Error:", error);
        alert("Failed to fetch weather data.");
      }
    }