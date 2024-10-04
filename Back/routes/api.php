<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ChessController;
use App\Http\Controllers\StringValueController;

Route::get('/students', function () {
    return 'Students List';
});

Route::post('/students', function () {
    return 'Create';
});

Route::put('/students', function () {
    return 'Act';
});

Route::post('/queens-attack', [ChessController::class, 'queensAttack']);

Route::post('/max-value', [StringValueController::class, 'calculateMaxValue']);