async function DownloadLogs() {
  const log_div = document.getElementById("logs");
  try {
    const response = await fetch("latest.log");

    if (!response.ok) {
      log_div.innerHTML = "<p class='error'>Error fetching logs.</p>";
      return;
    }
    const logs = await response.text();
    const lines = logs.split("\n");
    const logFragment = document.createDocumentFragment();

    for (const line of lines) {
      const match = line.match(/\[[^/]+\/([^\]]+)\]/);
      let type = (match ? match[1] : "INFO").toLowerCase();
      if (
        type !== "info" &&
        type !== "error" &&
        type !== "fatal" &&
        type !== "maintenance" &&
        type !== "warn"
      ) {
        type = "info";
      }
      const logLine = document.createElement("p");
      logLine.className = type;
      logLine.textContent = line;
      logFragment.append(logLine);
    }

    log_div.replaceChildren(logFragment);
  } catch (error) {
    log_div.innerHTML =
      "<p class='error'>Error fetching logs. If youre running this through opening html file through chromium engine based browser it might be blocking the request due to CORS.</p>" +
      "<p>" +
      error +
      "</p>";

    return;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const generateRandomIntArray = (length, min, max) =>
    Array.from(
      { length },
      () => Math.floor(Math.random() * (max - min + 1)) + min,
    );

  const numberOfHours = 24;
  const currentFullHour = new Date();
  currentFullHour.setMinutes(0, 0, 0);
  const hourLabels = Array.from({ length: numberOfHours }, (_, index) => {
    const hour = new Date(currentFullHour);
    hour.setHours(currentFullHour.getHours() - (numberOfHours - 1 - index));

    return hour.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  });

  const chart = document.getElementById("pingChart");
  new Chart(chart, {
    type: "line",
    data: {
      labels: hourLabels,
      datasets: [
        {
          label: "Ping Time (ms)",
          data: generateRandomIntArray(numberOfHours, 80, 150),
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: "Time",
            text: "Time (hourly)",
          },
        },
        y: {
          title: {
            display: true,
            text: "Response Time (ms)",
          },
          beginAtZero: true,
        },
      },
    },
  });
  DownloadLogs();
});
