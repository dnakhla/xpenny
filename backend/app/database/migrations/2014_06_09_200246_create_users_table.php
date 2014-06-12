<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration {

    public function up() {
        Schema::create('users', function($table) {
            $table->increments('id');
            $table->string('email')->unique();
            $table->string('name');
            $table->text('password_hash');
            $table->timestamps();
            $table->string('remember_token', 100)->nullable();
        });
    }

    public function down() {
        Schema::drop('users');
    }

}
