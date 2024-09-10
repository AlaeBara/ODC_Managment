import React from 'react';
import { Button } from '@/components/ui/button';

const ConfirmModal = ({ onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 className="text-xl font-semibold mb-2 text-black">Confirm Deletion</h3>
        <p className="mb-6 text-gray-600 text-sm">
          Are you sure you want to delete the selected formations? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button 
            onClick={onClose} 
            variant="outline"
            className="bg-white text-black border-gray-300 hover:bg-gray-100 hover:text-black"
          >
            Cancel
          </Button>
          <Button 
            onClick={onConfirm} 
            className="bg-orange-500 text-white hover:bg-orange-600 hover:text-white"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
