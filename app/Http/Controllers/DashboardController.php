<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard', [
            'totalSales' => 10,
            'pendingOrders' => 10,
            'workingOnOrders' => 10,
            'readyForDeliveryOrders' => 10,
            'deliveredOrders' => 10,
            'waitingForCashOrders' => 10,
            'lowStockSweets' => 10,
            'totalCustomers' => 10,
        ]);
    }
}
