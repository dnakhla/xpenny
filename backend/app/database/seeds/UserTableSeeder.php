<?php

class UserTableSeeder extends Seeder {

    public function run() {
        DB::table('users')->delete();

        User::create(array(
            'name' => 'Daniel Nakhla',
            'email' => 'dnakhla@gmail.com',
            'password_hash' => Hash::make('test')
        ));

    }

}
