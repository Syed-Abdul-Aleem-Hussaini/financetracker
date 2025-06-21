import React from "react";
import Title from "./title";
import { RiProgress3Line } from "react-icons/ri";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { TiWarning } from "react-icons/ti";
import { formatCurrency } from "../../libs/index";

const NewTransactions = ({ data }) => {
  return (
    <div className="min-h-screen w-full px-4 md:px-10 py-12 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <Title title="Transactions" />

        <div className="overflow-x-auto mt-10 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
          <table className="w-full min-w-[700px] text-left text-sm text-gray-700 dark:text-gray-300">
            <thead className="bg-violet-100 dark:bg-slate-800 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Name</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Source</th>
                <th className="py-4 px-6">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data?.length > 0 ? (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-violet-50 dark:hover:bg-slate-800 transition border-b border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-4 px-6">{item.updatedat}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-semibold text-black dark:text-white">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 flex items-center gap-2">
                      {item.status === "Pending" && (
                        <RiProgress3Line className="text-amber-600" size={22} />
                      )}
                      {item.status === "Completed" && (
                        <IoCheckmarkDoneCircle className="text-emerald-600" size={22} />
                      )}
                      {item.status === "Rejected" && (
                        <TiWarning className="text-red-600" size={22} />
                      )}
                      <span className="capitalize">{item.status}</span>
                    </td>
                    <td className="py-4 px-6">{item.source}</td>
                    <td className="py-4 px-6 font-semibold text-black dark:text-white">
                      {formatCurrency(item.amount)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-6 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewTransactions;
