import { useState } from 'react'
import { Navigate,Outlet,Route,Routes } from 'react-router-dom'
import './App.css'
import SignIn from './pages/auth/sign-in'
import Signup from './pages/auth/sign-up'
import Dashboard from './pages/dashboard'
import Settings from './pages/settings'
import Accountpage from './pages/account-page'
import Transaction from './pages/transaction'
import useStore from './store'
import { setAuthToken } from './libs/apiCall'
import {Toaster} from "sonner"

const RootLayout   = () =>{
  const user = useStore((state) => state);

setAuthToken(user?.token||"");

  return ! user ? (<Navigate to   = "/sign-in"  replace = {true} />)
  :(
  <>
  {}
  <div className='min-h-[cal(h-screen-100px)]'>
    
    <Outlet />
  </div>
  
  </>
  )
}
function App() {

 

const [count,setCount]  =useState(0)
  return (
    <>
<div className='w-full min-h-screen px-6 bg-gray-100 md:px2-0  dark:bg-slate-900'>
<Routes>
<Route path  = "/sign-in" element =  {<SignIn/>} /> 

<Route path  = "/sign-up" element =  {<Signup />} /> 
<Route   path  =  "/"    element    = {<Navigate  to  = "/sign-up"  />} />


  <Route element  =  {<RootLayout />}>

  
  <Route    path  = "/overview" element = {<Dashboard/>} />
  <Route    path  = "/transactions" element = {<Transaction/>} />
  <Route    path  = "/settings" element = {<Settings/>}/>
  <Route    path  = "/account" element = {<Accountpage/>}/>



</Route>
</Routes>
</div>
<Toaster richColors position = "top-center"/>

    </>
  )
}

export default App
