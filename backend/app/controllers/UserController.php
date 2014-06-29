<?php

class UserController extends \BaseController {

    public function signup() {
        $user = new User;
        $user->name = Request::get('name');
        $user->email = Request::get('email');
        $user->password = Hash::make(Request::get('password'));
        $user->save();
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
        if (Auth::once($credentials)) {
            $name= array(
              'name' => Auth::user()->name,
               'email'=>Auth::user()->email
            );
          return Response::json(array(
            'error' => false,
            'message' => $name
        ), 200);
        } else {
         return Response::json(array(
            'error' => true,
            'message' => 'Incorrect Login!'
        ), 403);
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
