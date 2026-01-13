'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Html5Qrcode } from 'html5-qrcode'

interface ScanResult {
  valid: boolean
  message?: string
  error?: string
  ticket?: {
    ticketNumber: string
    email: string
    checkedInAt: string
  }
  checkedInAt?: string
}

export default function ScannerPage() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [error, setError] = useState('')
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null)

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (scanner) {
        scanner.stop().catch(console.error)
      }
    }
  }, [scanner])

  const startScanning = async () => {
    setScanning(true)
    setResult(null)
    setError('')

    try {
      const html5QrCode = new Html5Qrcode('qr-reader')
      setScanner(html5QrCode)

      await html5QrCode.start(
        { facingMode: 'environment' }, // Use back camera
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // QR Code scanned successfully
          await html5QrCode.stop()
          setScanning(false)
          await verifyTicket(decodedText)
        },
        (errorMessage) => {
          // Scanning errors (can be ignored, just means no QR detected yet)
        }
      )
    } catch (err: any) {
      setError(err.message || 'Failed to start camera')
      setScanning(false)
    }
  }

  const stopScanning = async () => {
    if (scanner) {
      await scanner.stop()
      setScanning(false)
    }
  }

  const verifyTicket = async (qrData: string) => {
    try {
      const res = await fetch('/api/verify-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData }),
      })

      const data = await res.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Verification failed')
    }
  }

  const resetScanner = () => {
    setResult(null)
    setError('')
  }

  return (
    <div className="min-h-screen p-4" style={{ background: '#EAEDEF' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <Image
            src="/t2d-logo.png"
            alt="Think To Deploy"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold" style={{ color: '#000000' }}>
            Staff Scanner
          </h1>
          <p className="text-gray-600 mt-2">Scan attendee QR codes for verification</p>
        </div>

        {/* Scanner Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2" style={{ borderColor: '#9D4EDD' }}>
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className={`mb-6 p-6 rounded-xl border-2 ${
              result.valid 
                ? 'bg-green-50 border-green-500' 
                : 'bg-red-50 border-red-500'
            }`}>
              <div className="text-center">
                <div className="text-6xl mb-4">
                  {result.valid ? '✅' : '❌'}
                </div>
                <h3 className={`text-2xl font-bold mb-2 ${
                  result.valid ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.valid ? 'Ticket Valid' : 'Ticket Invalid'}
                </h3>
                <p className={`mb-4 ${
                  result.valid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.message || result.error}
                </p>
                
                {result.valid && result.ticket && (
                  <div className="mt-4 text-left bg-white rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Ticket:</span> {result.ticket.ticketNumber}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-semibold">Email:</span> {result.ticket.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Checked in:</span>{' '}
                      {new Date(result.ticket.checkedInAt).toLocaleString()}
                    </p>
                  </div>
                )}

                {!result.valid && result.checkedInAt && (
                  <div className="mt-4 text-left bg-white rounded-lg p-4">
                    <p className="text-sm text-red-600">
                      <span className="font-semibold">Already used at:</span>{' '}
                      {new Date(result.checkedInAt).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={resetScanner}
                className="w-full mt-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{ background: '#9D4EDD', color: 'white' }}
              >
                Scan Another Ticket
              </button>
            </div>
          )}

          {/* Scanner Interface */}
          {!result && (
            <>
              {/* Camera Preview */}
              <div 
                id="qr-reader" 
                className={`rounded-xl overflow-hidden mb-6 ${scanning ? 'block' : 'hidden'}`}
                style={{ minHeight: '300px' }}
              ></div>

              {/* Instructions when not scanning */}
              {!scanning && (
                <div className="text-center mb-6 p-8 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#000000' }}>
                    Ready to Scan
                  </h3>
                  <p className="text-gray-600">
                    Click the button below to start scanning QR codes
                  </p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="space-y-3">
                {!scanning ? (
                  <button
                    onClick={startScanning}
                    className="w-full py-4 rounded-lg font-semibold text-white text-lg transition-all hover:opacity-90"
                    style={{ background: '#9D4EDD' }}
                  >
                    Start Scanning
                  </button>
                ) : (
                  <button
                    onClick={stopScanning}
                    className="w-full py-4 rounded-lg font-semibold border-2 transition-all hover:bg-red-500 hover:text-white hover:border-red-500"
                    style={{ borderColor: '#000000', color: '#000000' }}
                  >
                    Stop Scanning
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 bg-white rounded-xl p-6 border-2" style={{ borderColor: '#EAEDEF' }}>
          <h3 className="font-bold mb-3" style={{ color: '#000000' }}>
            ℹ️ Scanner Instructions
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Allow camera access when prompted</li>
            <li>• Hold the QR code steady in front of the camera</li>
            <li>• Valid tickets will be marked as checked-in</li>
            <li>• Already used tickets will be rejected</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
