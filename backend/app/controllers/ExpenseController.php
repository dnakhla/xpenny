<?php

class ExpenseController extends \BaseController {

    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index() {
        $expenses = Expense::where('user_id', Auth::user()->id)->get();

        return Response::json(array(
            'error' => false,
            'expenses' => $expenses->toArray()
        ), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create() {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @return Response
     */
    public function store() {
        $expense = new Expense;
        $expense->amount = Request::get('expense');
        $expense->description = Request::get('description');
        $expense->comment = Request::get('comment');
        $expense->date = Request::get('date');
        $expense->user_id = Auth::user()->id;
        $expense->save();

        return Response::json(array(
            'error' => false,
            'expenses' => $expense->toArray()
        ), 200);
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

        return Response::json(array(
            'error' => false,
            'urls' => $expense->toArray()
        ), 200);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id) {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function update($id) {

        $expense = Expense::where('user_id', Auth::user()->id)->find($id);
        if (Request::get('expense')) {
            $expense->amount = Request::get('expense');
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
        $expense->save();

        return Response::json(array(
            'error' => false,
            'message' => $id . ' updated'
        ), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id) {
        $expense = Expense::where('user_id', Auth::user()->id)->find($id);
        if ($expense) {
            $expense->delete();
            return Response::json(array(
                'error' => false,
                'message' => $id . ' deleted'
            ), 200);
        }
        return Response::json(array(
            'error' => true,
            'message' => 'transaction not found'
        ), 404);

    }

}
