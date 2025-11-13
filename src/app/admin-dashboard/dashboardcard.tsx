import React from "react";

type Props = {
  title: string;
  value: string | number;
  color?: string;
};

const DashboardCard = ({ title, value, color = "blue-600" }: Props) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold mt-2 text-${color}`}>{value}</p>
    </div>
  );
};

export default DashboardCard;
