import React, { useState, useEffect } from 'react';
import * as z from "zod";
import useStore from "../../store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { SocialAuth } from '../../components/social-auth';
import { Seperator } from '../../components/seperator';
import Input from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { BiLoader } from "react-icons/bi";
import { toast } from 'sonner';
import api from "../../libs/apiCall"; // ✅ make sure this is present

const RegisterSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  firstName: z
    .string({ required_error: "Name is required" })
    .min(3, "Name must be at least 3 characters"),
  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters"),
});

const Signup = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // ✅ corrected camelCase

  useEffect(() => {
    if (user) {
      navigate("/overview");
    }
  }, [user, navigate]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const { data: res } = await api.post("/auth/sign-up", data);
      if (res?.user) {
        toast.success("Account created successfully. You can log in now.");
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 px-4">
      <Card className="w-full max-w-md bg-white dark:bg-black/30 shadow-lg rounded-2xl overflow-hidden border dark:border-gray-800">
        <div className="p-6 md:p-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold dark:text-white">
              Create an Account
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-6">
                <SocialAuth isLoading={loading} setLoading={setLoading} />
                <Seperator />

                <Input
                  disabled={loading}
                  id="firstName"
                  label="Name"
                  name="firstName"
                  type="text"
                  placeholder="John Smith"
                  error={errors?.firstName?.message}
                  {...register("firstName")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-500 dark:text-white"
                />

                <Input
                  disabled={loading}
                  id="email"
                  label="Email"
                  name="email"
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
                  type="password"
                  placeholder="Your Password"
                  error={errors?.password?.message}
                  {...register("password")}
                  className="text-sm border dark:border-gray-800 dark:bg-transparent dark:placeholder:text-gray-500 dark:text-white"
                />
              </div>

              <Button type="submit" className="w-full bg-violet-800" disabled={loading}>
                {loading ? (
                  <BiLoader className="text-2xl text-white animate-spin" />
                ) : (
                  "Create an account"
                )}
              </Button>
            </form>
          </CardContent>
        </div>

        <CardFooter className="justify-center gap-2">
          <p className="text-sm text-gray-600">Already have an account</p>
          <Link
            to="/sign-in"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signup;
