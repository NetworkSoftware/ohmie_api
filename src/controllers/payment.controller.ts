import { Request, Response } from 'express';
import * as paymentService from '../services/payment.service';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const { jobId, amount, method } = req.body;
        const payment = await paymentService.createPayment(jobId, amount, method);
        res.status(201).json({ message: 'Payment created', payment });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to create payment' });
    }
};

export const markPaid = async (req: Request, res: Response) => {
    try {
        const paymentId = Number(req.params.id);
        const { transactionId } = req.body;
        const payment = await paymentService.markPaymentPaid(paymentId, transactionId);
        res.status(200).json({ message: 'Payment marked as paid', payment });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to mark payment' });
    }
};

export const listPayments = async (req: Request, res: Response) => {
    try {
        const { jobId, status } = req.query;
        const payments = await paymentService.listPayments({
            jobId: jobId ? Number(jobId) : undefined,
            status: status as string | undefined,
        });
        res.status(200).json({ payments });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to list payments' });
    }
};

export const getPayment = async (req: Request, res: Response) => {
    try {
        const payment = await paymentService.getPaymentById(Number(req.params.id));
        res.status(200).json({ payment });
    } catch (error: any) {
        res.status(error.status || 400).json({ error: error.message || 'Failed to get payment' });
    }
};
