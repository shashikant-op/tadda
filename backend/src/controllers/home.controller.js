const Branch = require('../models/Branch');
const Subject = require('../models/Subject');
const Tutorial = require('../models/Tutorial');
const ApiResponse = require('../utils/ApiResponse');
const { loadHomeCache } = require('../utils/homeCache');

const imageUrlForHomepage = (branch) => {
  if (branch.hasEmbeddedImage) return `/api/v1/branches/${branch._id}/image`;
  if (!branch.image) return '';
  return branch.image;
};

const loadHomepageData = async () => {
  const queryStartedAt = process.hrtime.bigint();
  const [branches, subjects, tutorials] = await Promise.all([
    Branch.aggregate([{
      $project: {
        name: 1,
        slug: 1,
        description: 1,
        image: {
          $cond: [
            { $regexMatch: { input: { $ifNull: ['$image', ''] }, regex: /^data:/ } },
            '',
            '$image'
          ]
        },
        hasEmbeddedImage: {
          $regexMatch: { input: { $ifNull: ['$image', ''] }, regex: /^data:/ }
        }
      }
    }]),
    Subject.find({})
      .select('_id name slug branch description')
      .lean(),
    Tutorial.find({ status: 'published' })
      .select('_id title slug description branch subject createdAt')
      .sort({ createdAt: -1 })
      .limit(6)
      .lean()
  ]);

  const branchById = new Map(branches.map((branch) => [branch._id.toString(), branch]));
  const subjectById = new Map(subjects.map((subject) => [subject._id.toString(), subject]));

  const subjectCounts = subjects.reduce((counts, subject) => {
    const branchId = subject.branch?.toString();
    if (branchId) counts.set(branchId, (counts.get(branchId) || 0) + 1);
    return counts;
  }, new Map());

  const data = {
    branches: branches.map((branch) => ({
      ...branch,
      image: imageUrlForHomepage(branch),
      subjectCount: subjectCounts.get(branch._id.toString()) || 0,
      hasEmbeddedImage: undefined
    })),
    courses: subjects.map((subject) => ({
      ...subject,
      branchSlug: branchById.get(subject.branch?.toString())?.slug || ''
    })),
    tutorials: tutorials.map((tutorial) => ({
      ...tutorial,
      branch: branchById.get(tutorial.branch?.toString())
        ? {
            _id: tutorial.branch,
            name: branchById.get(tutorial.branch.toString()).name,
            slug: branchById.get(tutorial.branch.toString()).slug
          }
        : tutorial.branch,
      subject: subjectById.get(tutorial.subject?.toString())
        ? {
            _id: tutorial.subject,
            name: subjectById.get(tutorial.subject.toString()).name,
            slug: subjectById.get(tutorial.subject.toString()).slug
          }
        : tutorial.subject
    }))
  };

  if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
    const durationMs = Number(process.hrtime.bigint() - queryStartedAt) / 1e6;
    const payloadBytes = Buffer.byteLength(JSON.stringify(data));
    console.info(`[performance] homepage database=${durationMs.toFixed(1)}ms payload=${payloadBytes}B branches=${data.branches.length} courses=${data.courses.length} tutorials=${data.tutorials.length}`);
  }

  return data;
};

const getHome = async (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  try {
    const { value, status } = await loadHomeCache(loadHomepageData);
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.set('X-Home-Cache', status);
    res.set('Server-Timing', `home;dur=${durationMs.toFixed(1)}`);
    res.status(200).json(new ApiResponse(200, 'Homepage data fetched successfully', value));
  } catch (err) {
    next(err);
  }
};

module.exports = { getHome, loadHomepageData };
