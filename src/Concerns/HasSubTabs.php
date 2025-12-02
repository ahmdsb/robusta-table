<?php

namespace Evitenic\RobustaTable\Concerns;

use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Illuminate\Database\Eloquent\Builder;
use Livewire\Attributes\Url;

trait HasSubTabs
{
    public function mountHasSubTabs()
    {
        $this->loadDefaultActiveSubTab();
    }

    #[Url(as: 'subTab')]
    public ?string $activeSubTab = null;

    /**
     * @var array<string | int, Tab>
     */
    protected array $cachedSubTabs;

    protected function loadDefaultActiveSubTab(): void
    {
        if (filled($this->activeSubTab)) {
            return;
        }

        $this->activeSubTab = $this->getDefaultActiveSubTab();
    }

    public function getSubTabs(): array
    {
        return [];
    }

    public function getCachedSubTabs(): array
    {
        return $this->cachedSubTabs ??= collect($this->getSubTabs())
            ->map(
                fn (Tab $tab, string|int $key): Tab => $tab->hasCustomLabel()
                    ? $tab
                    : $tab->label($this->generateTabLabel($key))
            )
            ->all();
    }

    public function getDefaultActiveSubTab(): string|int|null
    {
        return array_key_first($this->getCachedSubTabs());
    }

    public function updatedActiveSubTab(): void
    {
        $this->resetPage();

        $this->cachedDefaultTableColumnState = null;

        $this->applyTableColumnManager();
    }

    protected function modifyQuerywithActiveTab(Builder $query): Builder
    {
        if (blank(filled($this->activeSubTab))) {
            return $query;
        }

        $tabs = $this->getCachedTabs();

        if (! array_key_exists($this->activeTab, $tabs)) {
            return $query;
        }

        $tabQuery = $tabs[$this->activeTab]->modifyQuery($query);

        if (blank(filled($this->activeSubTab))) {
            return $tabQuery;
        }

        $subTabs = $this->getCachedSubTabs();

        if (! array_key_exists($this->activeSubTab, $subTabs)) {
            return $tabQuery;
        }

        return $subTabs[$this->activeSubTab]->modifyQuery($tabQuery);
    }

    public function getSubTabsContentComponent(): Component
    {
        $subTabs = $this->getCachedSubTabs();

        return Tabs::make()
            ->livewireProperty('activeSubTab')
            ->contained(false)
            ->tabs($subTabs)
            ->hidden(empty($subTabs));
    }
}
