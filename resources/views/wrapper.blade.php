<div x-load x-load-css="[@js(\Filament\Support\Facades\FilamentAsset::getStyleHref('robusta-table-styles', 'evitenic/robusta-table'))]"
    x-load-src="{{ \Filament\Support\Facades\FilamentAsset::getAlpineComponentSrc('robusta-table', 'evitenic/robusta-table') }}"
    data-robusta-table="{{ $this->getResizeableColumnsConfig()['tableKey'] }}"
    x-data="initRobustaTable({ resizedConfig: @js($this->getResizeableColumnsConfig()) })">
    {{ $slot }}
</div>
