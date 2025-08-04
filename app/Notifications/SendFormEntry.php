<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendFormEntry extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public string $firstName, public string $lastName, public string $businessEmailAddress, public string $companyName, public string $phoneNumber, public string $organizationType, public string $country, public string $solutionOfInterest, public string $channel, public string $moreInfo)
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->greeting('New Form Submission')
            ->subject('New Form Entry')
            ->line('')
            ->line('First Name: ' . $this->firstName)
            ->line('Last Name: ' . $this->lastName)
            ->line('Business Email Address: ' . $this->businessEmailAddress)
            ->line('Company Name: ' . $this->companyName)
            ->line('Phone Number: ' . $this->phoneNumber)
            ->line('Organization Type: ' . $this->organizationType)
            ->line('Country: ' . $this->country)
            ->line('Solution of Interest: ' . $this->solutionOfInterest)
            ->line('How did you hear about us: ' . $this->channel)
            ->line('Help us customize your demo — tell us about your team and goals with Cxiagency: ' . $this->moreInfo);
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
