import React, { useState,useEffect } from 'react'
import * as z from "zod";
import useStore from "../../store";
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import { Link, useNavigate} from "react-router-dom"
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "../../components/ui/card"
import { SocialAuth } from '../../components/social-auth';
import { Seperator } from '../../components/seperator';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {BiLoader} from "react-icons/bi"
const LoginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),


  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});


const SignIn = () => {
  const {user}  =  useStore(state=> state )
  const {
    register,
    handleSubmit,
    formState : {errors},

  
  } = useForm({
    resolver : zodResolver(LoginSchema),
  })

  const navigate = useNavigate()
  const [loading, setloading]  = useState()

  useEffect(()=>{

    user && navigate("/")


    
  },[user])


  const onSubmit  =async(data)   =>{
    console.log(data)
  }

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-black/30 shadow-lg rounded-2xl overflow-hidden border dark:border-gray-800">
        <div className="p-6 md:p-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold dark:text-white">
              Sign  In
            </CardTitle>
          </CardHeader>
  
          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <SocialAuth isLoading={loading} setloading={setloading} />
                <Seperator />
  
             
  
                <Input
                  disabled={loading}
                  id="email"
                  label="Email"
                  name="email"
                  register={register}
                  type="text"
                  placeholder="you@example.com"
                  error={errors?.email?.message}
                  {...register("email")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-500 dark:text-white"
                />
  
                <Input
                  disabled={loading}
                  id="password"
                  label="Password"
                  name="password"
                  register={register}
                  type="password"
                  placeholder="Your Password"
                  error={errors?.password?.message}
                  {...register("password")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-500 dark:text-white"
                />
              </div>

              <Button  type = "submit" className="w-full bg-violet-800" disabled  = {loading}>
                {loading?<BiLoader className='text-2xl text-white animate-spin'/> : "Sign In"}

              

              </Button>
            </form>
          </CardContent>
        </div>
        <CardFooter className="justify-center gap-2">
          <p className='text-sm text-gray-600'>Already have an account</p>
          <Link  to = "/sign-in"
          className='text-sm font-semibold text-violet-600 hover:underline'>
            Sign In
          </Link>

        </CardFooter>
      </Card>
    </div>
  );
  
  
}

export default SignIn
 