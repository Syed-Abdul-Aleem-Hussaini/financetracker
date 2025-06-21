 import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner"; // Ensure 'sonner' is installed

 // Adjust path if needed
import api from "../libs/apiCall"; // Adjust path if needed
import {Button} from "../components/ui/button"; // Adjust path if needed
import Input from "./ui/input"; // Assuming this is the correct component name and path
import DialogWrapper from "../components/wrappers/dialog-wrapper"; // Adjust path if needed
import { formatCurrency } from "../libs/index";




// Codiumate: Options | Test this function
const AddMoney = ({ isOpen, setIsOpen, id, refetch }) => { // Added 'id' to props
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const [loading, setLoading] = useState(false);

   // ✅ destructure the array properly


// Now use it normally:



  const submitHandler = async (data) => {
    try {
      setLoading(true);

      const { data: res } = await api.put(`/account/add-money/${id}`, data); // Using 'id' from props

      if (res?.data) { // Check if res.data exists before proceeding
        toast.success(res.message);
        setIsOpen(false);
        refetch();
      }
    } catch (error) {
      // Error handling logic would typically be here, similar to previous examples
      console.error("Add money failed:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to add money");
    } finally {
      setLoading(false);
    }
  }

  function closeModal() {
  setIsOpen(false);
}

return (
  <DialogWrapper isOpen={isOpen} closeModal={closeModal}>
    <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left align-middle shadow-xl transition-all">
      <DialogTitle
        as="h3"
        className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-300 mb-4 uppercase"
      >
        Add Money to Account
      </DialogTitle>

      <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
        <Input
          type='number'
          name='amount'
          label='Amount'
          placeholder='10.56'
         {...register("amount", {
            required: "Amount is required!",
          })}
          error={errors.amount ? errors.amount.message : ""}
        />
        {/* ... more form elements or a submit button would typically follow here */}
        <div className='w-full mt-8'>

  <Button
  disabled  ={loading}
  type ="submit"
  className = "bg-voilet-700 text-white w-full"
  
  >
{`Submit ${
    watch("amount") ? formatCurrency(watch("amount")) : ""
}`}



  </Button>
</div>
      </form>
    </DialogPanel>
  </DialogWrapper>
);
}
export default AddMoney;