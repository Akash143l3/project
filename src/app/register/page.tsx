"use client"

import {  z } from "zod"
import axios from 'axios';
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"


const formSchema = z.object({
    full_name: z.string().min(3, { message: "Name must be more than two characters" }),
    username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
    user_password: z.string()
        .length(8, "Password should contain exactly 8 characters."),
    
    email_address: z.string().email("Invalid Email Address"),
    phone_number: z.string().refine(value => /^\d{10}$/.test(value), {
        message: "Enter a valid 10-digit phone number",
    }),
    client_id: z.string(),
    api_key: z.string(), //api key is not a number so we need to set it as any
    api_secret: z.string()
})



export default function RegisterPage() {
    const { toast }=useToast()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            username: "",
            user_password: "",
            email_address: "",
            phone_number:"",
            client_id:"",
            api_key: "",
            api_secret: ""

        },
    })
    function handleRegistration(values: z.infer<typeof formSchema>) {
        axios
          .post('http://127.0.0.1:5000/register', values)
          .then((response) => {
           
            alert(response.data.message)
            // Handle successful registration
          })
          .catch((error) => {
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
            alert(error.response.data.error); // Print the error message from the server
              console.error(error.response.status); // Print the status code
              console.error(error.response.headers); // Print the headers
            } else if (error.request) {
              // The request was made but no response was received
              console.error(error.request);
            } else {
              // Something happened in setting up the request that triggered an error
              console.error('Error', error.message);
            }
            // Handle registration error
          });
      }


    return (
        <div className="flex justify-center p-10" >
            <div className=" w-1/2 p-10 rounded-2xl  border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-8">
                        <h1 className="flex justify-center text-2xl font-semibold">Register</h1>
                        {/* Full Name */}

                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full Name" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* User Name */}

                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">User Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="User Name" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Password */}

                        <FormField
                            control={form.control}
                            name="user_password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="password" {...field} type="password" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Confirm Password */}

                        

                        {/* Email*/}

                        <FormField
                            control={form.control}
                            name="email_address"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">Email Address</FormLabel>
                                        <FormControl>
                                            <Input placeholder="User@gmail.com" {...field} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Phone number */}

                        <FormField
                            control={form.control}
                            name="phone_number"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">Phone Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone Number" {...field} type="tel" pattern="[0-9]*" 
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                                                field.onChange(value);
                                            }} />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />





                        {/* Client Id */}

                        <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">ClientID</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Client ID" {...field} type="tel" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* Api Key */}

                        <FormField
                            control={form.control}
                            name="api_key"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">API Key</FormLabel>
                                        <FormControl>
                                            <Input placeholder="API Key" {...field} required/>
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {/* API Secret */}

                        <FormField
                            control={form.control}
                            name="api_secret"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">API Secret</FormLabel>
                                        <FormControl>
                                            <Input placeholder="API SECRET" {...field} required />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <div className="flex flex-col justify-center gap-5"><Button type="submit">Submit</Button>
                            <p>Already have an account...... <Link href={"/login"} className="pl-2 text-blue-600">Sign-In</Link></p></div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
