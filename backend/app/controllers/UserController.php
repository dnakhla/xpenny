<?php

class UserController extends \BaseController {

    public function signup() {
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

    public function login() {
        $credentials = array(
            'email' => Request::get('email'),
            'password' => Request::get('password'),
        );
        if (Auth::attempt($credentials, true)) {
            return Response::json('Success!', 200);
        } else {
            return Response::json('Incorrect Login or no Login Passed', 403);
        }
    }

    public function logout() {
        if (Auth::logout()) {
            return Response::json(array('error' => false), 200);
        } else {
            return Response::json(array('error' => true), 500);
        }
    }

}
