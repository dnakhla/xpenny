<?php

class ExpenseController extends \BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        $expenses = Expense::where('user_id', Auth::user()->id)->get();
        if ($expenses) {
            $error = false;
            $code = 200;
            $expenses = $expenses->toArray();
        } else {
            $error = true;
            $code = 500;
            $expenses = null;
        }
        return Response::json(array(
            'error' => $error,
            'expenses' => $expenses
        ), $code);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        $expense = new Expense;
        $expense->amount = Request::get('amount');
        $expense->description = Request::get('description');
        $expense->comment = Request::get('comment');
        $expense->date = Request::get('date');
        $expense->user_id = Auth::user()->id;

        if ($expense->save()) {
            $error = false;
            $code = 200;
        } else {
            $error = true;
            $code = 500;
        }
        return Response::json(array(
            'error' => $error,
            'expenses' => $expense->toArray()
        ), $code);
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id) {
        $expense = Expense::where('user_id', Auth::user()->id)->where('id', $id)->take(1)->get();
        $error = false;
        $expenses = $expense->toArray();
        $code = 200;
        if (sizeof($expenses) < 1) {
            $error = true;
            $code = 404;
        }
        return Response::json(array(
            'error' => $error,
            'expenses' => $expenses
        ), $code);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {

        $expense = Expense::where('user_id', Auth::user()->id)->find($id);
        if (Request::get('amount')) {
            $expense->amount = Request::get('amount');
        }
        if (Request::get('description')) {
            $expense->description = Request::get('description');
        }
        if (Request::get('comment')) {
            $expense->comment = Request::get('comment');
        }
        if (Request::get('date')) {
            $expense->date = Request::get('date');
        }

        if ($expense->save()) {
            $error = false;
            $message = $id . ' updated';
            $code = 200;
        } else {
            $error = true;
            $message = $id . 'failed update';
            $code = 500;
        }

        return Response::json(array(
            'error' => $error,
            'message' => $message
        ), $code);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $expense = Expense::where('user_id', Auth::user()->id)->find($id);
        if ($expense && $expense->delete()) {
            $code = 200;
            $error = false;
            $message = $id . ' deleted';
        } else {
            $code = 404;
            $error = true;
            $message = 'transaction not found';
        }
        return Response::json(array(
            'error' => $error,
            'message' => $message
        ), $code);

    }

}
