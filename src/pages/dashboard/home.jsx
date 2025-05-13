import React from "react";
import { Typography } from "@material-tailwind/react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { AudioLinesIcon, Video, UsersIcon } from "lucide-react";

export function Home() {
  const statisticsCardsData = [
    {
      color: "gray",
      icon: UsersIcon,
      title: "All Users",
      value: "2,450",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: AudioLinesIcon,
      title: "All Venders",
      value: "1,230",
      footer: {
        color: "text-green-500",
        value: "+2%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: Video,
      title: "All products",
      value: "980",
      footer: {
        color: "text-red-500",
        value: "-1%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: QuestionMarkCircleIcon,
      title: "Total FAQs",
      value: "150",
      footer: {
        color: "text-green-500",
        value: "+7%",
        label: "than last month",
      },
    },
  ];

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ color, icon, title, value, footer }, index) => (
          <StatisticsCard
            key={index}
            title={title}
            value={value}
            color={color}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-black", // ← changed here
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {statisticsCardsData.map(({ color, icon, title, value, footer }, index) => (
          <StatisticsCard
            key={index}
            title={title}
            value={value}
            color={color}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-black", // ← changed here
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
