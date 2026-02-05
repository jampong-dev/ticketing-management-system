const jwt = require('jsonwebtoken');
const authMiddleWare = require('../middleware/authMiddleWare');

process.env.JWT_SECRET = 'test-secret-key';

describe('Auth Middleware', () => {
    let mockReq, mockRes, mockNext;

    beforeEach(() => {
        jest.clearAllMocks();

        mockReq = {
            headers: {}
        };

        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        mockNext = jest.fn();
    });

    it('should call next() for valid token', () => {
        const payload = { userId: 1, role: "USER" };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        mockReq.headers.authorization = `Bearer ${token}`;

        authMiddleWare(mockReq, mockRes, mockNext);

        expect(mockNext).toHaveBeenCalled();
        expect(mockReq.user).toBeDefined();
        expect(mockReq.user.userId).toBe(1);
        expect(mockReq.user.role).toBe("USER");
    });

    it('should return 401 if no token is provided', () => {
        authMiddleWare(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({ msg: 'No token provided' });
        expect(mockNext).not.toHaveBeenCalled();
    });
});