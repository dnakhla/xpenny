<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExpensesTable extends Migration {

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up() {
        Schema::create('expenses', function($table) {
            $table->increments('id');
            $table->integer('user_id')->unsigned();
            $table->decimal('amount', 10, 2);
            $table->dateTime('date');
            $table->text('description');
            $table->text('comment');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down() {
        Schema::drop('expenses');
    }

}
