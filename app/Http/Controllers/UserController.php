<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::latest()->paginate(10);

        $users->getCollection()->transform(function ($user) {
            return [
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password,
            ];
        });

        return Inertia::render('Users/Index', ['users' => $users]);
    }


    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function createExisting()
    {

        return Inertia::render('Users/CreateExisting');
    }

    public function createNew()
    {
        return Inertia::render('Users/CreateNew');
    }

    public function store(Request $request)
    {

        return redirect()->route('Users.index')->with('success', 'User created successfully.');
    }

    public function edit($id)
    {
        return Inertia::render('Users/Edit');
    }

    public function update(Request $request, $id)
    {

        return redirect()->route('Users.index')->with('success', 'User updated successfully.');
    }
    public function destroy($id)
    {
        // Find the order by ID or fail if it doesn't exist
        $order = Category::findOrFail($id);

        // Delete the order
        $order->delete();

        // Redirect back with a success message
        return redirect()->route('Users.index')->with('success', 'User deleted successfully.');
    }
}
