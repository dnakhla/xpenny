<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration {

    public function up() {
        Schema::create('transactions', function($table) {
            $table -> increments('id');
            $table -> integer('user_id') -> unsigned();
            $table -> decimal('amount', 10, 2);
            $table -> dateTime('date');
            $table -> text('description');
            $table -> text('comment');
            $table -> timestamps();
            $table -> foreign('user_id') -> references('id') -> on('users');
        });
    }

    public function down() {
        Schema::drop('transactions');
    }

}
