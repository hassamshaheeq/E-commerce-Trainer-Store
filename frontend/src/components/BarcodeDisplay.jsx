import Barcode from 'react-barcode';

const BarcodeDisplay = ({ productId }) => {
    return (
        <div className="inline-flex items-center gap-3 bg-zinc-950/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5 shadow-inner">
            <div className="bg-white/90 p-1 rounded-md mix-blend-screen opacity-80 hover:opacity-100 transition-opacity">
                <Barcode
                    value={productId}
                    width={1.2}
                    height={30}
                    fontSize={10}
                    background="transparent"
                    lineColor="#000000"
                    margin={0}
                    displayValue={false}
                />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest leading-none mb-1">Authentic ID</span>
                <span className="text-xs text-white/40 font-mono font-bold leading-none">{productId.slice(-8)}</span>
            </div>
        </div>
    );
};

export default BarcodeDisplay;
