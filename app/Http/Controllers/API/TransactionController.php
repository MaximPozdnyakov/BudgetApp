<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Transaction;

use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Gate;

class TransactionController extends Controller
{
    /**
     * Display a wallets, where owner is current user.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        Gate::authorize('authOrFail');

        return Transaction::where('owner', Auth::id())->get();
    }

    /**
     * Store a newly spent resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'moneyAmount' => 'required|numeric',
            'moneySign' => 'required|boolean',
            'category' => 'required|string',
            'spent_at' => 'required',
            'description' => 'nullable|string',
            'wallet' => 'required',
        ]);

        Gate::authorize('add-transaction', $request->wallet);

        $transaction = new Transaction;
        $transaction->moneyAmount = $request->moneyAmount;
        $transaction->moneySign = $request->moneySign;
        $transaction->category = $request->category;
        $transaction->spent_at = $request->spent_at;
        $transaction->description = $request->description;
        $transaction->wallet = $request->wallet;
        $transaction->owner = Auth::id();

        $transaction->save();

        return $transaction;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'moneyAmount' => 'required|numeric',
            'moneySign' => 'required|boolean',
            'category' => 'required|string',
            'spent_at' => 'required',
            'description' => 'nullable|string'
        ]);

        Gate::authorize('update-delete-transaction', $id);

        $transaction = Transaction::findOrFail($id)->update([
            'moneyAmount' => $request->moneyAmount,
            'moneySign' => $request->moneySign,
            'category' => $request->category,
            'spent_at' => $request->spent_at,
            'description' => $request->description
            ]);

        return Transaction::findOrFail($id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        Gate::authorize('update-delete-transaction', $id);

        $transaction = Transaction::findOrFail($id);
        $transaction->delete();
        return $transaction;
    }
}
