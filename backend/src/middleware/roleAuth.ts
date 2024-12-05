import { Request, Response, NextFunction } from 'express';
import { UserGroup } from '../types';

export const checkRole = (allowedRoles: UserGroup[]) => {
  return (req: Request & { user?: { id: number; userGroup: UserGroup } }, res: Response, next: NextFunction) => {
    console.log('1. User object:', req.user);
    console.log('2. User group:', req.user?.userGroup);
    console.log('3. Allowed roles:', allowedRoles);

    if (!req.user) {
      console.log('5. No user found');
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    if (!req.user.userGroup) {
      console.log('6. No user group found');
      return res.status(403).json({
        message: 'User group not found',
      });
    }

    const userGroup = req.user.userGroup;
    console.log('7. User group:', userGroup);

    if (!allowedRoles.includes(userGroup)) {
      console.log('8. Access denied');
      return res.status(403).json({
        message: 'Access denied',
      });
    }

    console.log('9. Access granted');
    next();
  };
};
