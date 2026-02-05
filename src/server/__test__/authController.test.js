const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('../models/Role');

const User  = require('../models/User');
const Role  = require('../models/Role');

const { register, login } = require('../controllers/auth');

process.env.JWT_SECRET = 'testsecret';

describe('Auth Controller', () => {
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

  describe('register', () => {
        it('should register a new user successfully', async () => {
            mockReq.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue(null);
            User.create.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com'
            });
            Role.findOne.mockResolvedValue({ id: 1, name: 'USER' });

            await register(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
            expect(Role.findOne).toHaveBeenCalledWith({ where: { name: 'USER' } });
            expect(User.create).toHaveBeenCalled();

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                msg: 'User registered',
                userId: 1
            });
        });

        it('should return 400 if email already exists', async () => {
            mockReq.body = {
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            };
            User.findOne.mockResolvedValue({ id: 1, name: 'Test User', email: 'test@example.com' });

            await register(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'User already exists'});
            expect(User.create).not.toHaveBeenCalled();
        });
    });

  describe('login', () => {
        it('should login successfully and return a token', async () => {
            mockReq.body = {
                email: 'test@example.com',
                password: 'password123'
            };

            User.findOne.mockResolvedValue({
                id: 1,
                name: 'Test User',
                email: 'test@example.com',
                password_hash: await bcrypt.hash('password123', 10),
                role: { name: 'USER' }
            });

            await login(mockReq, mockRes);

            expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' }, include: { model: Role, as: 'role' } });

            const responseCall = mockRes.json.mock.calls[0][0];
            expect(responseCall.token).toBeDefined();
            expect(typeof responseCall.token).toBe('string');
        });

        it('should return 400 for incorrect password', async () => {
            mockReq.body = {
                email: 'invalid@example.com',
                password: 'wrongpassword'
            };

            User.findOne.mockResolvedValue(null);

            await login(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({ msg: 'Invalid credentials' });
        });
        
    });
});