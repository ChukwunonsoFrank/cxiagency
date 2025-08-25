<?php

namespace App\Http\Controllers;

use App\Notifications\SendFormEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Notification;

class FormController extends Controller
{
    public function submit(Request $request)
    {
        // $recaptcha = $request->input('g-recaptcha-response');

        // if (is_null($recaptcha)) {
        //     $request->session()->flash('message', "Please confirm you are not a robot.");
        //     return redirect()->back();
        // }

        // $response = Http::get("https://www.google.com/recaptcha/api/siteverify", [
        //     'secret' => config('services.recaptcha.secret'),
        //     'response' => $recaptcha
        // ]);

        // $result = $response->json();

        // if ($response->successful() && $result['success'] == true) {
            $firstName = $request->input('first_name');
            $lastName = $request->input('last_name');
            $emailAddress = $request->input('email_address');
            $country = $request->input('country');
            $whatsappNumber = $request->input('whatsapp_number');
            $telegramId = $request->input('telegram_id');
            $whatHappened = $request->input('what_happened');
            $amountLost = $request->input('amount_lost');
            $scamDate = $request->input('scam_date');
            $moreInfo = $request->input('more_info');

            Notification::route('mail', 'info@cxiagency.com')->notify(new SendFormEntry($firstName, $lastName, $emailAddress, $country, $whatsappNumber, $telegramId, $whatHappened, $amountLost, $scamDate, $moreInfo));

            // return back()->with('message', 'Your submission has been recorded successfully.');
            $request->session()->flash('message', "Your submission has been recorded successfully.");
            return redirect()->back();
        // } else {
        //     // return back()->with('message', 'Please confirm you are not a robot.');
        //     $request->session()->flash('message', "Please confirm you are not a robot.");
        //     return redirect()->back();
        // }
    }
}
