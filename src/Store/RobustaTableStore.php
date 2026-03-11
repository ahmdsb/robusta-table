<?php

namespace Evitenic\RobustaTable\Store;

use Evitenic\RobustaTable\Contracts\Store;

class RobustaTableStore
{
    protected static ?self $instance = null;

    protected Store $store;

    protected function __construct()
    {
        $configStore = config('robusta-table.store_driver', SessionStore::class);

        $this->store = app($configStore);
    }

    public static function getInstance(): self
    {
        if (static::$instance === null) {
            static::$instance = new self;
        }

        return static::$instance;
    }

    public function getStore(): Store
    {
        return $this->store;
    }
}
