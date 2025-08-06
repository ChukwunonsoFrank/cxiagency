@props(['type' => 'success', 'message' => null])

@php
    // Determine the message and type from session if available
    $sessionMessage = session('message') ?? session('success') ?? session('error') ?? session('warning') ?? session('info');
    $sessionType = 'success'; // Default type

    if (session()->has('success')) {
        $sessionType = 'success';
    } elseif (session()->has('error')) {
        $sessionType = 'error';
    } elseif (session()->has('warning')) {
        $sessionType = 'warning';
    } elseif (session()->has('info')) {
        $sessionType = 'info';
    } elseif (session()->has('message') && session('type')) {
        $sessionType = session('type'); // If 'message' and 'type' are flashed together
    }

    // Prioritize passed props if they exist, otherwise use session
    $displayMessage = $message ?? $sessionMessage;
    $displayType = $type ?? $sessionType;

    // Map types to custom CSS classes
    $alertClasses = [
        'success' => 'flash-message-success',
        'error' => 'flash-message-error',
        'warning' => 'flash-message-warning',
        'info' => 'flash-message-info',
    ];

    $iconClasses = [
        'success' => 'fas fa-check-circle flash-icon-success', // Example FontAwesome icons
        'error' => 'fas fa-exclamation-circle flash-icon-error',
        'warning' => 'fas fa-exclamation-triangle flash-icon-warning',
        'info' => 'fas fa-info-circle flash-icon-info',
    ];
@endphp

@if($displayMessage)
<div
    x-data="{ show: true }"
    x-init="setTimeout(() => show = false, 6000)" {{-- Hide after 3.5 seconds --}}
    x-show="show"
    x-transition:enter="flash-transition-enter"
    x-transition:enter-start="flash-transition-enter-start"
    x-transition:enter-end="flash-transition-enter-end"
    x-transition:leave="flash-transition-leave"
    x-transition:leave-start="flash-transition-leave-start"
    x-transition:leave-end="flash-transition-leave-end"
    class="flash-message-container {{ $alertClasses[$displayType] ?? $alertClasses['success'] }}"
    role="alert"
>
    <div class="flash-message-content">
        @if(isset($iconClasses[$displayType]))
            <i class="flash-icon {{ $iconClasses[$displayType] }} mr-2"></i>
        @endif
        <p class="flash-message-text">{{ $displayMessage }}</p>
    </div>
</div>
@endif