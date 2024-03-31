// RegistrationPage.js
"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";

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
    target_profit: number;
    target_loss: number;
    scrip_type: string[];
    stop_algo: boolean; // Change false to boolean
    lot_size: number;
    bankniftyLotSize: number;
}

export default function RegistrationPage() {
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
        target_profit: 40000,
        target_loss: 5000,
        scrip_type: [],
        stop_algo: false,
        lot_size: 1,
        bankniftyLotSize: 1
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (name === "stop_algo") {
                setFormData({ ...formData, stop_algo: checked });
            } else {
                if (checked) {
                    setFormData({ ...formData, scrip_type: [...formData.scrip_type, value] });
                } else {
                    setFormData({
                        ...formData,
                        scrip_type: formData.scrip_type.filter((item) => item !== value),
                    });
                }
            }
        } else if (name === "niftyLotSize") {
            setFormData({ ...formData, lot_size: parseInt(value) });
        } else if (name === "bankniftyLotSize") {
            setFormData({ ...formData, bankniftyLotSize: parseInt(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        axios
            .post("http://127.0.0.1:5000/register", formData)
            .then((response) => {
                console.log(response.data);
                // Handle success
            })
            .catch((error) => {
                console.error(error);
                console.log(error.response.data);
                // Handle error
            });
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
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    autoComplete="given-name"
                                    required
                                    className="input-field"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <div className="mt-1">
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    autoComplete="family-name"
                                    required
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
                                <input
                                    id="user_id"
                                    name="user_id"
                                    type="text"
                                    autoComplete="username"
                                    required
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
                                <input
                                    id="user_password"
                                    name="user_password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
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
                                <input
                                    id="email_address"
                                    name="email_address"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="input-field"
                                    value={formData.email_address}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <div className="mt-1">
                                <input
                                    id="phone_number"
                                    name="phone_number"
                                    type="tel"
                                    autoComplete="tel"
                                    required
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
                                <input
                                    id="client_id"
                                    name="client_id"
                                    type="text"
                                    autoComplete="client-id"
                                    required
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
                                    required
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
                                <input
                                    id="api_secret"
                                    name="api_secret"
                                    type="text"
                                    autoComplete="api-secret"
                                    required
                                    className="input-field"
                                    value={formData.api_secret}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Checkbox for Scrip Type (Nifty) */}
                        <div className="flex items-center">
                            <input
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
                                    Nifty Lot Size
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="niftyLotSize"
                                        name="niftyLotSize"
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.lot_size}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Checkbox for Scrip Type (Bank Nifty) */}
                        <div className="flex items-center">
                            <input
                                id="scrip_type_bank_nifty"
                                name="scrip_type"
                                type="checkbox"
                                value="Bank Nifty"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={formData.scrip_type.includes("Bank Nifty")}
                                onChange={handleChange}
                            />
                            <label htmlFor="scrip_type_bank_nifty" className="ml-2 block text-sm text-gray-900">
                                Bank Nifty
                            </label>
                        </div>

                        {/* Input field for Bank Nifty Lot Size */}
                        {formData.scrip_type.includes("Bank Nifty") && (
                            <div>
                                <label htmlFor="bankniftyLotSize" className="block text-sm font-medium text-gray-700">
                                    Bank Nifty Lot Size
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="bankniftyLotSize"
                                        name="bankniftyLotSize"
                                        type="number"
                                        min="1"
                                        required
                                        className="input-field"
                                        value={formData.bankniftyLotSize}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Checkbox for Stop Algo */}
                        {/* Checkbox for Stop Algo */}
                        <div className="flex items-center">
                            <input
                                id="stop_algo"
                                name="stop_algo"
                                type="checkbox"
                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                checked={formData.stop_algo}
                                onChange={handleChange}
                            />
                            <label htmlFor="stop_algo" className="ml-2 block text-sm text-gray-900">
                                Stop Algo
                            </label>
                        </div>

                        {/* Input fields for Target Profit and Loss */}
                        {formData.stop_algo && (
                            <div>
                                <label htmlFor="target_profit" className="block text-sm font-medium text-gray-700">
                                    Target Profit
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="target_profit"
                                        name="target_profit"
                                        type="number"
                                        min="0"
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
                                    Target Loss
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="target_loss"
                                        name="target_loss"
                                        type="number"
                                        min="0"
                                        required
                                        className="input-field"
                                        value={formData.target_loss}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
