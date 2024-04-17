"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { EllipsisVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';

interface Order {
    id: number;
    user_id: string;
    scrip_type_id: number;
    buy_qty: number;
    buy_price: number;
    sell_qty: number;
    sell_price: number;
    order_buy_datetime: string;
    order_sell_datatime: string;
    profit_loss: number;
}

function redirectToLogin() {
    window.location.href = '/';
}

function logout() {
    // Clear authentication status from session storage
    sessionStorage.removeItem('isAuthenticated');
    // Redirect to the login page
    redirectToLogin();
}

async function getAllOrders(user_id: string): Promise<Order[]> {
    const apiUrl = `http://91.108.110.32:5000/orders/user/${user_id}`;
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching all orders:', error);
        return [];
    }
}

async function getFilteredOrders(userId: string, scripTypeId: string, fromDate: string, toDate: string): Promise<Order[]> {
    const apiUrl = `http://91.108.110.32:5000/orders/filter?user_id=${userId}&scrip_type_id=${scripTypeId}&from_date=${fromDate}&to_date=${toDate}`;
    try {
        const response = await axios.get(apiUrl);
        return response.data;
    } catch (error) {
        console.error('Error fetching filtered orders:', error);
        if (axios.isAxiosError(error) && error.response) {
            const errorMessage = error.response.data.error || 'An unknown error occurred.';
            useToast().toast({ description: errorMessage });
        } else {
            useToast().toast({ description: 'An unknown error occurred.' });
        }
        return [];
    }
}


