<?php

namespace Evitenic\RobustaTable\Concerns;

use Evitenic\RobustaTable\Tables\Components\EmbeddedTable;
use Evitenic\RobustaTable\Tables\RobustaTable;
use Filament\Schemas\Components\RenderHook;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Filament\View\PanelsRenderHook;

trait HasRobustaTable
{
    use ColumnManager;
    use HasSubTabs;
    use ResizeableManager;

    protected function makeBaseTable(): Table
    {
        return RobustaTable::make($this);
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getTabsContentComponent(),
                $this->getSubTabsContentComponent(),
                RenderHook::make(PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_BEFORE),
                EmbeddedTable::make(),
                RenderHook::make(PanelsRenderHook::RESOURCE_PAGES_LIST_RECORDS_TABLE_AFTER),
            ]);
    }
}
