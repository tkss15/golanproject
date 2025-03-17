'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
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
  onSubmit: (data: User) => Promise<void>;
  onClose?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddUserDialog({
  initialData = null,
  onSubmit,
  onClose,
  isOpen = false,
  onOpenChange,
}: AddUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('user');
  const [formData, setFormData] = useState({
    given_name: '',
    family_name: '',
    email: '',
  });

  // Reset form when dialog opens or initial data changes
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
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const data: User = {
        given_name: formData.given_name,
        family_name: formData.family_name,
        email: formData.email,
        role: userRole,
      };
      
      if (initialData && initialData.id) {
        data.id = initialData.id;
      }
      
      // Call the onSubmit function passed from parent
      await onSubmit(data);
      
      // Reset form
      setFormData({
        given_name: '',
        family_name: '',
        email: '',
      });
      setUserRole('user');
      
      // Close dialog explicitly - this is critical!
      if (onOpenChange) {
        onOpenChange(false);
      }
      
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Don't close the dialog on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className='text-right'>
            {initialData ? 'ערוך משתמש' : 'הוסף משתמש חדש'}
          </DialogTitle>
          <DialogDescription className='text-right'>
            {initialData
              ? 'ערוך את פרטי המשתמש כאן.'
              : 'אנא מלא את הטופס כדי להוסיף משתמש חדש למערכת פתרון.'}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'שולח...' : (initialData ? 'שמור שינויים' : 'הוסף')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
