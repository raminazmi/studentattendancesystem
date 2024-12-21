<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\ClassRoomController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeacherController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\UserController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
// routes/web.php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard/home', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
    Route::get('/dashboard/profile', [UserController::class, 'index'])->name('profile');

    Route::prefix('dashboard/profile')->name('profile.')->group(function () {
        Route::get('/edit', [ProfileController::class, 'edit'])->name('edit');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });
    Route::prefix('dashboard/attendance')->name('attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::get('/add-new-attendance', [AttendanceController::class, 'create'])->name('create');
        Route::post('/', [AttendanceController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [AttendanceController::class, 'edit'])->name('edit');
        Route::put('/{id}', [AttendanceController::class, 'update'])->name('update');
        Route::get('/report', [AttendanceController::class, 'report'])->name('report');
        Route::get('/export', [AttendanceController::class, 'export'])->name('export');
        Route::get('/attendance-stats', [AttendanceController::class, 'getAttendanceStats']);
        Route::get('/attendance-statistics', [AttendanceController::class, 'getAttendanceStatistics']);
        Route::delete('/{id}', [AttendanceController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('dashboard/classes')->name('classes.')->group(function () {
        Route::get('/', [ClassRoomController::class, 'index'])->name('index');
        Route::get('/add-new-class', [ClassRoomController::class, 'create'])->name('create');
        Route::post('/', [ClassRoomController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [ClassRoomController::class, 'edit'])->name('edit');
        Route::put('/{id}', [ClassRoomController::class, 'update'])->name('update');
        Route::delete('/{id}', [ClassRoomController::class, 'destroy'])->name('destroy');
        Route::get('/{id}/attendance', [ClassRoomController::class, 'attendance'])->name('attendance');
        Route::post('/{id}/attendance', [ClassRoomController::class, 'saveAttendance'])->name('saveAttendance');
        Route::post('/{id}/save-attendance', [ClassRoomController::class, 'saveAttendance']);
    });


    Route::prefix('dashboard/teachers')->name('teachers.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');
        Route::get('/add-new-teacher', [TeacherController::class, 'create'])->name('create');
        Route::post('/', [TeacherController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [TeacherController::class, 'edit'])->name('edit');
        Route::put('/{id}', [TeacherController::class, 'update'])->name('update');
        Route::delete('/{id}', [TeacherController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('dashboard/students')->name('students.')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('/add-new-student', [StudentController::class, 'create'])->name('create');
        Route::post('/', [StudentController::class, 'store'])->name('store');
        Route::get('/{id}/edit', [StudentController::class, 'edit'])->name('edit');
        Route::put('/{id}', [StudentController::class, 'update'])->name('update');
        Route::delete('/{id}', [StudentController::class, 'destroy'])->name('destroy');
    });

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});
require __DIR__ . '/auth.php';
