import React from "react";
import Info from "/src/components/ui/info.jsx"
import Stats from "/src/components/ui/Stats.jsx"
import DoughnutChart from "../components/ui/DoughnutChart";
import Charts from "../components/ui/Charts"
import Accounts from "../components/ui/accounts"

import Transactions from "../components/ui/transactions"

const Dashboard = () => {
   // Replace with actual logic if using theme switching

   const [data,setData] =  useState([])
   


  return (
    <main >
     

        <div className="px-0 md:px-5 2xl:px-20">
          {/* <Info /> */}
        <Info  title = "DashBoard"  subTitle = "Monitor your finance activities"/>
          {/* <Stats /> */}
<Stats />
          <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10">
            {/* <Chart /> */}
            <Charts />
            <DoughnutChart />
            {/* <DoughnutChart /> */}
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
            {/* <Transactions /> */}
            <Transactions />
            {/* <Accounts /> */}

            <Accounts />
          </div>
        </div>
      
    </main>
  );
};

export default Dashboard;