export default function TableDemo() {
    const [userId, setUserId] = useState('');
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalProfitLoss, setTotalProfitLoss] = useState<number>(0);
    const [totalBuyPrice, setTotalBuyPrice] = useState(0);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [scripTypeId, setScripTypeId] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check authentication status and set user ID from session storage
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        if (!isAuthenticated) {
            redirectToLogin();
        }

        const storedUserId = sessionStorage.getItem('user_id');
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setUserId('Unknown');
        }
    }, []);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const allOrders = await getAllOrders(userId);
                setOrders(allOrders);
    
                // Calculate total profit/loss
                const totalProfitLoss = allOrders.reduce((acc, order) => {
                    let profitLossValue;
    
                    // Handle profit_loss data type (string or number)
                    if (typeof order.profit_loss === 'string') {
                        profitLossValue = parseFloat(order.profit_loss);
                        if (isNaN(profitLossValue)) {
                            // If parsing failed, set to zero and log error
                            console.error(`Error parsing profit_loss for order ${order.id}: ${order.profit_loss}`);
                            profitLossValue = 0;
                        }
                    } else {
                        profitLossValue = order.profit_loss;
                    }
    
                    // Add profit/loss to the accumulator
                    return acc + profitLossValue;
                }, 0);
    
                // Ensure totalProfitLoss is a valid number
                if (isNaN(totalProfitLoss)) {
                    console.error('Error: totalProfitLoss is NaN');
                    setTotalProfitLoss(0);
                } else {
                    setTotalProfitLoss(totalProfitLoss);
                }
    
                // Calculate total buy price
                const totalBuyPrice = allOrders.reduce((acc, order) => {
                    // Calculate buy price for each order
                    return acc + order.buy_price * order.buy_qty;
                }, 0);
                
                setTotalBuyPrice(totalBuyPrice);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
    
        if (userId) {
            fetchOrders();
        }
    }, [userId]);
    

    const handleFromDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFromDate(e.target.value);
    };

    const handleToDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setToDate(e.target.value);
    };

    const handleScripTypeIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setScripTypeId(e.target.value);
    };

    const fetchFilteredOrders = async () => {
        setError(null);
    
        if (!userId) {
            setError('User ID is required.');
            return;
        }
    
        let filteredOrders;
        if (!fromDate && !toDate && !scripTypeId) {
            filteredOrders = await getAllOrders(userId);
        } else {
            filteredOrders = await getFilteredOrders(userId, scripTypeId, fromDate, toDate);
        }
    
        // Check if filteredOrders is empty
        if (!filteredOrders || filteredOrders.length === 0) {
            console.error('No filtered orders found.');
            setOrders([]);
            setTotalProfitLoss(0);
            setTotalBuyPrice(0);
            return;
        }
    
        setOrders(filteredOrders);
    
        // Calculate total profit/loss considering both positive and negative profit/loss
        const totalProfitLoss = filteredOrders.reduce((acc, order) => {
            // Parse profit/loss if necessary
            let profitLossValue = order.profit_loss;
            if (typeof order.profit_loss === 'string') {
                profitLossValue = parseFloat(order.profit_loss);
            }
    
            // Add profit/loss to the accumulator
            if (!isNaN(profitLossValue)) {
                return acc + profitLossValue;
            } else {
                // Log error for invalid profit/loss value
                console.error(`Invalid profit/loss value for order ${order.id}: ${order.profit_loss}`);
                return acc;
            }
        }, 0);
    
        // Ensure totalProfitLoss is a valid number
        if (isNaN(totalProfitLoss)) {
            console.error('Error: totalProfitLoss is NaN');
            setTotalProfitLoss(0);
        } else {
            setTotalProfitLoss(totalProfitLoss);
        }
    
        // Calculate total buy price
        const totalBuyPrice = filteredOrders.reduce((acc, order) => acc + order.buy_price * order.buy_qty, 0);
        setTotalBuyPrice(totalBuyPrice);
    };
    

    return (
        <div className="w-full h-full pt-10 px-4">
            <div className='flex justify-between'>
                <h1 className="text-lg font-semibold pb-10">Hello {userId}</h1>
                <DropdownMenu>
                    <DropdownMenuTrigger className='h-10 W-10 rounded-md border'>
                        <EllipsisVertical size={20} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Button onClick={logout}>Logout</Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-col gap-6">
                <div className="input-container flex flex-col md:flex-row gap-3 mb-8">
                    <div className="flex flex-col md:flex-row gap-2">
                        <Label htmlFor="fromDate" className="font-semibold pt-1.5">From Date :</Label>
                        <Input
                            id="fromDate"
                            type="date"
                            value={fromDate}
                            onChange={handleFromDateChange}
                            placeholder="YYYY-MM-DD"
                            className="w-full md:w-auto"
                        />
                    </div>
                    <div className="flex flex-col md:flex-row gap-2">
                        <Label htmlFor="toDate" className="font-semibold pt-1.5">To Date :</Label>
                        <Input
                            id="toDate"
                            type="date"
                            value={toDate}
                            onChange={handleToDateChange}
                            placeholder="YYYY-MM-DD"
                            className="w-full md:w-auto"
                        />
                    </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 mb-8">
                    <Label htmlFor="scripTypeId" className="font-semibold pt-1.5">Scrip Type ID :</Label>
                    <Input
                        id="scripTypeId"
                        type="text"
                        value={scripTypeId}
                        onChange={handleScripTypeIdChange}
                        placeholder="Enter Scrip Type ID"
                        className="w-full md:w-1/4"
                    />
                    <Button onClick={fetchFilteredOrders} className="md:mr-2">Fetch Orders</Button>

                    {error && <div className="text-red-500 pt-2">{error}</div>}
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="text-center text-lg font-semibold">No orders found</div>
            ) : (
                <div className="overflow-x-auto">
                    <Table className="w-full border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Scrip Type ID</TableHead>
                                <TableHead>Buy Qty</TableHead>
                                <TableHead>Buy Price</TableHead>
                                <TableHead>Sell Qty</TableHead>
                                <TableHead>Sell Price</TableHead>
                        
                                <TableHead>Profit/Loss</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id} style={{ backgroundColor: order.buy_qty * order.buy_price > order.sell_qty * order.sell_price ? 'pink' : 'lightgreen' }}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.user_id}</TableCell>
                                    <TableCell>{order.scrip_type_id}</TableCell>
                                    <TableCell>{order.buy_qty}</TableCell>
                                    <TableCell>{order.buy_price}</TableCell>
                                    <TableCell>{order.sell_qty}</TableCell>
                                    <TableCell>{order.sell_price}</TableCell>
                                   
                                    <TableCell>{order.profit_loss}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={9} className="text-right pr-24 font-bold text-sm">Total</TableCell>
                                <TableCell style={{ color: totalProfitLoss < 0 ? 'red' : 'green' }}>
                                    {totalProfitLoss.toFixed(2)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            )}
        </div>
    );
}
