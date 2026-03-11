<?php

// config for Evitenic/RobustaTable

use Evitenic\RobustaTable\Store\SessionStore;
use Filament\Tables\View\TablesRenderHook;

return [
    'store_driver' => SessionStore::class,

    'prefix_store' => env('ROBUSTA_TABLE_PREFIX_STORE', 'robusta_table'),

    'icons' => [
        'manage-column' => 'heroicon-m-view-columns',
        'order-column' => 'heroicon-m-bars-2',
        'column-hidden' => 'heroicon-m-eye-slash',
        'column-visible' => 'heroicon-m-eye',
    ],

    'position_manage_columns' => TablesRenderHook::TOOLBAR_COLUMN_MANAGER_TRIGGER_AFTER,
];
