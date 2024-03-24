"use client"

import { string, z } from "zod"

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

const formSchema = z.object({
    fullname: z.string().min(3, { message: "Name must be more than two characters" }),
    username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
    password: z.string()
        .length(8, "Password should contain exactly 8 characters."),
    confirmPassword: z.string()
        .length(8, "Password should contain exactly 8 characters."),
    email: z.string().email("Invalid Email Address"),
    phone: z.string().refine(value => /^\d{10}$/.test(value), {
        message: "Enter a valid 10-digit phone number",
    }),
    clientId: z.number(),
    apiKey: z.any(), //api key is not a number so we need to set it as any
    apiSecret: z.any()
})

export default function RegisterPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            username: "",
            password: "",
            email: "",
            apiKey: '',
            apiSecret: ''

        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {

        // ✅ This will be type-safe and validated.
        console.log(values)
    }


    return (
        <div className="flex justify-center p-10" >
            <div className=" w-1/2 p-10 rounded-2xl  border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <h1 className="flex justify-center text-2xl font-semibold">Register</h1>
                        {/* Full Name */}

                        <FormField
                            control={form.control}
                            name="fullname"
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
                            name="password"
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

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex space-x-4">
                                        <FormLabel className="pt-3 w-1/2">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="confirm password" {...field} type="password" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email*/}

                        <FormField
                            control={form.control}
                            name="email"
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
                            name="phone"
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
                            name="clientId"
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
                            name="apiKey"
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
                            name="apiSecret"
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
