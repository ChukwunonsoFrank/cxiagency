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
    public function __construct(public string $firstName, public string $lastName, public string $emailAddress, public string $country, public string $whatsappNumber, public string $telegramId, public string $whatHappened, public string $amountLost, public string $scamDate, public string $moreInfo)
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
            ->line('Email Address: ' . $this->emailAddress)
            ->line('Country: ' . $this->country)
            ->line('WhatsApp Number: ' . $this->whatsappNumber)
            ->line('Telegram ID: ' . $this->telegramId)
            ->line('What happened: ' . $this->whatHappened)
            ->line('Amount Lost: ' . $this->amountLost)
            ->line('Scam Date: ' . $this->scamDate)
            ->line('Tell us more: ' . $this->moreInfo);
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
