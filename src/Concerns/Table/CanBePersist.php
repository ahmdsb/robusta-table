<?php

namespace Evitenic\RobustaTable\Concerns\Table;

use Closure;

trait CanBePersist
{
    protected bool | Closure $persistsTableColumns = false;

    public function persistsTableColumns(bool | Closure $condition = true): static
    {
        $this->persistsTableColumns = $condition;

        return $this;
    }

    public function getPersistsTableColumns(): bool
    {
        return $this->evaluate($this->persistsTableColumns);
    }
}
