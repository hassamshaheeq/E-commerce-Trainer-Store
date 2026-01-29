import Barcode from 'react-barcode';

const BarcodeDisplay = ({ productId }) => {
    return (
        <div className="inline-flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg border border-gray-700/50">
            <div className="bg-white px-1 py-0.5 rounded">
                <Barcode
                    value={productId}
                    width={1}
                    height={25}
                    fontSize={8}
                    background="#ffffff"
                    lineColor="#000000"
                    margin={0}
                    displayValue={false}
                />
            </div>
            <span className="text-xs text-gray-400 font-mono">ID: {productId.slice(-8)}</span>
        </div>
    );
};

export default BarcodeDisplay;
