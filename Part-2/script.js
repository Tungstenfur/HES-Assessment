document.addEventListener("DOMContentLoaded", function () {
  const generateRandomIntArray = (length, min, max) =>
    Array.from(
      { length },
      () => Math.floor(Math.random() * (max - min + 1)) + min,
    );

  const numberOfHours = 20;
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
          data: generateRandomIntArray(numberOfHours, 90, 150),
          borderColor: "rgba(75, 192, 192, 1)",
          fill: false,
          tension: 0.1,
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
});
