import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
  } from "firebase/auth";
  import React, { useEffect, useState, useCallback } from "react";
  import { useAuthState } from "react-firebase-hooks/auth";
  import { FcGoogle } from "react-icons/fc";
  import { useNavigate } from "react-router-dom";
  import { toast } from "sonner";
  import api from "../libs/apiCall";
  import { auth } from "../libs/firebaseConfig";
  import useStore from "../store";
  import { Button } from "./ui/button";
  
  export const SocialAuth = ({ isLoading }) => {
    const [user] = useAuthState(auth);
    const [selectedProvider, setSelectedProvider] = useState("google");
    const { setCredentials } = useStore((state) => state);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);
  
    const signInWithGoogle = async () => {
      if (isProcessing) return;
      
      const provider = new GoogleAuthProvider();
      setSelectedProvider("google");
      try {
        setIsProcessing(true);
        await signInWithPopup(auth, provider);
      } catch (error) {
        console.error("Error signing in with Google", error);
        toast.error("Failed to sign in with Google");
      } finally {
        setIsProcessing(false);
      }
    };
  
    const signInWithGithub = async () => {
      // your GitHub sign-in logic here
    };
  
    const saveUserToDb = useCallback(async () => {
      if (!user || isProcessing) return;
      
      try {
        setIsProcessing(true);
        const userData = {
          firstName: user.displayName,
          email: user.email,
          provider: selectedProvider,
          uid: user?.uid
        };
  
        const { data: res } = await api.post("/auth/sign-up", userData);
        
        if (res?.user) {
          toast.success(res?.message || "Login successful");
          const userInfo = { ...res?.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);
          navigate("/overview");
        }
      } catch (error) {
        console.error("Something went wrong:", error);
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsProcessing(false);
      }
    }, [user, selectedProvider, setCredentials, navigate, isProcessing]);
  
    useEffect(() => {
      if (user && !isProcessing) {
        saveUserToDb();
      }
    }, [user, saveUserToDb, isProcessing]);
  
    return (
      <div className="flex items-center gap-2">
        <Button
          onClick={signInWithGoogle}
          disabled={isLoading || isProcessing}
          variant="outline"
          className="w-full text-sm font-normal dark:bg-transparent dark:border-gray-800 dark:text-gray-400"
          type="button"
        >
          <FcGoogle className="mr-2 size-5" />
          Continue with Google
        </Button>
      </div>
    );
  };
  