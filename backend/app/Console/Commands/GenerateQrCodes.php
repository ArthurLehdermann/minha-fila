<?php

namespace App\Console\Commands;

use App\Models\Company;
use App\Services\QrCodeService;
use Illuminate\Console\Command;

class GenerateQrCodes extends Command
{
    protected $signature = 'qr:generate {--force : Regenerate even if qr_code_url already exists}';
    protected $description = 'Generate QR codes for companies that are missing them';

    public function handle(QrCodeService $qrCodeService): int
    {
        $query = Company::query();

        if (! $this->option('force')) {
            $query->whereNull('qr_code_url');
        }

        $companies = $query->get();

        if ($companies->isEmpty()) {
            $this->info('No companies need QR code generation.');
            return self::SUCCESS;
        }

        $this->info("Generating QR codes for {$companies->count()} company(ies)...");
        $bar = $this->output->createProgressBar($companies->count());
        $bar->start();

        foreach ($companies as $company) {
            try {
                $publicUrl = config('app.frontend_url', 'https://minha-fila.meugarcom.app') . '/filas/' . $company->id;
                $qrUrl = $qrCodeService->generateForQueue($company->id, $publicUrl);
                $company->updateQuietly(['qr_code_url' => $qrUrl]);
            } catch (\Throwable $e) {
                $this->newLine();
                $this->error("Failed for company {$company->id}: {$e->getMessage()}");
            }
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info('Done.');

        return self::SUCCESS;
    }
}
