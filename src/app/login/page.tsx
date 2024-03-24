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


const formSchema = z.object({
    username: z.string().min(2, { message: "Enter a vaild username.", }),
    user_password: z.string()
        .min(8, "Enter a vaild password."),
})

export default function LoginPage() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            user_password: "",
        },
    })
    function handleLogin(values: z.infer<typeof formSchema>) {
        axios
            .post('http://127.0.0.1:5000/login', values)
            .then((response) => {
                console.log(response.data);
                toast({ description: response.data.message })
                // Handle successful login
            })
            .catch((error) => {
                console.error(error);
                toast({ description: error.response.data.error })
                // Handle login error
            });
    }



    function handleResetPassword(username: any, newPassword: any, confirmPassword: any) {
        if (newPassword !== confirmPassword) {
            // Handle password mismatch error
            return toast({ description: "confirm password is not same" });
        }
       

        const data = {
            username,
            new_password: newPassword,
        };

        axios
            .put('http://127.0.0.1:5000/reset-password', data)
            .then((response) => {
                // Handle successful password reset
                toast({ description: response.data.message });
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    toast({ description: error.response.data.error }); // Print the error message from the server
                    console.error(error.response.status); // Print the status code
                    console.error(error.response.headers); // Print the headers
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error(error.request);
                } else {
                    // Something happened in setting up the request that triggered an error
                    console.error('Error', error.message);
                }
                // Handle reset password error
            });
    }


    return (
        <div className="flex justify-center p-10" >
            <div className=" w-1/3 p-10 rounded-2xl  border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-8">
                        <h1 className="flex justify-center text-2xl font-semibold">Login</h1>

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

                        <div className="flex flex-col justify-center gap-5">
                            <Button type="submit">Submit</Button>
                            <p>
                                <Link href={"/register"} className="text-sm">New User Registration ?</Link>
                                <span className="pl-10 text-blue-600 text-sm">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <button>Forget Password</button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Reset Password</DialogTitle>
                                                <DialogDescription></DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right">
                                                        User Name
                                                    </Label>
                                                    <Input id="username" placeholder="Username" className="col-span-2" />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="newPassword" className="text-right">
                                                        New Password
                                                    </Label>
                                                    <Input id="newPassword" placeholder="New Password" className="col-span-2" type="password" />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="confirmPassword" className="text-right w-max">
                                                        Confirm Password
                                                    </Label>
                                                    <Input id="confirmPassword" placeholder="Confirm Password" className="col-span-2" type="password" />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button
                                                    type="submit"
                                                    onClick={() => {
                                                        const usernameInput = document.getElementById('username') as HTMLInputElement;
                                                        const newPasswordInput = document.getElementById('newPassword') as HTMLInputElement;
                                                        const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement;

                                                        const username = usernameInput.value;
                                                        const newPassword = newPasswordInput.value;
                                                        const confirmPassword = confirmPasswordInput.value;

                                                        handleResetPassword(username, newPassword, confirmPassword);
                                                    }}
                                                >
                                                    Save changes
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </span>
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
