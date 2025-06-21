import React, { useEffect,useState } from "react";
import Info from "/src/components/ui/info.jsx"
import Stats from "/src/components/ui/Stats.jsx"
import DoughnutChart from "../components/ui/DoughnutChart";
import Charts from "../components/ui/Charts"
import Accounts from "../components/ui/accounts"

import RecentTransactions from "../components/ui/transactions"
import Loading from "../components/loading";
import api from "../libs/apiCall"
import NewTransactions from "../components/ui/newTransactions";


const Transaction = () => {
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
    <div className="px-0 md:px-5 2xl:px-20">
         <div className="flex flex-col-reverse md:flex-row gap-0 md:gap-10 2xl:gap-20">
                {/* <Transactions /> */}
                <NewTransactions data  = {data?.lastTransactions}/>
                {/* <Accounts /> */}
    
              
              </div>
    </div>
  )
}

export default Transaction
