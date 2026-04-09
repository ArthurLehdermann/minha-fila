<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Intervention\Image\ImageManagerStatic as Image;

class QrCodeService
{
    /**
     * Generate a QR Code PNG with logo overlay, save to storage, and return the public URL.
     */
    public function generateForQueue(string $companyId, string $publicUrl): string
    {
        $size = 500;
        $logoPath = public_path('logo.png');

        $qrPng = QrCode::format('png')
            ->size($size)
            ->errorCorrection('H')
            ->backgroundColor(255, 255, 255)
            ->margin(1)
            ->generate($publicUrl);

        $tempQrPath = storage_path('app/temp_qr_' . $companyId . '.png');
        file_put_contents($tempQrPath, $qrPng);

        try {
            $image = Image::make($tempQrPath);

            if (file_exists($logoPath)) {
                $logo = Image::make($logoPath);
                $logoSize = (int) ($size * 0.22);
                $logo->resize($logoSize, $logoSize, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });
                $image->insert($logo, 'center');
            } else {
                Log::warning('QrCodeService: logo.png not found, generating QR without logo.', ['path' => $logoPath]);
            }

            $pngBytes = (string) $image->encode('png');
        } finally {
            if (file_exists($tempQrPath)) {
                unlink($tempQrPath);
            }
        }

        $storagePath = "qrcodes/{$companyId}.png";
        Storage::disk('public')->put($storagePath, $pngBytes);

        return Storage::disk('public')->url($storagePath);
    }
}
