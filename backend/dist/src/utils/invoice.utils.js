"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateInvoicePDF = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
// Generate GST invoice PDF
const generateInvoicePDF = (order) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ margin: 50 });
        const buffers = [];
        // Collect PDF data chunks
        doc.on('data', (chunk) => buffers.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        // Company info
        doc.fontSize(20).text('Needle Fashion', { align: 'center' });
        doc.fontSize(10).text('Premium Ethnic Wear', { align: 'center' });
        doc.moveDown();
        doc.text('123 Fashion Street, Mumbai, Maharashtra - 400001', { align: 'center' });
        doc.text('GSTIN: 27AABCN1234A1Z5', { align: 'center' });
        doc.moveDown(2);
        // Invoice header
        doc.fontSize(16).text('TAX INVOICE', { align: 'center' });
        doc.moveDown();
        // Invoice details
        doc.fontSize(10);
        doc.text(`Invoice Number: INV-${order._id.toString().slice(-6).toUpperCase()}`);
        doc.text(`Order ID: ${order._id}`);
        doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
        doc.moveDown();
        // Customer details
        doc.text('Bill To:');
        doc.text(`Name: ${order.user.toString()}`);
        doc.text(`Address: ${order.shippingAddress.address}`);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.postalCode}`);
        doc.text(`Country: ${order.shippingAddress.country}`);
        doc.moveDown();
        // Table header
        const invoiceTableTop = doc.y;
        doc.font('Helvetica-Bold');
        doc.text('Item', 50, invoiceTableTop);
        doc.text('Qty', 280, invoiceTableTop);
        doc.text('Price', 350, invoiceTableTop);
        doc.text('GST (18%)', 400, invoiceTableTop);
        doc.text('Total', 480, invoiceTableTop);
        doc.moveDown();
        // Reset font
        doc.font('Helvetica');
        // Table items
        let position = doc.y;
        order.items.forEach((item) => {
            const productTotal = item.price * item.quantity;
            const gstAmount = productTotal * 0.18; // 18% GST
            doc.text(item.product.toString(), 50, position);
            doc.text(item.quantity.toString(), 280, position);
            doc.text(`₹${item.price.toFixed(2)}`, 350, position);
            doc.text(`₹${gstAmount.toFixed(2)}`, 400, position);
            doc.text(`₹${(productTotal + gstAmount).toFixed(2)}`, 480, position);
            position = doc.y + 20;
        });
        // Summary
        doc.moveDown(2);
        doc.text(`Subtotal: ₹${order.itemsPrice.toFixed(2)}`, { align: 'right' });
        doc.text(`GST (18%): ₹${order.taxPrice.toFixed(2)}`, { align: 'right' });
        doc.text(`Shipping: ₹${order.shippingPrice.toFixed(2)}`, { align: 'right' });
        doc.font('Helvetica-Bold');
        doc.text(`Total: ₹${order.totalPrice.toFixed(2)}`, { align: 'right' });
        doc.font('Helvetica');
        // Footer
        doc.moveDown(2);
        doc.fontSize(10).text('Thank you for shopping with Needle Fashion!', { align: 'center' });
        doc.text('This is a computer-generated invoice and does not require a signature.', { align: 'center' });
        // Finalize PDF
        doc.end();
    });
});
exports.generateInvoicePDF = generateInvoicePDF;
//# sourceMappingURL=invoice.utils.js.map