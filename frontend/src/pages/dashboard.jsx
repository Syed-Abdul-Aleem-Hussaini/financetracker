import React, { useEffect,useState } from "react";
import Info from "/src/components/ui/info.jsx"
import Stats from "/src/components/ui/Stats.jsx"
import DoughnutChart from "../components/ui/DoughnutChart";
import Charts from "../components/ui/Charts"
import Accounts from "../components/ui/accounts"

import RecentTransactions from "../components/ui/transactions"
import Loading from "../components/loading";
import api from "../libs/apiCall"

const Dashboard = () => {
   // Replace with actual logic if using theme switching

   const [data,setData] =  useState([])
   const [isLoading, setIsLoading]  = useState(false)
   
   const fetchDashboradStats = async()=>{
    const URL  = `/transaction/dashboard`;
    try{
      const {data}  =  await  api.get(URL);
      setData(data)

    }catch(error){
      console.log(error);
      toast.error(
        error?.response?.data?.message ||
        "something went wrong.try again later"
      )
      if(error?.response?.data?.status === "auth failed"){
        localStorage.removeItem("user");
        window.location.reload()
      }

    }finally{
      setIsLoading(false)
    }

   };
   useEffect(()=>{
    setIsLoading(true);
    fetchDashboradStats();

   },[])
   if (isLoading)
    return (
  <div className="flex item-center justify-center w-full h-[80vh]">
    
<Loading />
  </div>)


  return (
    <main >
     

        <div className="px-0 md:px-5 2xl:px-20">
          {/* <Info /> */}
        <Info  title = "DashBoard"  subTitle = "Monitor your finance activities"/>
          {/* <Stats /> */}
<Stats 
dt = {{
  balance : data?.availableBalance,
  income : data?.totalIncome,
  expense : data?.totalExpense,
}}

/>
          <div className="w-full flex flex-col-reverse md:flex-row items-center gap-10">
            {/* <Chart /> */}
            <Charts 
            data  = {data?.chartData}
           
            />
           {data?.totalIncome > 0 &&(
             <DoughnutChart
            dt ={{
              balance : data?.availableBalance,
              income : data?.totalIncome,
              expense : data?.totalExpense,
            }}
            />
           ) }
            {/* <DoughnutChart /> */}
          </div>

          <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
            {/* <Transactions /> */}
            <RecentTransactions  data  = {data?.lastTransactions}/>
            {/* <Accounts /> */}

           {data.lastAccount?.length >  0 && <Accounts data = {data?.lastAccount} />}
          </div>
        </div>
      
    </main>
  );
};

export default Dashboard;
