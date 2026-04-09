<?php

namespace App\Services;

use Endroid\QrCode\Color\Color;
use Endroid\QrCode\Encoding\Encoding;
use Endroid\QrCode\ErrorCorrectionLevel;
use Endroid\QrCode\Logo\Logo;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class QrCodeService
{
    /**
     * Generate a QR Code PNG with logo overlay, save to storage, and return the public URL.
     */
    public function generateForQueue(string $companyId, string $publicUrl): string
    {
        $size = 400;
        $logoPath = public_path('logo.png');

        $qrCode = new QrCode(
            data: $publicUrl,
            encoding: new Encoding('UTF-8'),
            errorCorrectionLevel: ErrorCorrectionLevel::High,
            size: $size,
            margin: 10,
            foregroundColor: new Color(0, 0, 0),
            backgroundColor: new Color(255, 255, 255),
        );

        $writer = new PngWriter();

        if (file_exists($logoPath)) {
            $logo = Logo::create($logoPath)
                ->setResizeToWidth((int) ($size * 0.22));
            $result = $writer->write($qrCode, $logo);
        } else {
            Log::warning('QrCodeService: logo.png not found, generating QR without logo.', ['path' => $logoPath]);
            $result = $writer->write($qrCode);
        }

        $pngBytes = $result->getString();

        $storagePath = "qrcodes/{$companyId}.png";
        Storage::disk('public')->put($storagePath, $pngBytes);

        return Storage::disk('public')->url($storagePath);
    }
}
