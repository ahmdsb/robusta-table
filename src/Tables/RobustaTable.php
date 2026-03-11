<?php

namespace Evitenic\RobustaTable\Tables;

use Evitenic\RobustaTable\Concerns\Table\CanBePersist;
use Evitenic\RobustaTable\Concerns\Table\HasColumnManager;
use Evitenic\RobustaTable\Concerns\Table\HasResizeableColumns;
use Filament\Tables\Table;

class RobustaTable extends Table
{
    use CanBePersist;
    use HasColumnManager;
    use HasResizeableColumns;
}
