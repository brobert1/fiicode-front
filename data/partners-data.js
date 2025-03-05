const partners = [
  {
    label: "Uber",
    value: "uber",
    data: {
      name: "Uber",
      description:
        "Uber is a ride-hailing service that allows customers to book rides through a mobile app. It operates in major Romanian cities including Bucharest, Cluj-Napoca, Timisoara, Brasov, and Iasi.",
      website: "https://www.uber.com/ro/en/",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png",
      deep_link:
        "https://m.uber.com/looking?pickup[latitude]=START_LAT&pickup[longitude]=START_LON&dropoff[latitude]=END_LAT&dropoff[longitude]=END_LON",
    },
  },
  {
    label: "Bolt",
    value: "bolt",
    data: {
      name: "Bolt",
      description:
        "Bolt (formerly Taxify) is a European mobility company that offers ride-hailing, micromobility, and food delivery services. It operates in multiple Romanian cities and is known for competitive pricing.",
      website: "https://bolt.eu/ro/",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/Bolt_logo.png/800px-Bolt_logo.png?20190831113556",
      deep_link: "bolt://open?s_lat=START_LAT&s_lng=START_LON&d_lat=END_LAT&d_lng=END_LON",
    },
  },
  {
    label: "BlackCab",
    value: "blackcab",
    data: {
      name: "BlackCab",
      description:
        "BlackCab is a premium ride-hailing service operating in Romania, offering professional drivers and high-quality vehicles. It focuses on providing a superior customer experience with fixed prices.",
      website: "https://www.blackcab.ro/",
      logo_url:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSh4sjGOaDTUtbrZBszHwh0gOQ1XSl4iLqAIA&s", // assumed URL from official site
      deep_link:
        "blackcab://ride?pickup_lat=START_LAT&pickup_lng=START_LON&dropoff_lat=END_LAT&dropoff_lng=END_LON",
    },
  },
];

export default partners;
