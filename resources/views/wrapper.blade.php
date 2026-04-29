@php($robustaConfig = $this->getResizeableColumnsConfig())
<div x-load x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('robusta-table-styles', 'evitenic/robusta-table'))]"
    x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('robusta-table', 'evitenic/robusta-table') }}"
    data-robusta-table="{{ $robustaConfig['tableKey'] }}" x-data="initRobustaTable({ resizedColumn: @js($robustaConfig) })"
    @if ($this->getTable()->isLoaded()) x-init="registerPlugin()" @endif>
    {{ $slot }}
</div>
