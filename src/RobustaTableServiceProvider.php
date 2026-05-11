<?php

namespace Evitenic\RobustaTable;

use Filament\Support\Assets\AlpineComponent;
use Filament\Support\Assets\Asset;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;
use Illuminate\Support\Facades\Blade;
use Spatie\LaravelPackageTools\Package;
use Spatie\LaravelPackageTools\PackageServiceProvider;

class RobustaTableServiceProvider extends PackageServiceProvider
{
    public static string $name = 'robusta-table';

    public static string $viewNamespace = 'robusta-table';

    public function configurePackage(Package $package): void
    {
        /*
         * This class is a Package Service Provider
         *
         * More info: https://github.com/spatie/laravel-package-tools
         */
        $package->name(static::$name)
            ->hasViews(static::$name)
            ->hasConfigFile(static::$name)
            ->hasTranslations();
    }

    public function packageBooted(): void
    {
        // Asset Registration
        FilamentAsset::register(
            $this->getAssets(),
            $this->getAssetPackageName()
        );

        $this->registerComponents();
    }

    protected function getAssetPackageName(): ?string
    {
        return 'evitenic/robusta-table';
    }

    /**
     * @return array<Asset>
     */
    protected function getAssets(): array
    {
        return [
            AlpineComponent::make('robusta-table', __DIR__ . '/../resources/js/dist/robusta-table.js'),
            AlpineComponent::make('robusta-table-column-manager', __DIR__ . '/../resources/js/dist/robusta-table-column-manager.js'),
            Css::make('robusta-table-styles', __DIR__ . '/../resources/css/dist/robusta-table.css')->loadedOnRequest(),
        ];
    }

    protected function registerComponents(): void
    {
        // Register Blade components
        Blade::component('robusta-table::wrapper', 'robusta-table.wrapper');
    }
}
