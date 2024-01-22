import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import { Prisma } from '@prisma/client';

export async function getBooking(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
        const userId = req.userId;

        const booking = await prisma.booking.findUnique({
            where: { userId: userId },
            include: {
                Room: {
                   
                    select: {
                        id: true,
                        name: true,
      
                    },
                },
            },
        });

        if (!booking) {
            return res.status(httpStatus.NOT_FOUND).json({ error: 'Booking not found' });
        }

        const response = {
            id: booking.id,
            Room: {
                id: booking.Room.id,
                name: booking.Room.name,
            },
        };

        res.status(httpStatus.OK).json(response);
    } catch (error) {
        console.error('Error getting booking:', error);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
    }
}
