import React from 'react'
import { FaBtc, FaCcMastercard, FaPaypal } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { IoCash } from "react-icons/io5";
import Loading from '../components/loading';
import { toast } from "sonner"
import useStore from "../store/index"
import { useState, useEffect } from 'react';
import api from '../libs/apiCall';
import Title from "../components/ui/title"
import { IoMdAdd } from "react-icons/io";
import { MdVerifiedUser } from "react-icons/md";
import AccountMenu from '../components/account-dialog';
import { maskAccountNumber } from "../libs/index.js"
import { AddAccount } from '../components/add-account.jsx';
import AddMoney from '../components/add-money-account.jsx';
import { formatCurrency } from '../libs/index.js';
import { AiOutlineGold } from "react-icons/ai";
import TransferMoney from '../components/transfer-money.jsx';


const ICONS = {


  crypto: (
    <div className='w-12 h-12 bg-amber-600 text-white flex items-center justify-center rounded-full'>
      <FaBtc size={26} />
    </div>
  ),

  "visa debit card": (
    <div className='w-12 h-12 bg-blue-600 text-white flex items-center justify-center rounded-full'>
      <FaCcVisa size={26} />
    </div>
  ),

  "mastercard": (
    <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'>
      <FaCcMastercard size={26} />
    </div>
  ),


  paypal: (
    <div className='w-12 h-12 bg-blue-700 text-white flex items-center justify-center rounded-full'>
      <FaPaypal size={26} />
    </div>
  ),
  cash: (
    <div className='w-12 h-12 bg-rose-600 text-white flex items-center justify-center rounded-full'>
      <IoCash size={26} />
    </div>
  ),

    gold: (
      <div className='w-12 h-12 bg-amber-500 text-white flex items-center justify-center rounded-full'>
        
      <AiOutlineGold size={26} />
      </div>)
}


const Accountpage = () => {


  const { user } = useStore((state) => state);

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenTopup, setIsOpenTopup] = useState(false);
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

// ✅ destructure the array properly


// Now use it normally:




  const fetchAccounts = async () => {
    try {
      const { data: res } = await api.get('/account');

      setData(res.data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };


  const handleOpenAddMoney  = (el)=>{
    setSelectedAccount(el?.id);
    setIsOpenTopup(true)

  }

  const handleTransferMoney = (el)=>{
    setSelectedAccount(el?.id);
    setIsOpenTransfer(true)
  }

  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, []);

  if (isLoading) {
    return <Loading />
  }





  return (
    <>
      <div className='w-full  py-10'>
        <div className='flex  items-center justify-between'>


          <Title title="Account Information" />
          <div className='flex items-center gap-4'>


            <button onClick={() => setIsOpen(true)}
              className='py-1.5 px-2 rounded bg-black dark:bg-violet-600 text-white dark:text-white flex items-center justify-center gap-2 border-gray-500'>


              <IoMdAdd size={22} />
              <span className=''>Add </span>

            </button>
          </div>

        </div>


        {
          data.length == 0 ? (<>
            <div className='w-full flex items-center justify-between py-10 text-gray-600 dark:text-gray-700 text-lg'
            >
              <span>No Account Found</span>

            </div>
          </>) : (
            <div className='w-full grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 gap-6'>
              {
                data?.map((acc, index) => (
                  <div key={index} className='w-full h-48 flex gap-4 bg-gray-50 dark:bg-slate-800 p-3 rounded shadow'>


                    <div>

                      {ICONS[acc?.account_name?.toLowerCase()]}
                    </div>

                    <div className='space-y-2 w-full'>

                      <div className='flex items-center justify-between'>
                        <div className='flex items-center'>
                          <p className='text-black dark:text-white text-2xl font-bold '>{acc?.account_name}</p>

                          <MdVerifiedUser size={26} className="text-emerald-600 ml-1" />


                        </div>
                        <AccountMenu
                          addMoney={() => handleOpenAddMoney(acc)}
                          transferMoney={() => handleTransferMoney(acc)}

                        />
                      </div>
                      <span className='text-gray-600 dark:text-gray-400 font-light leading-loose'>
                        {maskAccountNumber(acc?.account_number)}
                      </span>

                      <p className='text-xs text-gray-600 dark:text-gray-500'>
                        {new Date(acc?.created_at).toLocaleDateString("en-US", {
                          dateStyle: "full",
                        })}
                      </p>





                      <div className='flex items-center justify-between'>



                        <p className='text-xl text-gray-600 dark:text-gray-400 font-medium'>
                          {formatCurrency(acc?.account_balance)}
                        </p>
                        <button
                          onClick={() => handleOpenAddMoney(acc)}
                          className='text-sm outline-none text-violet-600 hover:underline'
                        >
                          Add Money
                        </button>
                      </div>





                    </div>

                  </div>


                )

                )


              }


            </div>
          )
        }

      </div>




 <AddAccount
  isOpen={isOpen}
  setIsOpen={setIsOpen}
  refetch={fetchAccounts}
  key={new Date().getTime()}
/>

 <AddMoney
  isOpen={isOpenTopup}
  setIsOpen={setIsOpenTopup}
  id={selectedAccount}
  refetch={fetchAccounts}
  key={new Date().getTime() + 1}
/> 

 <TransferMoney
  isOpen={isOpenTransfer}
  setIsOpen={setIsOpenTransfer}
  id={selectedAccount}
  refetch={fetchAccounts}
  key={new Date().getTime() + 2}
/>   

    </>
  )
}

export default Accountpage
