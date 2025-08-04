<?php

namespace App\Http\Controllers;

use App\Notifications\SendFormEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class FormController extends Controller
{
    public function submit(Request $request)
    {
        try {
            $firstName = $request->input('first_name');
            $lastName = $request->input('last_name');
            $businessEmailAddress = $request->input('business_email_address');
            $companyName = $request->input('company_name');
            $phoneNumber = $request->input('phone_number');
            $organizationType = $request->input('organization_type');
            $country = $request->input('country');
            $solutionOfInterest = $request->input('solution_of_interest');
            $channel = $request->input('channel');
            $moreInfo = $request->input('more_info');

            Notification::route('mail', 'info@cxiagency.com')
                ->notify(new SendFormEntry($firstName, $lastName, $businessEmailAddress, $companyName, $phoneNumber, $organizationType, $country, $solutionOfInterest, $channel, $moreInfo));

            return back()->with('message', 'Your submission has been recorded successfully.');
        } catch (\Exception $e) {
            return back()->with('message', 'Error: ' . $e->getMessage());
        }
    }
}
