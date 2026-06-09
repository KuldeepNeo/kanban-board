import { AppError } from './error.middleware.js';

export function validateRegister(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || typeof username !== 'string' || username.trim() === '') {
    return next(new AppError('Username is required', 400));
  }

  if (!email || typeof email !== 'string' || email.trim() === '') {
    return next(new AppError('Email is required', 400));
  }

  // Basic email pattern validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new AppError('Invalid email format', 400));
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return next(new AppError('Password must be at least 6 characters long', 400));
  }

  req.body = {
    username: username.trim(),
    email: email.trim(),
    password: password
  };

  next();
}

export function validateLogin(req, res, next) {
  const { emailOrUsername, password } = req.body;

  if (!emailOrUsername || typeof emailOrUsername !== 'string' || emailOrUsername.trim() === '') {
    return next(new AppError('Email or Username is required', 400));
  }

  if (!password || typeof password !== 'string' || password === '') {
    return next(new AppError('Password is required', 400));
  }

  req.body = {
    emailOrUsername: emailOrUsername.trim(),
    password: password
  };

  next();
}

export function validateTicketBody(req, res, next) {
  const { title, description, status, assignee } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return next(new AppError('Title is required', 400));
  }

  if (!description || typeof description !== 'string' || description.trim() === '') {
    return next(new AppError('Description is required', 400));
  }

  const validStatuses = ['Todo', 'In Progress', 'Complete', 'Closed'];
  if (!status || !validStatuses.includes(status)) {
    return next(new AppError('Valid status is required (Todo, In Progress, Complete, Closed)', 400));
  }

  req.body = {
    title: title.trim(),
    description: description.trim(),
    status: status,
    assignee: typeof assignee === 'string' ? assignee.trim() : null
  };

  next();
}

export function validateTicketUpdateBody(req, res, next) {
  const { title, description, status, assignee } = req.body;
  const updates = {};

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === '') {
      return next(new AppError('Title cannot be empty', 400));
    }
    updates.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== 'string' || description.trim() === '') {
      return next(new AppError('Description cannot be empty', 400));
    }
    updates.description = description.trim();
  }

  if (status !== undefined) {
    const validStatuses = ['Todo', 'In Progress', 'Complete', 'Closed'];
    if (!validStatuses.includes(status)) {
      return next(new AppError('Status must be one of: Todo, In Progress, Complete, Closed', 400));
    }
    updates.status = status;
  }

  if (assignee !== undefined) {
    updates.assignee = typeof assignee === 'string' ? assignee.trim() : null;
  }

  req.body = updates;
  next();
}

export function validateCommentBody(req, res, next) {
  const { comment_text } = req.body;

  if (!comment_text || typeof comment_text !== 'string' || comment_text.trim() === '') {
    return next(new AppError('Comment text is required', 400));
  }

  req.body = {
    comment_text: comment_text.trim()
  };

  next();
}

export function validateIdParam(req, res, next) {
  const { id } = req.params;
  const idNum = Number(id);

  if (isNaN(idNum) || !Number.isInteger(idNum) || idNum <= 0) {
    return next(new AppError('Invalid identifier format', 400));
  }

  req.params.id = idNum;
  next();
}
