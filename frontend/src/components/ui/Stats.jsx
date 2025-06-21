import React from "react";
import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";
import { SiCashapp } from "react-icons/si";
import { formatCurrency } from "../../libs/index";


const ICON_STYLES = [
  "bg-blue-300 text-blue-800",
  "bg-emerald-300 text-emerald-800",
  "bg-rose-300 text-rose-800",
];

const Stats = ({dt}) => {



 

  
const data = [
  {
    label: "Your Total Balance",
    amount: dt?.balance,
    increase: 10.9,
    icon: <BsCurrencyDollar size={26} />,
  },
  {
    label: "Total Income",
    amount: dt?.income,
    icon: <BsCashCoin size={26} />,
    increase: 8.9,
  },
  {
    label: "Total Expense",
    amount: dt?.expense,
    icon: <SiCashapp size={26} />,
    increase: -10.9,
  },
];
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-8'>
      {data.map((item, index) => (
        <div
          key={index + item.label}
          className='w-full flex items-center justify-between gap-4 p-6 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700'
        >
          <div className='flex items-center gap-4'>
            <div
              className={`w-12 h-12 flex items-center justify-center rounded-full ${ICON_STYLES[index]}`}
            >
              {item.icon}
            </div>

            <div className='space-y-1'>
              <span className='text-gray-600 dark:text-gray-400 text-sm'>
                {item.label}
              </span>
              <p className='text-xl font-medium text-black dark:text-gray-200'>
               {formatCurrency(item?.amount||0.0)}
              </p>
            </div>
          </div>

          <div className='text-right'>
            <p
              className={`flex gap-1 items-center justify-end text-sm font-semibold ${
                item.increase > 0 ? "text-emerald-500" : "text-red-500"
              }`}
            >
              {item.increase > 0 ? <IoMdArrowUp /> : <IoMdArrowDown />}
              {Math.abs(item.increase)}%
            </p>
            <span className='text-xs text-gray-500 dark:text-gray-400'>
              vs last year
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;