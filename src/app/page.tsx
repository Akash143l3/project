"use client"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { useEffect } from 'react';

function redirectToHomePage() {
    window.location.href = '/home'; // Replace '/home' with your home page URL
}

const formSchema = z.object({
    user_id: z.string().min(2, { message: "Enter a valid username." }),
    user_password: z.string().min(6, "Enter a valid password."),
})

export default function LoginPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            user_id: "",
            user_password: ""
        },
    })

    useEffect(() => {
        // Check if authentication is already done
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');

        // If authenticated, redirect to the home page
        if (isAuthenticated) {
            redirectToHomePage(); // Replace '/home' with your home page URL
        }
    }, []);

    function handleLogin(values: z.infer<typeof formSchema>) {
        axios
            .post('http://127.0.0.1:5000/login', values)
            .then((response) => {
                console.log(response.data);

                sessionStorage.setItem('user_id', values.user_id);
                sessionStorage.setItem('isAuthenticated', 'true');

                // Redirect to the home page
                redirectToHomePage();
                toast({ description: response.data.message })
                // Handle successful login
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast({ description: error.response.data.error });
                } else {
                    toast({ description: "An error occurred while logging in. Please try again later." });
                }
            });
    }

    function handleResetPassword(user_id: any, newPassword: any, confirmPassword: any) {
        if (newPassword !== confirmPassword) {
            return toast({ description: "Confirm password is not the same" });
        }

        const data = {
            user_id,
            new_password: newPassword,
        };

        axios
            .put('http://127.0.0.1:5000/reset-password', data)
            .then((response) => {
                // Handle successful password reset
                toast({ description: response.data.message });
                sessionStorage.setItem('isAuthenticated', 'true');

                // Redirect to the home page
                redirectToHomePage();
            })
            .catch((error) => {
                console.error(error);
                if (error.response && error.response.data && error.response.data.error) {
                    toast({ description: error.response.data.error });
                } else {
                    toast({ description: "An error occurred while logging in. Please try again later." });
                }
                // Handle reset password error
            });
    }

    return (
        <div className="flex justify-center p-4 md:p-10">
            <div className="w-full md:w-1/2 lg:w-1/3 p-4 md:p-10 rounded-2xl border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4 md:space-y-8">
                        <div className="flex items-center justify-center"><img src="./logo.png" /></div>
                        <h1 className="text-2xl font-semibold text-center">Login</h1>

                        {/* User Name */}
                        <FormField
                            control={form.control}
                            name="user_id"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="flex flex-col md:flex-row items-start space-y-4 md:space-y-0 md:space-x-4">
                                        <FormLabel className="w-full md:w-1/3 ">User ID</FormLabel>
                                        <FormControl className="w-full md:w-2/3">
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
                                        <FormLabel className="w-full md:w-1/3 ">Password</FormLabel>
                                        <FormControl className="w-full md:w-2/3">
                                            <Input placeholder="Password" {...field} type="password" />
                                        </FormControl>
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col md:flex-col justify-between items-center gap-4">
                            <Button type="submit" className="w-full md:w-auto">Submit</Button>
                            <div className="flex justify-between  w-full">
                                <p className="flex md:text-left  ">
                                    <Link href={"/register"} className="text-sm">New User Registration ?</Link>
                                </p>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <button className="text-sm md:text-right ">Forgot Password</button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Reset Password</DialogTitle>
                                            <DialogDescription></DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="name" className="text-right md:w-auto">
                                                    User ID
                                                </Label>
                                                <Input id="user_id" placeholder=" User ID" className="col-span-2" required />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="newPassword" className="text-right">
                                                    New Password
                                                </Label>
                                                <Input id="newPassword" placeholder="New Password" className="col-span-2" type="password" required />
                                            </div>
                                            <div className="grid grid-cols-3 items-center gap-4">
                                                <Label htmlFor="confirmPassword" className="text-right lg:w-max md:w-max">
                                                    Confirm Password
                                                </Label>
                                                <Input id="confirmPassword" placeholder="Confirm Password" className="col-span-2" type="password" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="submit"
                                                onClick={() => {
                                                    const user_idInput = document.getElementById('user_id') as HTMLInputElement;
                                                    const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
                                                    const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

                                                    const user_id = user_idInput.value;
                                                    const newPassword = newPasswordInput.value;
                                                    const confirmPassword = confirmPasswordInput.value;

                                                    handleResetPassword(user_id, newPassword, confirmPassword);
                                                }}
                                            >
                                                Save changes
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
