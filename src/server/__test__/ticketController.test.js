jest.mock('../models/User');
jest.mock('../models/Ticket');

const User  = require('../models/User');
const Ticket  = require('../models/Ticket');

const { createTicket, getTicketById, updateTicket, deleteTicket } = require('../controllers/ticket/ticketController');

describe('Ticket Controller', () => {
    let mockReq, mockRes;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            body: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };
    });

    describe('createTicket', () => {
        it('should create a new ticket successfully', async () => {
            mockReq.body = {
                title: 'Test Ticket',
                description: 'This is a test ticket',
                status: 'OPEN',
                priority: 'HIGH',
                created_by: 1
            };

            const createdTicket = {
                id: 1,
                ticket_number: 'TICKET-1234567890',
                title: 'Test Ticket',
                description: 'This is a test ticket',
                status: 'OPEN',
                priority: 'HIGH',
                created_by: 1
            };

            const ticketWithCreator = {
                ...createdTicket,
                creator: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com'
                }
            };

            Ticket.create.mockResolvedValue(createdTicket);
            Ticket.findByPk.mockResolvedValue(ticketWithCreator);

            await createTicket(mockReq, mockRes);

            expect(Ticket.create).toHaveBeenCalledWith({
                ticket_number: expect.stringContaining('TICKET-'),
                title: 'Test Ticket',
                description: 'This is a test ticket',
                status: 'OPEN',
                priority: 'HIGH',
                created_by: 1
            })

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                msg: 'Ticket created successfully',
                ticket: ticketWithCreator
            });
        })
    });

    describe('getTicketById', () => {
        it('should get ticket by ID successfully', async () => {
            mockReq.params = { id: 1 };

            const mockTicket = {
                id: 1,
                ticket_number: 'TICKET-1234567890',
                title: 'Test Ticket',
                description: 'This is a test ticket',
                creator: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com'
                }
            };

            Ticket.findByPk.mockResolvedValue(mockTicket);

            await getTicketById(mockReq, mockRes);

            expect(Ticket.findByPk).toHaveBeenCalledWith(1, {
                include: [{ model: User, as: 'creator', attributes: ['id', 'name', 'email'] }]
            });
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ ticket: mockTicket });
        });
    });

    describe('updateTicket', () => {
        it('should update ticket successfully', async () => {
            mockReq.params = { id: 1 };

            mockReq.body = {
                title: 'Updated Ticket',
                description: 'This is an updated test ticket',
                priority: 'LOW',
                status: 'IN_PROGRESS'
            };

            const existingTicket = {
                id: 1,
                ticket_number: 'TICKET-1234567890',
                title: 'Test Ticket',
                description: 'This is a test ticket',
                priority: 'HIGH',
                status: 'OPEN',
                update: jest.fn().mockResolvedValue(true),
            };

            const updatedTicket = {
                id: 1,
                title: 'Updated Ticket',
                description: 'This is an updated test ticket',
                priority: 'LOW',
                status: 'IN_PROGRESS',
                creator: {
                    id: 1,
                    name: 'Test User',
                    email: 'test@example.com'
                }
            };

            Ticket.findByPk
                .mockResolvedValueOnce(existingTicket)
                .mockResolvedValueOnce(updatedTicket);

            await updateTicket(mockReq, mockRes);

            expect(existingTicket.update).toHaveBeenCalledWith({
                title: 'Updated Ticket',
                description: 'This is an updated test ticket',
                priority: 'LOW',
                status: 'IN_PROGRESS',
                due_date: undefined
            });

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ticket updated successfully', ticket: updatedTicket });
        });
    });

    describe('deleteTicket', () => {
        it('should delete ticket successfully', async () => {
            mockReq.params = { id: 1 };

            const mockTicket = {
                id: 1,
                destroy: jest.fn().mockResolvedValue(true)
            };

            Ticket.findByPk.mockResolvedValue(mockTicket);

            await deleteTicket(mockReq, mockRes);

            expect(Ticket.findByPk).toHaveBeenCalledWith(1);
            expect(mockTicket.destroy).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Ticket deleted successfully' });
        });
    });
});