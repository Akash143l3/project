"use client"
import { z } from "zod";
import axios from 'axios';
import { useEffect, useState } from 'react';
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

// Define enum for Lot Sizes
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

// Define form schema
const formSchema = z.object({
    first_name: z.string().min(3, { message: "First name must be more than two characters" }),
    last_name: z.string().min(3, { message: "Last name must be more than two characters" }),
    user_id: z.string().min(2, { message: "User ID must be at least 2 characters." }),
    user_password: z.string().min(8, { message: "Password should contain more than 8 characters." }),
    email_address: z.string().email("Invalid Email Address"),
    phone_number: z.string().refine(value => /^\d{10}$/.test(value), { message: "Enter a valid 10-digit phone number" }),
    client_id: z.string(),
    api_key: z.string(),
    api_secret: z.string(),
    target_profit: z.number().min(0, { message: "Target profit must be a positive number" }),
    target_loss: z.number().min(0, { message: "Target loss must be a positive number" }),
    scrip_type: z.string(),
    lot_size: z.number().min(1, { message: "Lot size must be a positive number" }),
    stop_algo: z.boolean(),
});

// Function to redirect to home page
function redirectToHomePage() {
    window.location.href = '/home';
}

export default function RegisterPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            first_name: "",
            last_name: "",
            user_id: "",
            user_password: "",
            email_address: "",
            phone_number: "",
            client_id: "",
            api_key: "",
            api_secret: "",
            target_profit: 0,
            target_loss: 0,
            scrip_type: "",
            lot_size: 1
        },
    });

    // Check if authentication is already done
    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');

        // If authenticated, redirect to the home page
        if (isAuthenticated) {
            redirectToHomePage();
        }
    }, []);

    // Function to handle form submission
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

    // State and functions to handle Nefty checkbox and lot size
    const [nefty, setNefty] = useState(false);
    const [neftyLotSize, setNeftyLotSize] = useState(Lotes.ONE);

    const handleNeftyChange = () => {
        setNefty(!nefty);
        form.setValue("scrip_type", !nefty ? "Nefty" : "");
    };

    const handleNeftyLotSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const lotSize = Number(e.target.value) as Lotes;
        setNeftyLotSize(lotSize);
        form.setValue("lot_size", lotSize);
    };

    // State and functions to handle Bunnefty checkbox and lot size
    const [bunnefty, setBunnefty] = useState(false);
    const [bunneftyLotSize, setBunneftyLotSize] = useState(Lotes.ONE);

    const handleBunneftyChange = () => {
        setBunnefty(!bunnefty);
        form.setValue("scrip_type", !bunnefty ? "Bunnefty" : "");
    };

    const handleBunneftyLotSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const lotSize = Number(e.target.value) as Lotes;
    setBunneftyLotSize(lotSize);
    form.setValue("lot_size", lotSize);
};
    // State and function to handle Stop Algo checkbox
    const [stopAlgo, setStopAlgo] = useState(false);

    const handleStopAlgoChange = () => {
        setStopAlgo(!stopAlgo);
        form.setValue("stop_algo", !stopAlgo);
    };
    
    return (
        <div className="flex justify-center p-10">
            <div className="w-full md:w-1/2 lg:w-2/3 xl:w-1/2 p-10 rounded-2xl border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleRegistration)} className="space-y-8">
                        <h1 className="flex justify-center text-2xl font-semibold">Register</h1>

                        {/* Full Name Field */}
                        <FormField
                            control={form.control}
                            name="first_name"
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

                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="last_name"
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

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="user_password"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                        <FormLabel className="w-full md:w-1/2">Password</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="Password" {...field} type="password" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Address Field */}
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

                        {/* Phone Number Field */}
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

                        {/* Client ID Field */}
                        <FormField
                            control={form.control}
                            name="client_id"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                        <FormLabel className="w-full md:w-1/2">Client ID</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="Client ID" {...field} type="tel" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* API Key Field */}
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

                        {/* API Secret Field */}
                        <FormField
                            control={form.control}
                            name="api_secret"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                        <FormLabel className="w-full md:w-1/2">API Secret</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <Input placeholder="API Secret" {...field} required />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Nefty Checkbox */}
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
                                {(nefty) && (
                                    <div>
                                        <FormLabel className="w-full md:w-1/2">Lot Size</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <select
                                                id="lotes"
                                                value={neftyLotSize}
                                                onChange={handleNeftyLotSizeChange}
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
                                    <FormLabel htmlFor="bunnefty" className="pl-2">Bank Nefty</FormLabel>
                                </div>
                                {(bunnefty) && (
                                    <div>
                                        <FormLabel className="w-full md:w-1/2">Lot Size</FormLabel>
                                        <FormControl className="w-full md:w-1/2">
                                            <select
                                                id="lotes"
                                                value={bunneftyLotSize}
                                                onChange={handleBunneftyLotSizeChange}
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

                        {/* Stop Algo Checkbox */}
                        <FormItem>
                            <div className="flex flex-col ">
                                <div className="flex  flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4 pb-5">
                                    <input
                                        type="checkbox"
                                        id="stop_algo"
                                        checked={stopAlgo}
                                        onChange={handleStopAlgoChange}
                                    />
                                    <FormLabel htmlFor="stop_algo" className="pl-2">Stop algo when</FormLabel>
                                </div>
                                {(stopAlgo) && (
                                    <div className="flex flex-col space-x-4 gap-5">
                                        <div className="flex items-center gap-2">
                                            <p className="flex">Target of </p>
                                            <FormControl className="w-full md:w-1/2">
                                                <Input
                                                    type="tel"
                                                    placeholder="Target"
                                                    {...form.register("target_profit")}
                                                />
                                            </FormControl>
                                            <p>is reached</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <p className="flex"> Loss of</p>
                                            <FormControl className="w-full md:w-1/2">
                                                <Input
                                                    type="tel"
                                                    placeholder="Loss"
                                                    {...form.register("target_loss")}
                                                />
                                            </FormControl>
                                            <p>is reached</p>
                                        </div>
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
    );
}
