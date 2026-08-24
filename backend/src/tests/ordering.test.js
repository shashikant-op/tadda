jest.mock('../models/Branch', () => ({}));
jest.mock('../models/Subject', () => ({ exists: jest.fn() }));
jest.mock('../models/Topic', () => ({
  exists: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
  bulkWrite: jest.fn(),
  create: jest.fn()
}));
jest.mock('../models/Tutorial', () => ({
  findOne: jest.fn(),
  create: jest.fn()
}));

const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const Tutorial = require('../models/Tutorial');
const { createTopic, reorderTopics } = require('../controllers/category.controller');
const { createTutorialService } = require('../services/tutorial.service');

const orderedQuery = (order) => ({
  sort: jest.fn().mockReturnValue({
    select: jest.fn().mockResolvedValue(order === null ? null : { order })
  })
});

describe('curriculum ordering', () => {
  beforeEach(() => jest.clearAllMocks());

  test('a newly created topic is appended after the current last topic', async () => {
    Topic.findOne.mockReturnValue(orderedQuery(4));
    Topic.create.mockImplementation(async (data) => ({ _id: 'new-topic', ...data }));
    const req = { body: { name: 'Newest topic', subject: 'subject-id', description: '' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await createTopic(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(Topic.create).toHaveBeenCalledWith(expect.objectContaining({ order: 5 }));
  });

  test('a newly created lesson is appended after the current last lesson', async () => {
    Subject.exists.mockResolvedValue(true);
    Topic.exists.mockResolvedValue(true);
    Tutorial.findOne.mockImplementation((query) => query.slug ? Promise.resolve(null) : orderedQuery(7));
    Tutorial.create.mockImplementation(async (data) => ({ _id: 'new-lesson', ...data }));

    await createTutorialService({
      title: 'Newest lesson',
      description: 'Summary',
      content: 'Content',
      branch: 'branch-id',
      subject: 'subject-id',
      topic: 'topic-id'
    }, 'author-id');

    expect(Tutorial.create).toHaveBeenCalledWith(expect.objectContaining({ order: 8 }));
  });

  test('topic reordering verifies and returns the persisted database sequence', async () => {
    const topicIds = ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'];
    const subject = { toString: () => '507f1f77bcf86cd799439099' };
    Topic.find
      .mockReturnValueOnce({ select: jest.fn().mockResolvedValue([{ subject }, { subject }]) })
      .mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(topicIds.map((_id, order) => ({ _id, order })))
        })
      });
    Topic.bulkWrite.mockResolvedValue({ matchedCount: 2 });
    const req = { body: { topicIds } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await reorderTopics(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(Topic.bulkWrite).toHaveBeenCalledWith([
      expect.objectContaining({ updateOne: expect.objectContaining({ update: { $set: { order: 0 } } }) }),
      expect.objectContaining({ updateOne: expect.objectContaining({ update: { $set: { order: 1 } } }) })
    ]);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ data: { topics: expect.any(Array) } }));
  });
});
