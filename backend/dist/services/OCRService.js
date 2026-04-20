"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCRService = void 0;
const tesseract_js_1 = __importDefault(require("tesseract.js"));
const logger_1 = require("../config/logger");
class OCRService {
    async extract(fileUrl) {
        const result = await tesseract_js_1.default.recognize(fileUrl, 'eng', {
            logger: (m) => logger_1.logger.debug('OCR progress', { status: m.status, progress: m.progress }),
        });
        return {
            rawText: result.data.text,
            confidence: result.data.confidence / 100,
        };
    }
    parseAmount(rawText) {
        const patterns = [
            /(?:total|amount|net|grand total|payable)[:\s₹Rs.]*(\d+(?:[.,]\d{2})?)/i,
            /₹\s*(\d+(?:[.,]\d{2})?)/,
            /(\d+(?:[.,]\d{2})?)\s*(?:only|\/\-)/i,
        ];
        for (const pattern of patterns) {
            const match = rawText.match(pattern);
            if (match) {
                // Handle comma as decimal separator if needed
                const cleaned = match[1].replace(',', '.');
                return parseFloat(cleaned);
            }
        }
        return null;
    }
    detectMerchant(rawText) {
        const commonMerchants = [
            'Starbucks', 'McDonald\'s', 'Uber', 'Amazon', 'Flipkart', 'Zomato', 'Swiggy',
            'Reliance Digital', 'H&M', 'Zara', 'Netflix', 'Spotify', 'Apple'
        ];
        for (const merchant of commonMerchants) {
            if (new RegExp(merchant, 'i').test(rawText))
                return merchant;
        }
        // Fallback: try to find common shop-like endings
        const fallbackMatch = rawText.match(/([A-Z][a-zA-Z0-9\s&]{2,}) (?:Store|Shop|Cafe|Restaurant|Mart|Outlet|Pvt Ltd|Ltd)/i);
        return fallbackMatch ? fallbackMatch[1] : null;
    }
    categorizeFromText(rawText) {
        const lower = rawText.toLowerCase();
        if (/restaurant|food|cafe|hotel|swiggy|zomato/.test(lower))
            return 'FOOD';
        if (/flight|train|bus|taxi|cab|ola|uber/.test(lower))
            return 'TRAVEL';
        if (/electricity|water|gas|internet|wifi/.test(lower))
            return 'UTILITIES';
        if (/amazon|flipkart|mall|shop|mart/.test(lower))
            return 'SHOPPING';
        if (/movie|cinema|concert|entertainment/.test(lower))
            return 'ENTERTAINMENT';
        return 'OTHER';
    }
    parseDate(rawText) {
        const datePattern = /\b(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})\b/;
        const match = rawText.match(datePattern);
        return match ? match[1] : null;
    }
}
exports.OCRService = OCRService;
