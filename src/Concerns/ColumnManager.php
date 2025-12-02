<?php

namespace Evitenic\RobustaTable\Concerns;

use Filament\Support\Facades\FilamentView;
use Filament\Tables\Columns\Column;
use Illuminate\View\View;
use Livewire\Livewire;
use Throwable;

trait ColumnManager
{
    public const TABLE_COLUMN_MANAGER_COLUMN_TYPE = 'column';

    public function bootedColumnManager()
    {
        $this->setDefaultTableColumnState();
        $this->registerLayoutViewToogleActionHook(config('robusta-table.position_manage_columns'));
    }

    protected function setDefaultTableColumnState(): void
    {
        $this->tableColumns = collect($this->tableColumns)
            ->map(function ($column) {
                if ($column['isToggledHiddenByDefault']) {
                    $column['isToggled'] = ! $column['isToggled'];
                }

                return $column;
            })
            ->toArray();
    }

    protected function registerLayoutViewToogleActionHook(string $filamentHook)
    {
        $componentClass = static::class;

        FilamentView::registerRenderHook(
            $filamentHook,
            function () use ($componentClass): ?View {

                /**
                 * @var Component $currentComponent Current Livewire page component instance.
                 */
                $currentComponent = Livewire::current();

                // Check if component exists and is the right type
                if (! $currentComponent || ! $currentComponent instanceof $componentClass) {
                    return null;
                }

                // Additional check for the trait
                if (! in_array(HasRobustaTable::class, class_uses_recursive($currentComponent))) {
                    return null;
                }

                try {
                    $currentTable = $currentComponent->getTable();
                    $additionalKeys = [];

                    $hasColumnManagerDropdown = $currentTable->hasColumnManager();
                    $heading = $currentTable->getHeading();
                    $secondLevelHeadingTag = $heading ? $currentTable->getHeadingTag(1) : $currentTable->getHeadingTag();

                    if ($hasColumnManagerDropdown) {
                        $additionalKeys['columnManagerMaxHeight'] = $currentTable->getColumnManagerMaxHeight();
                        $additionalKeys['columnManagerWidth'] = $currentTable->getColumnManagerWidth();
                        $additionalKeys['columnManagerColumns'] = $currentTable->getColumnManagerColumns();
                    }

                    return view('robusta-table::robusta-column.column-manager', [
                        'columnManagerTriggerAction' => $currentTable->getRobustaTableColumnManagerTriggerAction(),
                        'excludedReorderableColumns' => $currentTable->getExcludedReorderColumns(),
                        'hasColumnManagerDropdown' => $hasColumnManagerDropdown,
                        'columnManagerApplyAction' => $currentTable->getColumnManagerApplyAction(),
                        'hasReorderableColumns' => $currentTable->hasReorderableColumns(),
                        'hasToggleableColumns' => $currentTable->hasReorderableColumns(),
                        'secondLevelHeadingTag' => $secondLevelHeadingTag,
                        'reorderAnimationDuration' => $currentTable->getReorderAnimationDuration(),
                        ...$additionalKeys,
                    ]);
                } catch (Throwable $e) {

                    return null;
                }
            },
            $componentClass
        );
    }

    protected function mapTableColumnToArray(Column $column): array
    {
        return [
            'type' => self::TABLE_COLUMN_MANAGER_COLUMN_TYPE,
            'name' => $column->getName(),
            'label' => (string) $column->getLabel(),
            'isHidden' => $column->isHidden(),
            'isToggled' => ! $column->isToggleable() || ! $column->isToggledHiddenByDefault(),
            'isToggleable' => $column->isToggleable(),
            'isToggledHiddenByDefault' => $column->isToggleable() ? $column->isToggledHiddenByDefault() : null,
            'isResized' => ! in_array($column->getName(), $this->getTable()->getExcludedResizeableColumns()),
            'isReorderable' => ! in_array($column->getName(), $this->getTable()->getExcludedReorderColumns()),
        ];
    }

    protected function hasReorderedTableColumns(): bool
    {
        $table = md5($this::class);

        $flattenedDefaultColumnState = session()->get(
            "tables.{$table}_reordered_columns",
            $this->flattenTableColumnStateItems($this->getDefaultTableColumnState())
        );

        $flattenedColumnState = $this->flattenTableColumnStateItems($this->tableColumns);

        $matchingDefaultColumns = collect($flattenedDefaultColumnState)
            ->filter(fn (string $key) => in_array($key, $flattenedColumnState))
            ->values()
            ->all();

        session()->put(
            "tables.{$table}_reordered_columns",
            $flattenedColumnState
        );

        return $flattenedColumnState !== $matchingDefaultColumns;
    }
}
