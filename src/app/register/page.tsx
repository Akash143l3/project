"use client"
import { number, z } from "zod";
import axios from 'axios';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";

// Define enum for Lotes
enum Lotes {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    FIVE = 5,
    SIX = 6,
    SEVEN = 7,
    EIGHT = 8,
    NINE = 9,
    TEN = 10
}


const formSchema: any = z.object({
    full_name: z.string().min(3, { message: "Name must be more than two characters" }),
    username: z.string().min(2, { message: "Username must be at least 2 characters.", }),
    user_password: z.string()
        .min(8, "Password should contain more than 8 characters."),
    confirm_password: z.string()
        .min(8, "Password should contain more than 8 characters."),
    email_address: z.string().email("Invalid Email Address"),
    phone_number: z.string().refine(value => /^\d{10}$/.test(value), {
        message: "Enter a valid 10-digit phone number",
    }),
    client_id: z.string(),
    api_key: z.string(),
    api_secret: z.string(),
    nefty: z.boolean(),
    bunnefty: z.boolean(),
    stop_algo: z.boolean(),
    target: z.number().min(0, { message: "Target must be a positive number" }).optional(),
    loss: z.number().min(0, { message: "Loss must be a positive number" }).optional(),
    neftyLotes: z.nativeEnum(Lotes, { errorMap: () => ({ message: 'Lotes must be between 1 and 10' }) }),
    bunneftyLotes: z.nativeEnum(Lotes, { errorMap: () => ({ message: 'Lotes must be between 1 and 10' }) })
});


export default function RegisterPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            username: "",
            user_password: "",
            confirm_password: "",
            email_address: "",
            phone_number: "",
            client_id: "",
            api_key: "",
            api_secret: "",
            nefty: false,
            bunnefty: false,
            stop_algo: false,
            target: 40000,
            loss: 5000,
            neftyLotes: Lotes.ONE,
            bunneftyLotes: Lotes.ONE
        },
    });

    function handleRegistration(values: z.infer<typeof formSchema>) {
        
        
        axios
            .post('http://127.0.0.1:5000/register', values)
            .then((response) => {
                toast({ description: response.data.message });
            })
            .catch((error) => {
                if (error.response) {
                    toast({ description: error.response.data.error });
                    console.error(error.response.status);
                    console.error(error.response.headers);
                } else if (error.request) {
                    console.error(error.request);
                } else {
                    console.error('Error', error.message);
                }
            });
    }

    const [nefty, setNefty] = useState(false);
    const [bunnefty, setBunnefty] = useState(false);
    const [stopAlgo, setStopAlgo] = useState(false);
    const [neftyLotes, setNeftyLotes] = useState(Lotes.ONE); // State to manage Nefty Lotes
    const [bunneftyLotes, setBunneftyLotes] = useState(Lotes.ONE); // State to manage Bunnefty Lotes


    const handleNeftyChange = () => {
        setNefty(!nefty);
        form.setValue("nefty", !nefty);
    };

    const handleBunneftyChange = () => {
        setBunnefty(!bunnefty);
        form.setValue("bunnefty", !bunnefty);
    };

    const handleStopAlgoChange = () => {
        setStopAlgo(!stopAlgo);
        form.setValue("stop_algo", !stopAlgo);
    };

    const handleNeftyLotesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lotes = Number(e.target.value) as Lotes;
        setNeftyLotes(lotes); // Update state
        form.setValue("neftyLotes", lotes); // Update form value
    };

    const handleBunneftyLotesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lotes = Number(e.target.value) as Lotes;
        setBunneftyLotes(lotes); // Update state
        form.setValue("bunneftyLotes", lotes); // Update form value
    };


    return (
        <div className="flex justify-center p-10" >
            <div className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2 p-10 rounded-2xl border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-8">
                        <h1 className="flex justify-center text-2xl font-semibold">Register</h1>
                        {/* Full Name */}
                        <FormField
                            control={form.control}
                            name="full_name"
                            render={({ field }) => (
                                <FormItem>
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">Full Name</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
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
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">User Name</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
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
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">Password</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
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
                            name="confirm_password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                    <FormLabel className="w-full md:w-1/2">Confirm Password</FormLabel>
                                    <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="Confirm Password" {...field} type="password" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Email*/}
                        <FormField
                            control={form.control}
                            name="email_address"
                            render={({ field }) => (
                                <FormItem>
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">Email Address</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
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
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">Phone Number</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
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
                                   <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                   <FormLabel className="w-full md:w-1/2">ClientID</FormLabel>
                                   <FormControl className="w-full md:w-1/2">
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
                                     <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                     <FormLabel className="w-full md:w-1/2">API Key</FormLabel>
                                     <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="API Key" {...field} required />
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
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                    <FormLabel className="w-full md:w-1/2">API Secret</FormLabel>
                                    <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="API SECRET" {...field} required />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <div className="flex items-center w-2/3 justify-between ">
                            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                <input
                                    type="checkbox"
                                    id="nefty"
                                    checked={nefty}
                                    onChange={handleNeftyChange}
                                />
                                <FormLabel htmlFor="nefty" className="pl-2">Nefty</FormLabel>
                                </div>
                                {(nefty ) && (
                                    <div>
                                         <FormLabel className="w-full md:w-1/2">Lot Size</FormLabel>
                                         <FormControl className="w-full md:w-1/2">
                                            <select
                                                id="lotes"
                                                value={form.getValues('neftyLotes')}
                                                onChange={handleNeftyLotesChange}
                                            >
                                                {Object.values(Lotes).filter(Number).map((value) => (
                                                    <option key={value} value={value}>{value}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                        {/* Bunnefty Checkbox */}
                        <FormItem>
                        <div className="flex items-center w-2/3 justify-between ">
                        <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                <input
                                    type="checkbox"
                                    id="bunnefty"
                                    checked={bunnefty}
                                    onChange={handleBunneftyChange}
                                />
                                <FormLabel htmlFor="bunnefty" className="pl-2">Bunnefty</FormLabel>
                                </div>
                                {( bunnefty) && (
                                    <div>
                                        <FormLabel className="w-full md:w-1/2">Lot Size</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <select
                                                id="lotes"
                                                value={form.getValues('bunneftyLotes')}
                                                onChange={handleBunneftyLotesChange}
                                            >
                                                {Object.values(Lotes).filter(Number).map((value) => (
                                                    <option key={value} value={value}>{value}</option>
                                                ))}
                                            </select>
                                        </FormControl>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                        <FormItem>
                            <div className="flex items-center justify-between">
                            <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                    <input
                                        type="checkbox"
                                        id="stop_algo"
                                        checked={stopAlgo}
                                        onChange={handleStopAlgoChange}
                                    />
                                    <FormLabel htmlFor="stop_algo" className="pl-2">Stop algo when</FormLabel>
                                </div>
                                {(stopAlgo) && (
                                    <div className="flex space-x-4">
                                        <FormControl className="w-full md:w-1/2">
                                            <Input
                                                type="tel"
                                                placeholder="Target"
                                                {...form.register("target")}
                                            />
                                           
                                        </FormControl>
                                        <FormControl className="w-full md:w-1/2">
                                            <Input
                                                 type="tel"
                                                 placeholder="Loss"
                                                 {...form.register("loss")}
                                                
                                            />
                                        </FormControl>
                                    </div>
                                )}
                            </div>
                        </FormItem>
                        {/* Submit Button */}
                        <div className="flex flex-col justify-center gap-5">
                            <Button type="submit">Submit</Button>
                            <p>Already have an account... <Link href={"/login"} className="pl-2 text-blue-600">Sign-In</Link></p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
