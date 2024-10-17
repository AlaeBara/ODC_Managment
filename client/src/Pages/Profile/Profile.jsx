import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pencil, Save, X, User, Mail, Phone, Lock } from 'lucide-react'
import { Toaster, toast } from 'react-hot-toast'
import defaultProfilePic from '../../../public/images/profile.jpg';


export default function EnhancedUserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    setIsLoading(true);
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile. Please try again.');
        setIsLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    
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
        return;
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
        if (response.status === 400) {
          return response.json().then((errorData) => {
            if (errorData.message === "Current password is incorrect") {
              setPasswordErrors((prev) => ({
                ...prev,
                currentPassword: 'Current password is incorrect',
              }));
              throw new Error('Current password is incorrect');
            } else {
              throw new Error('Failed to update profile');
            }
          });
        }
  
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
          toast.success(`Updated the ${changedFields.join(', ')}`, {
            duration: 3000,
          });
        } else {
          toast.success('Profile updated successfully');
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
      });
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalProfile(profile);
    } else {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white-400 flex justify-center p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3 flex flex-col gap-6">
          <Card className="flex-grow-0 border-2">
            <CardContent className="flex flex-col items-center justify-center h-full p-6">
              <div className="relative mb-4">
                <img
                  src={profile.profilePic || defaultProfilePic}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                {isEditing && (
                  <Label htmlFor="profilePic" className="absolute bottom-0 right-0 bg-orange-500 text-white rounded-full p-2 cursor-pointer hover:bg-orange-600 transition-colors">
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
              <h2 className="text-xl md:text-2xl font-bold text-center mb-2">{`${profile.firstName} ${profile.lastName}`}</h2>
              <p className="text-sm text-gray-600 text-center">{profile.email}</p>
              <p className="text-sm text-gray-600 text-center">{profile.phoneNumber}</p>
            </CardContent>
          </Card>
        </div>
        <Card className="w-full md:w-2/3 flex-grow-0 max-h-[500px] overflow-auto border-2">
          <CardContent className="p-6 mt-3">
            <div className="flex justify-end mb-4"> 
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel} className="mr-2 bg-black hover:bg-gray-800 text-white">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} className="bg-green-500 hover:bg-green-700 text-white">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </>
              ) : (
                <Button onClick={toggleEdit} className="bg-orange-500 hover:bg-orange-700 text-white">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
            <Tabs defaultValue="account">
              <TabsList className="mb-4 bg-orange-100">
                <TabsTrigger value="account" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Account Info</TabsTrigger>
                <TabsTrigger value="password" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">Change Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profile.firstName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profile.lastName}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        value={profile.phoneNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </form>
              </TabsContent>
              <TabsContent value="password">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={profile.currentPassword || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {passwordErrors.currentPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={profile.newPassword || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {passwordErrors.newPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="confirmNewPassword"
                        name="confirmNewPassword"
                        type="password"
                        value={profile.confirmNewPassword || ''}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                    {passwordErrors.confirmNewPassword && (
                      <p className="text-red-500 text-sm">{passwordErrors.confirmNewPassword}</p>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}