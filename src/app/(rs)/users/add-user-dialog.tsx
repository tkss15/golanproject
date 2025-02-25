'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id?: string;
  given_name: string;
  family_name: string;
  role: string;
  email: string;
}

interface AddUserDialogProps {
  initialData?: User | null;
  onSubmit: (data: User) => void;
  onClose?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddUserDialog({
  initialData = null,
  onSubmit,
  onClose,
  open,
  onOpenChange,
}: AddUserDialogProps) {
  const [userRole, setUserRole] = useState('user');
  const [formData, setFormData] = useState({
    given_name: '',
    family_name: '',
    email: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        given_name: initialData.given_name,
        family_name: initialData.family_name,
        email: initialData.email,
      });
      setUserRole(initialData.role);
    } else {
      setFormData({
        given_name: '',
        family_name: '',
        email: '',
      });
      setUserRole('user');
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: User = {
      given_name: formData.given_name,
      family_name: formData.family_name,
      email: formData.email,
      role: userRole,
    };
    if (initialData && initialData.id) {
      data.id = initialData.id;
    }
    onSubmit(data);
    if (onClose) {
      onClose();
    }
  };

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
      <DialogHeader>
        <DialogTitle className='text-right'>
          {initialData ? 'ערוך משתמש' : 'הוסף משתמש חדש'}
        </DialogTitle>
        <DialogDescription className='text-right'>
          {initialData
            ? 'ערוך את פרטי המשתמש כאן.'
            : 'אנא מלא את הטופס כדי להוסיף משתמש חדש למערכת פתרו"ן.'}
        </DialogDescription>
      </DialogHeader>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label htmlFor="given_name" className="text-sm font-medium">
            שם פרטי
          </label>
          <input
            id="given_name"
            name="given_name"
            type="text"
            placeholder="אנא הכנס שם פרטי"
            className="px-3 py-2 border rounded-md"
            required
            value={formData.given_name}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="family_name" className="text-sm font-medium">
            שם משפחה
          </label>
          <input
            id="family_name"
            name="family_name"
            type="text"
            placeholder="אנא הכנס שם משפחה"
            className="px-3 py-2 border rounded-md"
            required
            value={formData.family_name}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm font-medium">
            דואר אלקטרוני
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="אנא הכנס דואר אלקטרוני"
            className="px-3 py-2 border rounded-md"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <label htmlFor="role" className="text-sm font-medium">
            תפקיד
          </label>
          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger className='flex flex-row-reverse'>
              <SelectValue placeholder="בחר תפקיד" />
            </SelectTrigger>
            <SelectContent dir='rtl'>
              <SelectItem value="admin">אדמין</SelectItem>
              <SelectItem value="manager">מנהל</SelectItem>
              <SelectItem value="user">משתמש</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2 gap-1.5">
          <DialogClose asChild>
            <Button variant="secondary" type="button">
              ביטול
            </Button>
          </DialogClose>
          <Button type="submit">
            {initialData ? 'שמור שינויים' : 'הוסף'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );

  // בדיקה אם הדיאלוג מנוהל מבחוץ
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  // דיאלוג בלתי מנוהל עם טריגר להוספת משתמש חדש
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          {initialData ? 'ערוך משתמש' : 'הוסף משתמש חדש'}
        </Button>
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
