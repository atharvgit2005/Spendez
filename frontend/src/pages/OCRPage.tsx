import React, { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/client';
import toast from 'react-hot-toast';

const OCRPage = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [receiptResult, setReceiptResult] = useState<any>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const formData = new FormData();
    formData.append('receipt', file);

    try {
      // Assuming OCR endpoint parses receipt and returns extracted data
      const { data } = await api.post('/ocr/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setReceiptResult(data.data);
      toast.success('Receipt scanned successfully!');
    } catch (error) {
      toast.error('Failed to scan receipt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <header className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Smart Scanner</p>
        <h1 className="text-4xl font-display font-black tracking-tighter text-on-surface">Scan Receipt</h1>
      </header>

      {!receiptResult ? (
        <div className="bg-[#1A1A1A] border border-dashed border-white/20 rounded-[32px] p-10 text-center relative overflow-hidden group hover:border-primary/50 transition-colors">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleFileUpload}
            disabled={isScanning}
          />
          
          {isScanning ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <p className="text-white/70 font-medium">Analyzing receipt using AI...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl">document_scanner</span>
              </div>
              <h3 className="text-xl font-bold text-white">Tap to scan receipt</h3>
              <p className="text-white/40 text-sm max-w-xs">Upload a photo of your bill. Our AI will automatically extract items and amounts.</p>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1A1A] rounded-[32px] p-6 border border-white/5 shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white">Extracted Data</h3>
            <button 
              onClick={() => setReceiptResult(null)}
              className="text-primary text-sm font-bold uppercase tracking-wider"
            >
              Scan Again
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="bg-[#2A2A2A]/50 rounded-2xl p-4 flex justify-between items-center border border-white/5">
              <span className="text-white/50 text-sm">Total Amount</span>
              <span className="font-display font-bold text-2xl text-on-surface">
                ₹{receiptResult?.totalAmount || '0.00'}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2 pl-1">Items</p>
              <div className="space-y-2">
                {receiptResult?.items?.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-surface-container border border-white/5">
                    <span className="text-white/90 text-sm">{item.description}</span>
                    <span className="text-white font-medium">₹{item.amount}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full bg-primary text-on-primary font-bold rounded-2xl py-4 mt-6 hover:bg-primary/90 transition-transform flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">add_circle</span>
              Create Expense
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default OCRPage;