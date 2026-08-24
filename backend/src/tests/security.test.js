jest.mock('../models/User', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

jest.mock('../models/Tutorial', () => ({
  countDocuments: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn()
}));

jest.mock('../models/Quiz', () => ({
  findById: jest.fn(),
  create: jest.fn()
}));

const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Quiz = require('../models/Quiz');
const { registerSchema } = require('../validators/auth.validator');
const { escapeRegex } = require('../utils/regex');
const { getPagination } = require('../utils/pagination');
const { registerUser } = require('../services/auth.service');
const { getTutorials, getTutorialBySlug } = require('../controllers/tutorial.controller');
const { createQuiz, getQuiz } = require('../controllers/quiz.controller');

const createResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe('security boundaries', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'unit-test-secret';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('public registration rejects caller-supplied roles', () => {
    const result = registerSchema.validate({
      name: 'Attacker',
      email: 'attacker@example.com',
      password: 'password123',
      role: 'admin'
    });

    expect(result.error).toBeDefined();
  });

  test('search terms are escaped before becoming regular expressions', () => {
    const regex = new RegExp(escapeRegex('C++ (basics)?'), 'i');
    expect(regex.test('Learn C++ (basics)? today')).toBe(true);
    expect(regex.test('Learn CCCC basics today')).toBe(false);
  });

  test('pagination caps client-requested page sizes', () => {
    expect(getPagination({ page: '2', limit: '1000' })).toEqual({ page: 2, limit: 100, skip: 100 });
  });

  test('registration service always creates a student', async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockImplementation(async (data) => ({
      _id: 'user-id',
      ...data,
      avatar: ''
    }));

    await registerUser({
      name: 'Attacker',
      email: 'attacker@example.com',
      password: 'password123',
      role: 'admin'
    });

    expect(User.create).toHaveBeenCalledWith(expect.objectContaining({ role: 'student' }));
  });

  test('public tutorial listings always filter to published content', async () => {
    const limit = jest.fn().mockResolvedValue([]);
    const skip = jest.fn(() => ({ limit }));
    const sort = jest.fn(() => ({ skip }));
    const populate = jest.fn(() => ({ sort }));
    Tutorial.countDocuments.mockResolvedValue(0);
    Tutorial.find.mockReturnValue({ populate });

    const req = { query: { status: 'draft' } };
    const res = createResponse();
    const next = jest.fn();
    await getTutorials(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(Tutorial.countDocuments).toHaveBeenCalledWith({ status: 'published' });
    expect(Tutorial.find).toHaveBeenCalledWith({ status: 'published' });
  });

  test('public tutorial detail lookup requires published status', async () => {
    const populate = jest.fn().mockResolvedValue(null);
    Tutorial.findOne.mockReturnValue({ populate });

    const req = { params: { slug: 'draft-lesson' }, query: {} };
    const res = createResponse();
    const next = jest.fn();
    await getTutorialBySlug(req, res, next);

    expect(Tutorial.findOne).toHaveBeenCalledWith({ slug: 'draft-lesson', status: 'published' });
  });

  test('quiz retrieval removes answer keys', async () => {
    const quiz = {
      toObject: () => ({
        _id: 'quiz-id',
        questions: [{ question: 'Q?', options: ['A', 'B'], correctAnswer: 'A' }]
      })
    };
    Quiz.findById.mockReturnValue({ populate: jest.fn().mockResolvedValue(quiz) });

    const req = { params: { id: 'quiz-id' }, user: { role: 'author' } };
    const res = createResponse();
    const next = jest.fn();
    await getQuiz(req, res, next);

    const payload = res.json.mock.calls[0][0];
    expect(payload.data.quiz.questions[0].correctAnswer).toBeUndefined();
  });

  test('authors cannot attach quizzes to another author tutorial', async () => {
    Tutorial.findById.mockResolvedValue({
      author: { toString: () => 'other-author' },
      quiz: null
    });

    const req = {
      body: { tutorial: 'tutorial-id', questions: [] },
      user: { _id: { toString: () => 'requesting-author' }, role: 'author' }
    };
    const res = createResponse();
    const next = jest.fn();
    await createQuiz(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));
    expect(Quiz.create).not.toHaveBeenCalled();
  });
});
