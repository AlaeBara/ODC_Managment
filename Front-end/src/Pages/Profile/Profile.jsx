import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, X } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

export default function Component() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profilePic: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [originalProfile, setOriginalProfile] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    fetch(`${import.meta.env.VITE_API_LINK}/api/profile/Getprofile`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const fetchedProfile = {
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          profilePic: data.profilePic || '',
        };
        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile. Please try again.');
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    
    // Clear password errors when user starts typing
    if (['currentPassword', 'newPassword', 'confirmNewPassword'].includes(name)) {
      setPasswordErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      try {
        const response = await fetch(`${import.meta.env.VITE_API_LINK}/api/profile/upload-profile-picture`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const result = await response.json();
        setProfile((prev) => ({ ...prev, profilePic: result.imageUrl }));
        toast.success('Profile picture updated successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to update profile picture. Please try again.');
      }
    }
  };

  const validatePasswords = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    };
    let isValid = true;

    if (profile.newPassword || profile.confirmNewPassword) {
      if (!profile.currentPassword) {
        errors.currentPassword = 'Current password is required';
        isValid = false;
      }
      if (!profile.newPassword) {
        errors.newPassword = 'New password is required';
        isValid = false;
      }
      if (!profile.confirmNewPassword) {
        errors.confirmNewPassword = 'Confirm new password is required';
        isValid = false;
      }
      if (profile.newPassword !== profile.confirmNewPassword) {
        errors.confirmNewPassword = 'Passwords do not match';
        isValid = false;
      }
      if (profile.newPassword && profile.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters long';
        isValid = false;
      }
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const payload = {};
    const changedFields = [];
  
    if (profile.firstName !== originalProfile.firstName) {
      payload.firstName = profile.firstName;
      changedFields.push('First name');
    }
    if (profile.lastName !== originalProfile.lastName) {
      payload.lastName = profile.lastName;
      changedFields.push('Last name');
    }
    if (profile.email !== originalProfile.email) {
      payload.email = profile.email;
      changedFields.push('Email');
    }
    if (profile.phoneNumber !== originalProfile.phoneNumber) {
      payload.phoneNumber = profile.phoneNumber;
      changedFields.push('Phone number');
    }
  
    const isPasswordValid = validatePasswords();
    if (profile.currentPassword || profile.newPassword || profile.confirmNewPassword) {
      if (!isPasswordValid) {
        return; // Stop submission if passwords are invalid
      }
      payload.currentPassword = profile.currentPassword;
      payload.newPassword = profile.newPassword;
      payload.confirmNewPassword = profile.confirmNewPassword;
      changedFields.push('Password');
    }
  
    fetch(`${import.meta.env.VITE_API_LINK}/api/profile/UpdateProfile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update profile');
        }
        return response.json();
      })
      .then((data) => {
        setProfile(prevProfile => ({
          ...prevProfile,
          ...data.user,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: '',
        }));
        setOriginalProfile(data.user);
        setIsEditing(false);
        
        if (changedFields.length > 0) {
          toast.success(`Updated: ${changedFields.join(', ')}`, {
            duration: 3000,
          });
        } else {
          toast.success('Profile updated successfully');
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        toast.error('Failed to update profile. Please try again.');
      });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalProfile(profile);
    } else {
      // Reset password fields and errors when exiting edit mode
      setProfile(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }));
      setPasswordErrors({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
    // Reset password fields and errors
    setProfile(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }));
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Toaster position="top-right" />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="relative pb-0">
          <div className="absolute top-4 right-4 flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCancel}
                  className="text-red-600"
                >
                  <X className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSubmit}
                >
                  <Save className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={toggleEdit}
                className="bg-orange-500 hover:bg-orange-700"
              >
                <Pencil className="h-4 w-4 text-white" />
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={profile.profilePic || '/placeholder.svg?height=128&width=128'}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              {isEditing && (
                <Label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  <Input
                    id="profilePic"
                    type="file"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Label>
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-center mb-2">
              {isEditing ? (
                <div className="flex gap-2">
                  <Input
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    className="text-center"
                  />
                  <Input
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    className="text-center"
                  />
                </div>
              ) : (
                `${profile.firstName} ${profile.lastName}`
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="text-lg">{profile.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              {isEditing ? (
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={profile.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              ) : (
                <p className="text-lg">{profile.phoneNumber}</p>
              )}
            </div>
            {isEditing && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={profile.currentPassword || ''}
                    onChange={handleInputChange}
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.currentPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={profile.newPassword || ''}
                    onChange={handleInputChange}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={profile.confirmNewPassword || ''}
                    onChange={handleInputChange}
                  />
                  {passwordErrors.confirmNewPassword && (
                    <p className="text-red-500 text-sm">{passwordErrors.confirmNewPassword}</p>
                  )}
                </div>
              </>
            )}
            {isEditing && (
              <Button type="submit" className="w-full mt-6">Save Profile</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}