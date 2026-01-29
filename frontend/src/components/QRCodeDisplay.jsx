import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

const QRCodeDisplay = ({ productId, productName }) => {
    const qrRef = useRef(null);

    // Generate the full product URL
    const productUrl = `${window.location.origin}/product/${productId}`;

    const handleDownload = () => {
        const svg = qrRef.current.querySelector('svg');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        // Set canvas size
        canvas.width = 512;
        canvas.height = 512;

        img.onload = () => {
            // Fill white background
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw QR code
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Convert to PNG and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `qr-code-${productName.replace(/\s+/g, '-').toLowerCase()}.png`;
                link.click();
                URL.revokeObjectURL(url);
            });
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    return (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Product QR Code</h3>
                <p className="text-sm text-gray-400 mb-4">Scan to view this product</p>

                {/* QR Code */}
                <div ref={qrRef} className="bg-white p-4 rounded-lg inline-block mb-4">
                    <QRCodeSVG
                        value={productUrl}
                        size={200}
                        level="H"
                        includeMargin={true}
                    />
                </div>

                {/* Product URL */}
                <div className="mb-4">
                    <p className="text-xs text-gray-500 break-all bg-gray-900 px-3 py-2 rounded-lg border border-gray-700">
                        {productUrl}
                    </p>
                </div>

                {/* Download Button */}
                <button
                    onClick={handleDownload}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group"
                >
                    <svg
                        className="w-5 h-5 group-hover:scale-110 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                    </svg>
                    Download QR Code
                </button>

                {/* Info */}
                <p className="text-xs text-gray-500 mt-3">
                    Perfect for print materials, displays, or sharing
                </p>
            </div>
        </div>
    );
};

export default QRCodeDisplay;
