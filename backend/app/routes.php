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

Route::get('/', function() {
    return View::make('hello');
});

Route::any('/api/login', function() {
    if (Auth::guest()) {
        if (Input::has(array(
            'email',
            'password'
        ))) {
            $credentials = array(
                'email' => Request::get('email'),
                'password' => Request::get('password'),
            );
            if (Auth::attempt($credentials, true)) {
                return Response::json('Success!', 200);
            } else {
                return Response::json('Incorrect Login or no Login Passed', 403);
            }
        } else {
            return Response::json('No Credentials Passed', 401);
        }
    } else {
        return Response::json('You\'re Already Logged In!', 200);
    }
});
Route::any('/api/logout', function() {
    if (Auth::logout()) {
        return Response::json(array('error' => false), 200);
    } else {
        return Response::json(array('error' => true), 500);
    }
});

Route::any('/api/signup', function() {
    if (Input::has(array(
        'name',
        'email',
        'password'
    ))) {
        $usersExists = (bool)User::where('email', Request::get('email'))->count();
        if ($usersExists) {
            return Response::json(array(
                'error' => true,
                'message' => 'email already being used'
            ), 500);
        } else {
            $user = new User;
            $user->name = Request::get('name');
            $user->email = Request::get('email');
            $user->password = Hash::make(Request::get('password'));
            $user->save();
            Auth::loginUsingId($user->id);
            return Response::json(array(
                'error' => false,
                'message' => 'user created and logged in'
            ), 200);
        }
    } else {
        return Response::json(array(
            'error' => true,
            'message' => 'necessary fields (name, email, password) not passed'
        ), 500);
    }

});

Route::group(array(
    'prefix' => 'api',
    'before' => 'custom.api'
), function() {
    Route::resource('expense', 'ExpenseController');
});
