<?php

/*
 |--------------------------------------------------------------------------
 | Application Routes
 |--------------------------------------------------------------------------
 |
 | Here is where you can register all of the routes for an application.
 | It's a breeze. Simply tell Laravel the URIs it should respond to
 | and give it the Closure to execute when that URI is requested.
 |
 */

Route::any('/api/user/signup', array(
    'before' => 'custom.signupCheck',
    'uses' => 'UserController@signup'
));
//in real life this would need to be over HTTPS
Route::any('/api/user/login', array(
    'before' => 'custom.loginCheck',
    'uses' => 'UserController@login'
));
Route::any('/api/user/logout', 'UserController@logout');

Route::group(array('prefix' => 'user'), function() {
    Route::resource('expense', 'ExpenseController');
});

Route::group(array(
    'prefix' => 'api',
    'before' => 'custom.api'
), function() {
    Route::resource('expense', 'ExpenseController');
});
