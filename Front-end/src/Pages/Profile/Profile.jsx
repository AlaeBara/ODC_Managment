import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, X } from 'lucide-react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    profileImage: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [originalProfile, setOriginalProfile] = useState({});

  useEffect(() => {
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
          profileImage: data.profilePic || '',
        };
        setProfile(fetchedProfile);
        setOriginalProfile(fetchedProfile);
      })
      .catch((error) => console.error('Error fetching profile:', error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
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
        setProfile((prev) => ({ ...prev, profileImage: result.imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_LINK}/api/profile/UpdateProfile`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsEditing(false);
        setOriginalProfile(profile);
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setOriginalProfile(profile);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="container mx-auto p-4" style={{ fontFamily: 'Inter, sans-serif' }}>
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
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={profile.profileImage || 'defaultImageURL'}  // Ensure a default image URL or handle missing image
                className="w-32 h-32 rounded-full object-cover border-4 border-primary"
              />
              {isEditing && (
                <Label htmlFor="profileImage" className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  <Input
                    id="profileImage"
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
                    value={profile.currentPassword || ''}  // Ensure default empty string
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={profile.newPassword || ''}  // Ensure default empty string
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <Input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    value={profile.confirmNewPassword || ''}  // Ensure default empty string
                    onChange={handleInputChange}
                    required
                  />
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
};

export default Profile;