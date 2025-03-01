const badgesData = [
  {
    id: "premium",
    name: "Premium",
    date: "Apr 2023",
    earned: true,
    xpRequired: 100,
    icon: (
      <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
      </svg>
    ),
  },
  {
    id: "supporter",
    name: "Supporter",
    date: "May 2023",
    earned: true,
    xpRequired: 250,
    icon: (
      <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.03L12 21.35Z" />
      </svg>
    ),
  },
  {
    id: "power",
    name: "Power",
    date: "",
    earned: false,
    xpRequired: 500,
    icon: (
      <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11 15H6L13 1V9H18L11 23V15Z" />
      </svg>
    ),
  },
  {
    id: "goal",
    name: "Goal",
    date: "",
    earned: false,
    xpRequired: 750,
    icon: (
      <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11ZM12 8C9.79 8 8 9.79 8 12C8 12.55 8.45 13 9 13C9.55 13 10 12.55 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14C11.45 14 11 14.45 11 15V16C11 16.55 11.45 17 12 17C12.55 17 13 16.55 13 16V15.19C14.7 14.8 16 13.55 16 12C16 9.79 14.21 8 12 8Z" />
      </svg>
    ),
  },
  {
    id: "champion",
    name: "Champion",
    date: "Aug 2023",
    earned: true,
    xpRequired: 1000,
    icon: (
      <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4V4L8.86 7.64C9.62 8.17 10 9.02 10 9.93V18.93C10 19.48 10.45 19.93 11 19.93H13C13.55 19.93 14 19.48 14 18.93V9.93C14 9.02 14.38 8.17 15.14 7.64L20 4V2Z" />
      </svg>
    ),
  },
];

export default badgesData;
