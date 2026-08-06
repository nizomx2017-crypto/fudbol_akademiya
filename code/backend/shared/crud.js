const asyncHandler = require("./async-handler");
const { AppError } = require("./errors");
const { pagination } = require("./validate");
function repository(Model) { return {
  list: (query = {}) => { const { limit, offset } = pagination(query); return Model.findAndCountAll({ limit, offset, order: [["createdAt", "DESC"]] }); },
  get: (id, options) => Model.findByPk(id, options), create: (data, options) => Model.create(data, options),
  update: async (id, data) => { const row = await Model.findByPk(id); if (!row) throw new AppError(404, "Yozuv topilmadi", "NOT_FOUND"); return row.update(data); },
  remove: async (id) => { const count = await Model.destroy({ where: { id } }); if (!count) throw new AppError(404, "Yozuv topilmadi", "NOT_FOUND"); }
}; }
function service(repo) { return { list: repo.list, get: repo.get, create: repo.create, update: repo.update, remove: repo.remove }; }
function controller(svc) { return {
  list: asyncHandler(async (req, res) => { const result = await svc.list(req.query); res.json({ data: result.rows, meta: { total: result.count, page: Number(req.query.page) || 1 } }); }),
  get: asyncHandler(async (req, res) => { const row = await svc.get(req.params.id); if (!row) throw new AppError(404, "Yozuv topilmadi", "NOT_FOUND"); res.json(row); }),
  create: asyncHandler(async (req, res) => res.status(201).json(await svc.create(req.body))),
  update: asyncHandler(async (req, res) => res.json(await svc.update(req.params.id, req.body))),
  remove: asyncHandler(async (req, res) => { await svc.remove(req.params.id); res.status(204).end(); })
}; }
function routes(express, ctrl, validation) { const router = express.Router(); const validate = require("./validate").validate; router.get("/", ctrl.list); router.get("/:id", ctrl.get); router.post("/", validate(validation), ctrl.create); router.patch("/:id", ctrl.update); router.delete("/:id", ctrl.remove); return router; }
module.exports = { repository, service, controller, routes };
