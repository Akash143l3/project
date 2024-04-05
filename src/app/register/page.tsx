// RegistrationPage.js
"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { z } from "zod";


const FormDataSchema = z.object({
    first_name: z.string().min(2, "error"),
    last_name: z.string().min(2,"error").nullable(),
    user_id: z.string(),
    user_password: z.string(),
    email_address: z.string().email(),
    phone_number: z.string(),
    client_id: z.string(),
    api_key: z.string(),
    api_secret: z.string(),
    auth_key: z.string(),
    target_profit: z.number().min(40000),
    target_loss: z.number().min(5000),
    scrip_type: z.array(z.string()),
    stop_algo: z.boolean(),
    lot_qty: z.array(z.string()),
});


interface FormData {
    first_name: string;
    last_name: string;
    user_id: string;
    user_password: string;
    email_address: string;
    phone_number: string;
    client_id: string;
    api_key: string;
    api_secret: string;
    auth_key: string;
    target_profit: number;
    target_loss: number;
    scrip_type: string[];
    stop_algo: boolean; // Change false to boolean
    lot_qty: string[];
}

interface ValidationError {
    path: string[]; // The path to the field that failed validation
    message: string; // The error message
}

function redirectToHomePage() {
    window.location.href = '/home';
}

export default function RegistrationPage() {
    const { toast } = useToast();
    const [formData, setFormData] = useState<FormData>({
        first_name: "",
        last_name: "",
        user_id: "",
        user_password: "",
        email_address: "",
        phone_number: "",
        client_id: "",
        api_key: "",
        api_secret: "",
        auth_key: "",
        target_profit: 40000,
        target_loss: 5000,
        scrip_type: [],
        stop_algo: false,
        lot_qty: ["1"]
    });

    useEffect(() => {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');

        // If authenticated, redirect to the home page
        if (isAuthenticated) {
            redirectToHomePage();
        }
    }, []);
    const [niftyLotSize, setNiftyLotSize] = useState("1");
    const [bankNiftyLotSize, setBankNiftyLotSize] = useState("1");

    const [errorMessage, setErrorMessage] = useState<ValidationError | null>(null); // State to hold error message
    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement | HTMLSelectElement;

        if (type === "tel" && isNaN(Number(value))) {
            // Ignore alphabetic characters
            return;
        }

        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === "stop_algo") {
                setFormData({ ...formData, stop_algo: checked });
            } else {
                let updatedScripType = [...formData.scrip_type];
                if (checked) {
                    updatedScripType = [...updatedScripType, value];
                } else {
                    updatedScripType = updatedScripType.filter(item => item !== value);
                }
                setFormData({ ...formData, scrip_type: updatedScripType });
            }
        } else if (name === "niftyLotSize") {
            const niftyLotSizeValue = value;
            setNiftyLotSize(niftyLotSizeValue);
            if (formData.scrip_type.includes("BANKNIFTY")) {
                setFormData({ ...formData, scrip_type: ["Nifty", "BANKNIFTY"], lot_qty: [niftyLotSizeValue, bankNiftyLotSize] });
            } else {
                setFormData({ ...formData, scrip_type: ["Nifty"], lot_qty: [niftyLotSizeValue] });
            }
        } else if (name === "bankniftyLotSize") {
            const bankNiftyLotSizeValue = value;
            setBankNiftyLotSize(bankNiftyLotSizeValue);
            if (formData.scrip_type.includes("Nifty")) {
                setFormData({ ...formData, scrip_type: ["Nifty", "BANKNIFTY"], lot_qty: [niftyLotSize, bankNiftyLotSizeValue] });
            } else {
                setFormData({ ...formData, scrip_type: ["BANKNIFTY"], lot_qty: [bankNiftyLotSizeValue] });
            }
        } else if (name === "target_profit") {
            const targetProfitValue = Number(value);
            setFormData({ ...formData, target_profit: targetProfitValue });
            if (targetProfitValue < 40000) {
                setErrorMessage({
                    path: ["target_profit"], // Specify the path to the field that failed validation
                    message: "Target profit must be at least 40000."
                });
            } else {
                setErrorMessage(null);
            }
        } else if (name === "target_loss") {
            const targetLossValue = Number(value);
            setFormData({ ...formData, target_loss: targetLossValue });
            if (targetLossValue < 5000) {
                setErrorMessage({
                    path: ["target_loss"], // Specify the path to the field that failed validation
                    message: "Target loss must be at least 5000."
                });
            } else {
                setErrorMessage(null);
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };






    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            const validatedData = FormDataSchema.parse(formData);
            axios
                .post("http://127.0.0.1:5000/register", validatedData)
                .then((response) => {
                    console.log(response.data);
                    toast({ description: response.data.message });
                    sessionStorage.setItem('isAuthenticated', 'true');
                    redirectToHomePage();
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
        } catch (error) {
            if (error instanceof z.ZodError) {
                // Handle validation errors
                console.error('Validation failed:', error.errors);
            } else {
                console.error('Unknown error:', error);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Register your account</h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    className="input-field"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                                {errorMessage && errorMessage.path.includes('first_name') && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessage.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    className="input-field"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Repeat similar structure for other input fields */}
                        {/* User ID */}
                        <div>
                            <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                                User ID
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="user_id"
                                    name="user_id"
                                    type="text"
                                    autoComplete="username"
                                    className="input-field"
                                    value={formData.user_id}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* User Password */}
                        <div>
                            <label htmlFor="user_password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="user_password"
                                    name="user_password"
                                    type="password"
                                    autoComplete="current-password"
                                    className="input-field"
                                    value={formData.user_password}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email Address */}
                        <div>
                            <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="email_address"
                                    name="email_address"
                                    type="email"
                                    autoComplete="email"
                                    className="input-field"
                                    value={formData.email_address}
                                    onChange={handleChange}
                                />
                                 {errorMessage && errorMessage.path.includes('email_address') && (
                                    <p className="text-red-500 text-xs mt-1">{errorMessage.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    autoComplete="tel"
                                    className="input-field"
                                    value={formData.phone_number}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Client ID */}
                        <div>
                            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
                                Client ID
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="client_id"
                                    name="client_id"
                                    type="text"
                                    autoComplete="client-id"
                                    className="input-field"
                                    value={formData.client_id}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* API Key */}
                        <div>
                            <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
                                API Key
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="api_key"
                                    name="api_key"
                                    type="text"
                                    autoComplete="api-key"
                                    className="input-field"
                                    value={formData.api_key}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>




                        {/* API Secret */}
                        <div>
                            <label htmlFor="api_secret" className="block text-sm font-medium text-gray-700">
                                API Secret
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="api_secret"
                                    name="api_secret"
                                    type="text"
                                    autoComplete="api-secret"
                                    className="input-field"
                                    value={formData.api_secret}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Auth Key */}
                        <div>
                            <label htmlFor="api_key" className="block text-sm font-medium text-gray-700">
                                Auth Key
                            </label>
                            <div className="mt-1">
                                <Input
                                    id="auth_key"
                                    name="auth_key"
                                    type="text"
                                    autoComplete="auth-key"
                                    className="input-field"
                                    value={formData.auth_key}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>


                        <h1>What do you want to Trade in </h1>

                        {/* Checkbox for Scrip Type (Nifty) */}
                        <div className="flex items-center">
                            <Input
                                id="scrip_type_nifty"
                                name="scrip_type"
                                type="checkbox"
                                value="Nifty"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={formData.scrip_type.includes("Nifty")}
                                onChange={handleChange}
                            />
                            <label htmlFor="scrip_type_nifty" className="ml-2 block text-sm text-gray-900">
                                Nifty
                            </label>
                        </div>

                        {/* Input field for Nifty Lot Size */}
                        {formData.scrip_type.includes("Nifty") && (
                            <div>
                                <label htmlFor="niftyLotSize" className="block text-sm font-medium text-gray-700">
                                    Nifty Lot Qty
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="niftyLotSize"
                                        name="niftyLotSize"
                                        className="input-field"
                                        value={niftyLotSize}
                                        onChange={handleChange}
                                        required
                                    >
                                        {/* Mapping options from 1 to 10 */}
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}


                        {/* Checkbox for Scrip Type (Bank Nifty) */}
                        <div className="flex items-center">
                            <Input
                                id="scrip_type_bank_nifty"
                                name="scrip_type"
                                type="checkbox"
                                value="BANKNIFTY"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={formData.scrip_type.includes("BANKNIFTY")}
                                onChange={handleChange}
                            />
                            <label htmlFor="scrip_type_bank_nifty" className="ml-2 block text-sm text-gray-900">
                                Bank Nifty
                            </label>
                        </div>

                        {/* Input field for Bank Nifty Lot Size */}
                        {formData.scrip_type.includes("BANKNIFTY") && (
                            <div>
                                <label htmlFor="bankniftyLotSize" className="block text-sm font-medium text-gray-700">
                                    Bank Nifty Lot Qty
                                </label>
                                <div className="mt-1">

                                    <select
                                        id="bankniftyLotSize"
                                        name="bankniftyLotSize"
                                        className="input-field"
                                        value={bankNiftyLotSize}
                                        onChange={handleChange}
                                        required
                                    >
                                        {/* Mapping options from 1 to 10 */}
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>
                                                {index + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                        {/* Checkbox for Stop Algo */}
                        {/* Checkbox for Stop Algo */}
                        <div className="flex items-center">
                            <Input
                                id="stop_algo"
                                name="stop_algo"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={formData.stop_algo}
                                onChange={handleChange}
                            />
                            <label htmlFor="stop_algo" className="ml-2 block text-sm text-gray-900">
                                Stop Algo When
                            </label>
                        </div>

                        {/* Input fields for Target Profit and Loss */}
                        {formData.stop_algo && (
                            <div >
                                <label htmlFor="target_loss" className="block text-sm font-medium text-gray-700">
                                    Target of Profit is
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="target_profit"
                                        name="target_profit"
                                        type="tel"
                                        min="40000"
                                        required
                                        className="input-field"
                                        value={formData.target_profit}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}
                        {formData.stop_algo && (
                            <div>
                                <label htmlFor="target_loss" className="block text-sm font-medium text-gray-700">
                                    Target of Loss is
                                </label>
                                <div className="mt-1">
                                    <Input
                                        id="target_loss"
                                        name="target_loss"
                                        type="tel"
                                        min="5000"
                                        required
                                        className="input-field"
                                        value={formData.target_loss}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col justify-center gap-5">
                            <Button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Register
                            </Button>
                            <p>Already have an account... <Link href={"/"} className="pl-2 text-blue-600">Sign-In</Link></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}