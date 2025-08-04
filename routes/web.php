<?php

use App\Http\Controllers\FormController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('home');
});

Route::get('/reactor', function () {
    return view('reactor');
});

Route::get('/rapid', function () {
    return view('rapid');
});

Route::get('/law-enforcement', function () {
    return view('law-enforcement');
});

Route::get('/regulators', function () {
    return view('regulators');
});

Route::get('/cybersecurity', function () {
    return view('cybersecurity');
});

Route::get('/why-cxiagency', function () {
    return view('why-cxiagency');
});

Route::get('/partners', function () {
    return view('partners');
});

Route::get('/kyt', function () {
    return view('kyt');
});

Route::post('/submit', [FormController::class, 'submit'])->name('submit');
