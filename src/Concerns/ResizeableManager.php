<?php

namespace Evitenic\RobustaTable\Concerns;

trait ResizeableManager
{
    public function bootedHasRobustaTable()
    {
        // Initialize resizeable columns
        $this->getTable()->applyColumnExtraAttributes();
    }

    public function getResizeableColumnsConfig(): array
    {
        return $this->getTable()->getResizeableColumnsConfig();
    }
}
