const { Op } = require('sequelize');
const Ticket = require('../../models/Ticket');
const User = require('../../models/User');


const createTicket = async (req, res) => {
  const { title, description, priority, status, created_by } = req.body;   
    try { 
        const ticketNumber = `TICKET-${Date.now()}`;
        const ticket = await Ticket.create({
            ticket_number: ticketNumber,
            title,
            description,
            priority,
            status,
            created_by
        });

        const creator = await Ticket.findByPk(ticket.id, {
            include: { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
        });

        res.status(201).json({ msg: 'Ticket created successfully', ticket: creator });

    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getAllTickets = async (req, res) => {
    const { 
        page = 1, 
        limit = 10,
        status, 
        priority, 
        search,
        sort_by = 'created_at',
        sort_order = 'DESC' 
    } = req.query;

    try {
        const offset = (page - 1) * limit;

        //To build dynamic where clause
        const whereClause = {};
        if (status) whereClause.status = status;
        if (priority) whereClause.priority = priority;
    
        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { ticket_number: { [Op.iLike]: `%${search}%` } }
            ];
        }   

        const { count, rows: tickets}  = await Ticket.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] },
            ],
            order: [[sort_by, sort_order.toUpperCase()]],
            limit: parseInt(limit),
            offset: offset
        });

        res.status(200).json({
            tickets,
            pagination: { 
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });

    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getTicketById = async (req, res) => {
    const { id } = req.params;

    try {
        const ticket = await Ticket.findByPk(id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
            ]
        });

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        res.status(200).json({ ticket });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const getMyTickets = async (req, res) => { 
    const { page = 1, limit = 10, status, search} = req.query;

    try {
        const offset = (page - 1) * limit;
        const whereClause = { created_by: req.user.userId };
        if (status) whereClause.status = status;

        if (search) {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { ticket_number: { [Op.iLike]: `%${search}%` } }
            ];
        }   

        const { count, rows: tickets}  = await Ticket.findAndCountAll({
            where: whereClause,
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: offset
        });

        res.status(200).json({
            tickets,
            pagination: { 
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

const updateTicket = async (req, res) => {
    const { id } = req.params;
    const { title, description, priority, status, due_date } = req.body;

    try { 
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }
        
        await ticket.update({
            title: title || ticket.title,
            description: description ||  ticket.description,
            priority: priority || ticket.priority,
            status: status || ticket.status,
            due_date: due_date !== undefined ? due_date : ticket.due_date
        });

        const updatedTicket = await Ticket.findByPk(id, {
            include: [
                { model: User, as: 'creator', attributes: ['id', 'name', 'email'] }
            ]
        });

        res.status(200).json({ msg: 'Ticket updated successfully', ticket: updatedTicket });

    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

const updateStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try { 
        const ticket = await Ticket.findByPk(id); 

        if (!ticket) {  
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        const updateData = { status };

        if (status === 'RESOLVED') {
            updateData.resolved_at = new Date();
        } else if (status === 'CLOSED') {
            updateData.closed_at = new Date();
        }

     
        await ticket.update(updateData);

        res.status(200).json({ msg: `Ticket status updated to ${status}`, ticket });

    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }

}

const deleteTicket = async (req, res) => {
    const { id } = req.params;

    try { 
        const ticket = await Ticket.findByPk(id);

        if (!ticket) {
            return res.status(404).json({ msg: 'Ticket not found' });
        }

        await ticket.destroy();

        res.status(200).json({ msg: 'Ticket deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};

module.exports = {
    createTicket,
    getAllTickets,
    getTicketById,
    getMyTickets,
    updateTicket,
    deleteTicket,
    updateStatus
};