<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class BackupAutomated extends Command
{
    protected $signature = 'backup:automated {--type=all : Tipo de backup (all|db)}';

    protected $description = 'Cria backup do banco de dados e envia para S3';

    public function handle(): int
    {
        $this->info('Iniciando backup...');

        try {
            $filename = $this->createDatabaseDump();
            $this->uploadToS3($filename);
            $this->pruneOldBackups();
            $this->cleanupTempFile($filename);

            $this->info('Backup concluído com sucesso.');
            Log::info('backup:automated concluído', ['file' => basename($filename)]);

            return self::SUCCESS;
        } catch (\Throwable $e) {
            $this->error('Backup falhou: ' . $e->getMessage());
            Log::error('backup:automated falhou', ['error' => $e->getMessage()]);

            return self::FAILURE;
        }
    }

    private function createDatabaseDump(): string
    {
        $tmpFile = sys_get_temp_dir() . '/minhafila-backup-' . date('Y-m-d-His') . '.sql.gz';

        $host     = config('database.connections.pgsql.host');
        $port     = config('database.connections.pgsql.port', 5432);
        $database = config('database.connections.pgsql.database');
        $username = config('database.connections.pgsql.username');
        $password = config('database.connections.pgsql.password');

        $env     = ['PGPASSWORD' => $password];
        $command = sprintf(
            'pg_dump --host=%s --port=%s --username=%s --no-password --format=plain %s | gzip > %s',
            escapeshellarg($host),
            escapeshellarg((string) $port),
            escapeshellarg($username),
            escapeshellarg($database),
            escapeshellarg($tmpFile),
        );

        $descriptors = [
            0 => ['pipe', 'r'],
            1 => ['pipe', 'w'],
            2 => ['pipe', 'w'],
        ];

        $process = proc_open($command, $descriptors, $pipes, null, $env);

        if (! is_resource($process)) {
            throw new \RuntimeException('Não foi possível iniciar pg_dump.');
        }

        fclose($pipes[0]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);

        $exitCode = proc_close($process);

        if ($exitCode !== 0) {
            throw new \RuntimeException("pg_dump falhou (exit {$exitCode}): {$stderr}");
        }

        if (! file_exists($tmpFile) || filesize($tmpFile) === 0) {
            throw new \RuntimeException('Arquivo de dump vazio ou não criado.');
        }

        return $tmpFile;
    }

    private function uploadToS3(string $localFile): void
    {
        $remotePath = 'backups/' . date('Y/m') . '/' . basename($localFile);

        $stream = fopen($localFile, 'r');

        if ($stream === false) {
            throw new \RuntimeException("Não foi possível abrir o arquivo: {$localFile}");
        }

        try {
            Storage::disk('s3-backup')->writeStream($remotePath, $stream);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        $this->info("Enviado para S3: {$remotePath}");
    }

    private function pruneOldBackups(): void
    {
        $retentionDays = 30;
        $cutoff        = now()->subDays($retentionDays)->timestamp;

        $files = Storage::disk('s3-backup')->files('backups', true);

        foreach ($files as $file) {
            $lastModified = Storage::disk('s3-backup')->lastModified($file);

            if ($lastModified < $cutoff) {
                Storage::disk('s3-backup')->delete($file);
                $this->line("Removido backup antigo: {$file}");
            }
        }
    }

    private function cleanupTempFile(string $file): void
    {
        if (file_exists($file)) {
            unlink($file);
        }
    }
}
