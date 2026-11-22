const VALID_STATUSES = ['Pending', 'In Progress', 'Completed'];
const VALID_PRIORITIES = ['Low', 'Medium', 'High'];

export const validateTaskCreate = (req, res, next) => {
  const { title, status, priority, category, dueDate } = req.body;
  const errors = {};

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    errors.title = 'Task title is required';
  } else if (title.trim().length > 200) {
    errors.title = 'Task title cannot exceed 200 characters';
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Due date must be a valid date';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Task validation failed',
      errors,
    });
  }

  next();
};

export const validateTaskUpdate = (req, res, next) => {
  const { title, status, priority, dueDate } = req.body;
  const errors = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.title = 'Task title cannot be empty';
    } else if (title.trim().length > 200) {
      errors.title = 'Task title cannot exceed 200 characters';
    }
  }

  if (status && !VALID_STATUSES.includes(status)) {
    errors.status = `Status must be one of: ${VALID_STATUSES.join(', ')}`;
  }

  if (priority && !VALID_PRIORITIES.includes(priority)) {
    errors.priority = `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`;
  }

  if (dueDate) {
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      errors.dueDate = 'Due date must be a valid date';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Task update validation failed',
      errors,
    });
  }

  next();
};

export const validateTaskStatus = (req, res, next) => {
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`,
    });
  }
  next();
};
