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

const formSchema = z.object({
    username: z.string().min(2, { message: "Enter a vaild username.", }),
    password: z.string()
        .length(8, "Enter a vaild password."),
})

export default function LoginPage() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    })
    function onSubmit(values: z.infer<typeof formSchema>) {

        // ✅ This will be type-safe and validated.
        console.log(values)
    }


    return (
        <div className="flex justify-center p-10" >
            <div className=" w-1/3 p-10 rounded-2xl  border">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

                        <div className="flex flex-col justify-center gap-5">
                            <Button type="submit">Submit</Button>
                            <p>
                                <Link href={"/register"} className="text-sm">New User Registration ?</Link>
                                <span className="pl-10 text-blue-600 text-sm">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                           <button> Forget Password</button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Reset Password</DialogTitle>
                                                <DialogDescription>
                                                   
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="grid gap-4 py-4">
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="name" className="text-right ">
                                                     User Name
                                                    </Label>
                                                    <Input
                                                        id="username"
                                                        placeholder="Username"
                                                        className="col-span-2"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="password" className="text-right ">
                                                        New Password
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        placeholder="password"
                                                        className="col-span-2"
                                                        type="password"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-3 items-center gap-4">
                                                    <Label htmlFor="password" className="text-right w-max ">
                                                        confirm Password
                                                    </Label>
                                                    <Input
                                                        id="password"
                                                        placeholder="confirm Password"
                                                        className="col-span-2"
                                                        type="password"
                                                    />
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit">Save changes</Button>
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
