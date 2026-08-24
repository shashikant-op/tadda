jest.mock('../models/User', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Tutorial', () => ({ countDocuments: jest.fn(), find: jest.fn() }));
jest.mock('../models/Branch', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Subject', () => ({ countDocuments: jest.fn() }));
jest.mock('../models/Topic', () => ({ countDocuments: jest.fn() }));

const User = require('../models/User');
const Tutorial = require('../models/Tutorial');
const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const { getAnalytics } = require('../controllers/admin.controller');

test('admin analytics returns database counts under stats', async () => {
  User.countDocuments.mockImplementation((filter) => Promise.resolve(filter?.role === 'author' ? 2 : 7));
  Tutorial.countDocuments.mockResolvedValue(18);
  Branch.countDocuments.mockResolvedValue(4);
  Subject.countDocuments.mockResolvedValue(9);
  Topic.countDocuments.mockResolvedValue(21);
  const select = jest.fn().mockResolvedValue([{ title: 'Popular', slug: 'popular', views: 10 }]);
  const limit = jest.fn(() => ({ select }));
  const sort = jest.fn(() => ({ limit }));
  Tutorial.find.mockReturnValue({ sort });

  const res = { status: jest.fn(), json: jest.fn() };
  res.status.mockReturnValue(res);
  const next = jest.fn();
  await getAnalytics({}, res, next);

  expect(next).not.toHaveBeenCalled();
  expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
    data: expect.objectContaining({
      stats: {
        totalUsers: 7,
        totalTutorials: 18,
        totalBranches: 4,
        totalSubjects: 9,
        totalTopics: 21,
        activeAuthors: 2
      }
    })
  }));
});
